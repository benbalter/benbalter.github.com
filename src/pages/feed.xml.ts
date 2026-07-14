/**
 * Main RSS Feed for Blog Posts
 * 
 * Generates an RSS 2.0 feed at /feed.xml for all blog posts.
 * This matches the Jekyll feed structure and URLs.
 */

import rss from '@astrojs/rss';
import type { CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { siteConfig } from '../config';
import { getDateFromSlug, getPostUrl } from '../utils/post-urls';
import { getPublishedPosts } from '../utils/posts';
import {
  sharedRemarkPlugins,
  sharedRehypePlugins,
  sharedShikiConfig,
} from '../lib/markdown-pipeline';

// Escape a raw ampersand for use inside HTML (feed content is delivered as HTML,
// e.g. rendered by Kit into email). Only the book title needs it today.
const bookTitle = siteConfig.bookTitle.replace(/&/g, '&amp;');

/**
 * A short framing line prepended to each feed item so email subscribers (and
 * RSS readers) immediately know this is a new post on ben.balter.com and can
 * jump to the canonical web version. The raw post body starts mid-thought
 * otherwise — fine in context, disorienting as the first line of an email.
 */
function leadInHtml(link: string): string {
  return (
    `<p style="margin:0 0 1.75em;font-size:15px;color:#57606a;">` +
    `A new post from <a href="${siteConfig.url}" style="color:#0969da;text-decoration:none;">ben.balter.com</a>` +
    ` &middot; <a href="${link}" style="color:#0969da;text-decoration:none;">Read it on the web &rarr;</a>` +
    `</p>`
  );
}

/**
 * A plain, inline-styled book callout appended to each feed item. The site's
 * <BookCta> relies on Tailwind, SVG, and scoped styles that don't survive email,
 * so this is a self-contained equivalent. The headline mirrors BookCta's
 * relation-aware copy (see src/components/BookCta.astro).
 *
 * LAUNCH (July 21, 2026): the "Coming …" label and "Get notified when it
 * launches" CTA below are hardcoded and go stale at launch. When you flip
 * <BookCta> to buy-now, update these two strings to match.
 */
function bookCtaHtml(relation?: 'adapted' | 'cut' | 'inspired'): string {
  const headline =
    relation === 'adapted'
      ? `This post is adapted from my book, ${bookTitle}.`
      : relation === 'cut'
        ? `This one didn't make my book's final cut.`
        : relation === 'inspired'
          ? `This post inspired a chapter in my book, ${bookTitle}.`
          : `Like this post? It's becoming a book.`;

  return (
    `<hr style="margin:2.5em 0 1.5em;border:none;border-top:1px solid #d0d7de;" />` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 1em;border-collapse:collapse;">` +
    `<tr><td style="border:1px solid #d0d7de;border-radius:8px;padding:16px 20px;background:#f6f8fa;">` +
    `<p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#57606a;">Coming ${siteConfig.bookLaunch}</p>` +
    `<p style="margin:0 0 6px;font-size:16px;font-weight:600;color:#1f2328;">${headline}</p>` +
    `<p style="margin:0 0 12px;font-size:14px;color:#424a53;">${siteConfig.bookDescription}.</p>` +
    `<a href="${siteConfig.bookUrl}" style="font-size:14px;font-weight:600;color:#0969da;text-decoration:none;">Get notified when it launches &rarr;</a>` +
    `</td></tr></table>`
  );
}

// Create a markdown processor once at module level to avoid recreating it on each request
// This improves response times by reusing the processor configuration
// Uses the same plugin configuration as astro.config.mjs via shared imports
const markdownProcessor = createMarkdownProcessor({
  remarkPlugins: sharedRemarkPlugins as any,
  rehypePlugins: sharedRehypePlugins as any,
  shikiConfig: sharedShikiConfig as any,
  // Note: smartypants is NOT enabled here because remarkSmartypants is already
  // included in sharedRemarkPlugins. Enabling both would cause double-transforms.
});

export async function GET(context: APIContext) {
  // Get all published posts, sorted by date (newest first)
  const posts = await getPublishedPosts();
  
  // Sort posts by filename date (newest first)
  const sortedPosts = posts.sort((a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) => {
    const dateA = getDateFromSlug(a.id);
    const dateB = getDateFromSlug(b.id);
    return dateB.getTime() - dateA.getTime();
  });

  // Await the markdown processor initialization
  const processor = await markdownProcessor;

  // Use a consistent base URL from context.site when available, fallback to siteConfig.url
  // This ensures the feed site URL and item links use the same base
  const baseUrl = context.site?.toString().replace(/\/$/, '') || siteConfig.url;

  // Render the latest 20 posts to HTML for the feed
  // Older posts are still discoverable via the sitemap and site navigation
  const recentPosts = sortedPosts.slice(0, 20);

  // Render all posts to get their HTML content
  const items = await Promise.all(
    recentPosts.map(async (post: CollectionEntry<'posts'>) => {
      const pubDate = getDateFromSlug(post.id);
      const postUrl = getPostUrl(post.id);
      
      const link = `${baseUrl}${postUrl}`;

      // Render the post markdown to HTML, then frame it for email/RSS: a
      // "new post" lead-in on top and a book CTA on the bottom (the on-site
      // <BookCta> is Astro-only and never reaches the feed).
      const result = await processor.render(post.body, {
        frontmatter: post.data,
      });
      const content = leadInHtml(link) + result.code + bookCtaHtml(post.data.bookRelation);

      return {
        title: post.data.title,
        description: post.data.description,
        content,
        link,
        pubDate,
        author: siteConfig.email,
      };
    })
  );

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: baseUrl,
    items,
  });
}
