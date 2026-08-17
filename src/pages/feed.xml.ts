/**
 * Main RSS Feed for Blog Posts
 * 
 * Generates an RSS 2.0 feed at /feed.xml for all blog posts.
 * This matches the Jekyll feed structure and URLs.
 */

import rss from '@astrojs/rss';
import type { CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { unified } from '@astrojs/markdown-remark';
import { siteConfig } from '../config';
import { getDateFromSlug, getPostUrl } from '../utils/post-urls';
import { getPublishedPosts } from '../utils/posts';
import {
  sharedRemarkPlugins,
  sharedRehypePlugins,
  sharedShikiConfig,
} from '../lib/markdown-pipeline';
import { stripMdxSyntax } from '../utils/strip-mdx-syntax';
import { leadInHtml, bookCtaHtml } from '../lib/email-framing';

// Create a markdown processor once at module level to avoid recreating it on each request
// This improves response times by reusing the processor configuration
// Uses the same plugin configuration as astro.config.mjs via shared imports
// Build the remark/rehype (unified) processor and its renderer. `unified()`
// defaults `gfm` and `smartypants` to true, matching the shared plugins
// (remarkGfm, remarkSmartypants) already in sharedRemarkPlugins; both are
// idempotent, so the overlap has no visible effect on the rendered HTML.
const markdownProcessor = unified({
  remarkPlugins: sharedRemarkPlugins as any,
  rehypePlugins: sharedRehypePlugins as any,
}).createRenderer({
  shikiConfig: sharedShikiConfig as any,
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
      const result = await processor.render(stripMdxSyntax(post.body), {
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
