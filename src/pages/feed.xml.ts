/**
 * Main RSS Feed for Blog Posts
 * 
 * Generates an RSS 2.0 feed at /feed.xml for all blog posts.
 * This matches the Jekyll feed structure and URLs.
 */

import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { siteConfig } from '../config';
import { getDateFromSlug, getPostUrl } from '../utils/post-urls';
import {
  sharedRemarkPlugins,
  sharedRehypePlugins,
  sharedShikiConfig,
} from '../lib/markdown-pipeline';

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
  const posts = await getCollection('posts', ({ data }: CollectionEntry<'posts'>) => {
    return data.published !== false;
  });
  
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

  // Render all posts to get their HTML content
  const items = await Promise.all(
    sortedPosts.map(async (post: CollectionEntry<'posts'>) => {
      const pubDate = getDateFromSlug(post.id);
      const postUrl = getPostUrl(post.id);
      
      // Render the post markdown to HTML
      const result = await processor.render(post.body, {
        frontmatter: post.data,
      });
      const content = result.code;
      
      return {
        title: post.data.title,
        description: post.data.description,
        content,
        link: `${baseUrl}${postUrl}`,
        pubDate,
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
