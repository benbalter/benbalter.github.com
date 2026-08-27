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
 *   DRY_RUN      – Set to 'true' to preview without sending
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
import { stripMdxSyntax } from '../src/utils/strip-mdx-syntax.ts';
import { leadInHtml, bookCtaHtml } from '../src/lib/email-framing.ts';

// Email-safe rehype plugins — omit anchor links, relative URL rewriting,
// and other web-only transforms that produce broken output in email clients.
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import { rehypeBootstrapTables } from '../src/lib/rehype-bootstrap-tables.ts';
import { rehypeFigure } from '../src/lib/rehype-figure.ts';
import { rehypeImageLoading } from '../src/lib/rehype-image-loading.ts';
import { rehypeEmailQuotePlain } from '../src/lib/rehype-email-quote-plain.ts';

const KIT_API_URL = 'https://api.kit.com/v4/broadcasts';
const KIT_SEGMENTS_URL = 'https://api.kit.com/v4/segments';
const SITE_URL = process.env.SITE_URL || 'https://ben.balter.com';
const DRY_RUN = process.env.DRY_RUN === 'true';
// A manual workflow_dispatch with an explicit post_path is an intentional
// "send this now" — force past the already-broadcast dedupe check.
const FORCE_SEND = process.env.FORCE_SEND === 'true';
// Kit no longer sends to everyone when subscriber_filter is omitted (it 422s at
// send) and rejects an explicit all_subscribers filter (422 at create), so a
// broadcast must reference a real segment/tag. This UI-created segment matches
// all subscribers; override the name via env if it's ever renamed.
const ALL_SUBSCRIBERS_SEGMENT_NAME =
  process.env.KIT_ALL_SUBSCRIBERS_SEGMENT || 'All subscribers';

/** Build an email-safe rehype plugin list (no anchor links, no relative URLs) */
const emailRehypePlugins = [
  rehypeSlug,
  rehypeAccessibleEmojis,
  rehypeRaw,
  rehypeBootstrapTables,
  rehypeFigure,
  rehypeImageLoading,
  // Flatten the web-only :quote share affordance to plain highlighted text. Its
  // inline share-icon SVG has no width/height and is CSS-sized on the web; email
  // clients drop that CSS, so it otherwise renders as a giant graphic.
  rehypeEmailQuotePlain,
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

/**
 * Fetch existing broadcasts from Kit to check for duplicates.
 * Returns a Set of subjects that have ALREADY BEEN SENT.
 *
 * Drafts are deliberately excluded: Kit "saves as draft" when a POST fails
 * (transient/capacity/rate-limit 422s), so a failed attempt leaves a draft with
 * this subject behind. Counting drafts here would make the very next run skip
 * the post as "already broadcast" and it would never actually send.
 */
async function getExistingBroadcastSubjects(apiKey) {
  const subjects = new Set();
  try {
    const response = await fetch(KIT_API_URL, {
      headers: { 'X-Kit-Api-Key': apiKey },
    });
    if (response.ok) {
      const data = await response.json();
      for (const broadcast of data.broadcasts || []) {
        // Only a sent/sending broadcast means "already broadcast" — never a draft.
        if (broadcast.subject && broadcast.status && broadcast.status !== 'draft') {
          subjects.add(broadcast.subject);
        }
      }
    }
  } catch {
    console.warn('  ⚠️  Could not fetch existing broadcasts for dedupe check');
  }
  return subjects;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Delete any DRAFT broadcasts with this subject (leftovers from failed POSTs). */
async function deleteDraftBroadcastsWithSubject(subject, apiKey) {
  try {
    const response = await fetch(KIT_API_URL, { headers: { 'X-Kit-Api-Key': apiKey } });
    if (!response.ok) return;
    const data = await response.json();
    for (const b of data.broadcasts || []) {
      if (b.id && b.status === 'draft' && b.subject === subject) {
        await fetch(`${KIT_API_URL}/${b.id}`, {
          method: 'DELETE',
          headers: { 'X-Kit-Api-Key': apiKey },
        });
        console.log(`  🧹 Removed stale draft (id: ${b.id})`);
      }
    }
  } catch {
    // Best-effort cleanup; a leftover draft is handled by the dedupe change too.
  }
}

/**
 * POST a broadcast, retrying on 422. Kit returns 422 not only for bad data but
 * also for transient/capacity and rate-limit conditions ("Please try again" /
 * "try and send it later"), and it "saves as draft" on failure. So between
 * attempts we clear any saved draft (to avoid pileup) and back off before
 * retrying. A genuine bad-data 422 simply exhausts the retries and throws.
 */
async function createBroadcastWithRetry(payload, apiKey) {
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(KIT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': apiKey },
      body: JSON.stringify(payload),
    });
    if (response.ok) return await response.json();

    const body = await response.text();
    if (response.status === 422 && attempt < maxAttempts) {
      console.warn(`  ⚠️  Kit 422 (attempt ${attempt}/${maxAttempts}): ${body}`);
      await deleteDraftBroadcastsWithSubject(payload.subject, apiKey);
      await sleep(2000 * attempt); // linear backoff: 2s, 4s, 6s
      continue;
    }
    throw new Error(`Kit API error (${response.status}): ${body}`);
  }
}

