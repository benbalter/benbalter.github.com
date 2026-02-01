/**
 * Main RSS Feed for Blog Posts
 * 
 * Generates an RSS 2.0 feed at /feed.xml for all blog posts.
 * This matches the Jekyll feed structure and URLs.
 */

import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { siteConfig } from '../config';
import { getDateFromSlug, getPostUrl } from '../utils/post-urls';

export async function GET(context: APIContext) {
  // Get all published posts, sorted by date (newest first)
  const posts = await getCollection('posts', ({ data }: CollectionEntry<'posts'>) => {
    return data.published !== false;
  });
  
  // Sort posts by filename date (newest first)
  const sortedPosts = posts.sort((a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) => {
    const dateA = getDateFromSlug(a.slug);
    const dateB = getDateFromSlug(b.slug);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site || siteConfig.url,
    
    items: sortedPosts.map((post: CollectionEntry<'posts'>) => {
      const pubDate = getDateFromSlug(post.slug);
      const postUrl = getPostUrl(post.slug);
      
      return {
        title: post.data.title,
        description: post.data.description,
        link: `${siteConfig.url}${postUrl}`,
        pubDate,
      };
    }),
  });
}
