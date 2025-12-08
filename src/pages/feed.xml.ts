/**
 * Main Atom Feed for Blog Posts
 * 
 * Generates an Atom feed at /feed.xml for all blog posts.
 * This matches the Jekyll feed structure and URLs.
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { siteConfig } from '../config';

export async function GET(context: APIContext) {
  // Get all published posts, sorted by date (newest first)
  const posts = await getCollection('posts', ({ data }) => {
    return data.published !== false;
  });
  
  // Sort posts by filename date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.id.substring(0, 10));
    const dateB = new Date(b.id.substring(0, 10));
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site || siteConfig.url,
    
    items: sortedPosts.map((post) => {
      // Extract date from filename (YYYY-MM-DD-title.md format)
      const dateMatch = post.id.match(/^(\d{4}-\d{2}-\d{2})/);
      const pubDate = dateMatch ? new Date(dateMatch[1]) : new Date();
      
      // Extract slug from filename
      const slug = post.id.replace(/^(\d{4}-\d{2}-\d{2})-/, '').replace(/\.mdx?$/, '');
      
      // Get the year, month, day for the URL path
      const year = pubDate.getFullYear();
      const month = String(pubDate.getMonth() + 1).padStart(2, '0');
      const day = String(pubDate.getDate()).padStart(2, '0');
      
      return {
        title: post.data.title,
        description: post.data.description,
        link: `${siteConfig.url}/${year}/${month}/${day}/${slug}/`,
        pubDate,
        // Optional: Include content (commented out to match Jekyll's minimal feed)
        // content: sanitizeHtml(post.body),
      };
    }),
    
    // Atom feed specific settings
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
    
    // Custom XML namespaces if needed
    customData: `<atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/atom+xml" />`,
  });
}