/**
 * Resolve the id of the segment that targets all subscribers. Kit's v4 API
 * rejects both an omitted filter (422 at send) and an explicit all_subscribers
 * filter (422 at create), so every broadcast must reference a real segment.
 */
async function getAllSubscribersSegmentId(apiKey) {
  const response = await fetch(`${KIT_SEGMENTS_URL}?per_page=100`, {
    headers: { 'X-Kit-Api-Key': apiKey },
  });
  if (!response.ok) {
    throw new Error(`Could not list Kit segments (${response.status})`);
  }
  const data = await response.json();
  const segment = (data.segments || []).find(
    (s) => (s.name || '').toLowerCase() === ALL_SUBSCRIBERS_SEGMENT_NAME.toLowerCase()
  );
  if (!segment) {
    throw new Error(
      `No Kit segment named "${ALL_SUBSCRIBERS_SEGMENT_NAME}". Create one in the ` +
        `Kit UI (a segment matching all subscribers) so broadcasts can target it.`
    );
  }
  return segment.id;
}

async function main() {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    console.error('KIT_API_KEY environment variable is required');
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log('🏜️  DRY RUN — will preview broadcasts without sending\n');
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

  // Resolve the all-subscribers segment up front so a misconfiguration fails
  // before we render or send anything.
  let allSubscribersSegmentId;
  try {
    allSubscribersSegmentId = await getAllSubscribersSegmentId(apiKey);
    console.log(
      `Targeting segment "${ALL_SUBSCRIBERS_SEGMENT_NAME}" (#${allSubscribersSegmentId})`
    );
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`❌ ${detail}`);
    console.error(`::error title=Email broadcast misconfigured::${detail}`);
    process.exit(1);
  }

  // Fetch existing broadcasts for idempotency check
  console.log('Checking for existing broadcasts...');
  const existingSubjects = await getExistingBroadcastSubjects(apiKey);
  if (existingSubjects.size > 0) {
    console.log(`  Found ${existingSubjects.size} existing broadcasts`);
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

    console.log(`\nProcessing: ${postPath}`);

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

    // Idempotency: skip if a broadcast with this subject was already sent —
    // unless FORCE_SEND (an explicit manual dispatch of this specific post).
    if (existingSubjects.has(frontmatter.title)) {
      if (!FORCE_SEND) {
        console.log(`  Skipping (already broadcast): "${frontmatter.title}"`);
        skipped++;
        continue;
      }
      console.log(`  ⚠️  "${frontmatter.title}" already broadcast — sending anyway (FORCE_SEND)`);
    }

    // Render markdown to email-safe HTML. Strip MDX-only syntax first so ESM
    // imports and JSX component tags don't leak into the email as literal text.
    const result = await processor.render(stripMdxSyntax(markdownBody), {
      frontmatter,
    });

    // Frame the post the same way the RSS feed does: a "new post" lead-in on
    // top and the email-safe book CTA on the bottom (shared via email-framing).
    const emailHtml = [
      leadInHtml(fullUrl),
      result.code,
      bookCtaHtml(frontmatter.bookRelation),
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
      // Target the all-subscribers segment. Kit's v4 API 422s on an omitted
      // filter (its old "send to everyone" default regressed) and rejects an
      // explicit all_subscribers type, so we reference a real segment instead.
      subscriber_filter: [
        { all: [{ type: 'segment', ids: [allSubscribersSegmentId] }], any: null, none: null },
      ],
    };

    if (DRY_RUN) {
      console.log(`  🏜️  Would send broadcast: "${frontmatter.title}"`);
      console.log(`     Subject: ${payload.subject}`);
      console.log(`     Preview: ${payload.preview_text}`);
      console.log(`     URL: ${fullUrl}`);
      console.log(`     Content length: ${emailHtml.length} chars`);
      sent++;
      continue;
    }

    // Clear any stale draft from a prior failed attempt so it neither blocks
    // the send (subject/slug collision) nor lingers as a duplicate.
    await deleteDraftBroadcastsWithSubject(frontmatter.title, apiKey);

    console.log(`  Sending broadcast: "${frontmatter.title}"`);

    let result_data;
    try {
      result_data = await createBroadcastWithRetry(payload, apiKey);
    } catch (err) {
      // Surface the full Kit error in the CI log AND as a GitHub Actions error
      // annotation, then fail the job so the failure is never silent.
      const detail = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Failed to send broadcast "${frontmatter.title}": ${detail}`);
      console.error(`::error title=Email broadcast failed::${frontmatter.title}: ${detail.replace(/\r?\n/g, ' ')}`);
      process.exit(1);
    }

    console.log(`  ✅ Broadcast created (id: ${result_data.broadcast?.id || 'unknown'})`);
    sent++;
  }

  const action = DRY_RUN ? 'would send' : 'sent';
  console.log(`\nDone: ${sent} ${action}, ${skipped} skipped`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
