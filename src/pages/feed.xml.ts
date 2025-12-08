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

export async function GET(context: APIContext) {
  // Get all published posts, sorted by date (newest first)
  const posts = await getCollection('posts', ({ data }: CollectionEntry<'posts'>) => {
    return data.published !== false;
  });
  
  // Sort posts by filename date (newest first)
  const sortedPosts = posts.sort((a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) => {
    const dateA = new Date(a.slug.substring(0, 10));
    const dateB = new Date(b.slug.substring(0, 10));
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site || siteConfig.url,
    
    items: sortedPosts.map((post: CollectionEntry<'posts'>) => {
      // Extract date from filename (YYYY-MM-DD-title format)
      const dateMatch = post.slug.match(/^(\d{4}-\d{2}-\d{2})/);
      const pubDate = dateMatch ? new Date(dateMatch[1]) : new Date();
      
      // Extract slug from filename (remove date prefix)
      const slug = post.slug.replace(/^(\d{4}-\d{2}-\d{2})-/, '');
      
      // Get the year, month, day for the URL path
      const year = pubDate.getFullYear();
      const month = String(pubDate.getMonth() + 1).padStart(2, '0');
      const day = String(pubDate.getDate()).padStart(2, '0');
      
      return {
        title: post.data.title,
        description: post.data.description,
        link: `${siteConfig.url}/${year}/${month}/${day}/${slug}/`,
        pubDate,
      };
    }),
  });
}
