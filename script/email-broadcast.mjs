#!/usr/bin/env node

/**
 * Email Broadcast Script
 *
 * Reads newly added post files, renders them to email-safe HTML,
 * and sends a Kit (ConvertKit) broadcast for each published post.
 *
 * Usage: node script/email-broadcast.mjs <file-with-post-paths>
 *
 * Environment variables:
 *   KIT_API_KEY  – Kit API key (required)
 *   SITE_URL     – Base URL of the site (default: https://ben.balter.com)
 */

import { readFileSync } from 'node:fs';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import matter from 'gray-matter';

// Use the shared remark plugins but only email-safe rehype plugins.
// We import the lists and then filter out web-only transforms.
import {
  sharedRemarkPlugins,
  sharedShikiConfig,
} from '../src/lib/markdown-pipeline.ts';

// Email-safe rehype plugins — omit anchor links, relative URL rewriting,
// and other web-only transforms that produce broken output in email clients.
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import { rehypeBootstrapTables } from '../src/lib/rehype-bootstrap-tables.ts';
import { rehypeFigure } from '../src/lib/rehype-figure.ts';
import { rehypeImageLoading } from '../src/lib/rehype-image-loading.ts';

const KIT_API_URL = 'https://api.kit.com/v4/broadcasts';
const SITE_URL = process.env.SITE_URL || 'https://ben.balter.com';

/** Build an email-safe rehype plugin list (no anchor links, no relative URLs) */
const emailRehypePlugins = [
  rehypeSlug,
  rehypeAccessibleEmojis,
  rehypeRaw,
  rehypeBootstrapTables,
  rehypeFigure,
  rehypeImageLoading,
  [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
];

/**
 * Extract post slug from file path.
 * e.g. "src/content/posts/2024-01-15-my-post.md" → "2024-01-15-my-post"
 */
function getSlugFromPath(filePath) {
  const filename = filePath.split('/').pop();
  return filename.replace(/\.(md|mdx)$/, '');
}

/**
 * Convert a slug like "2024-01-15-my-post" to a URL path "/2024/01/15/my-post/"
 */
function getPostUrl(slug) {
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (match) {
    const [, year, month, day, postSlug] = match;
    return `/${year}/${month}/${day}/${postSlug}/`;
  }
  return `/posts/${slug}/`;
}

/**
 * Check if a post should be published (mirrors isPublishedPost logic)
 */
function isPublished(frontmatter) {
  return frontmatter.published !== false && frontmatter.archived !== true;
}

async function main() {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    console.error('KIT_API_KEY environment variable is required');
    process.exit(1);
  }

  const postListFile = process.argv[2];
  if (!postListFile) {
    console.error('Usage: node script/email-broadcast.mjs <file-with-post-paths>');
    process.exit(1);
  }

  const postPaths = readFileSync(postListFile, 'utf-8')
    .trim()
    .split('\n')
    .filter(Boolean);

  if (postPaths.length === 0) {
    console.log('No post paths to process');
    return;
  }

  // Warn if multiple posts — send all but log prominently
  if (postPaths.length > 1) {
    console.warn(`⚠️  ${postPaths.length} new posts detected — sending a broadcast for each`);
  }

  const processor = await createMarkdownProcessor({
    remarkPlugins: sharedRemarkPlugins,
    rehypePlugins: emailRehypePlugins,
    shikiConfig: sharedShikiConfig,
  });

  let sent = 0;
  let skipped = 0;

  for (const postPath of postPaths) {
    const slug = getSlugFromPath(postPath);
    const postUrl = getPostUrl(slug);
    const fullUrl = `${SITE_URL}${postUrl}`;

    console.log(`Processing: ${postPath}`);

    // Read and parse front matter
    const raw = readFileSync(postPath, 'utf-8');
    const { data: frontmatter, content: markdownBody } = matter(raw);

    // Skip unpublished/archived posts
    if (!isPublished(frontmatter)) {
      console.log(`  Skipping (not published): ${frontmatter.title || slug}`);
      skipped++;
      continue;
    }

    if (!frontmatter.title) {
      console.error(`  Skipping (no title): ${postPath}`);
      skipped++;
      continue;
    }

    // Render markdown to email-safe HTML
    const result = await processor.render(markdownBody, {
      frontmatter,
    });

    // Wrap content with a "Read on the web" link
    const emailHtml = [
      result.code,
      `<hr />`,
      `<p><a href="${fullUrl}">Read this post on the web →</a></p>`,
    ].join('\n');

    // Build Kit API payload
    const payload = {
      subject: frontmatter.title,
      content: emailHtml,
      description: frontmatter.description || '',
      preview_text: frontmatter.description || '',
      public: true,
      published_at: new Date().toISOString(),
      send_at: new Date().toISOString(),
      subscriber_filter: [{ all: [{ type: 'all_subscribers' }] }],
    };

    console.log(`  Sending broadcast: "${frontmatter.title}"`);

    const response = await fetch(KIT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`  ❌ Kit API error (${response.status}): ${body}`);
      process.exit(1);
    }

    const result_data = await response.json();
    console.log(`  ✅ Broadcast created (id: ${result_data.broadcast?.id || 'unknown'})`);
    sent++;
  }

  console.log(`\nDone: ${sent} sent, ${skipped} skipped`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
