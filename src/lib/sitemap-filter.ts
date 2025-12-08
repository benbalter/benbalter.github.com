/**
 * Sitemap filtering utilities
 * 
 * This module provides utilities to filter pages from the sitemap based on
 * frontmatter metadata, particularly the `sitemap: false` flag.
 */

import { getCollection } from 'astro:content';

/**
 * Get a list of URLs that should be excluded from the sitemap
 * based on content collection frontmatter (sitemap: false)
 * 
 * NOTE: This function is currently not used in astro.config.mjs because
 * the sitemap integration's filter function is synchronous and cannot await
 * async functions. Pages with sitemap: false should be manually added to
 * the EXCLUDED_PAGES array in astro.config.mjs.
 * 
 * This function is kept for potential future use if Astro adds support
 * for async filters or for custom sitemap generation scripts.
 */
export async function getExcludedUrls(): Promise<string[]> {
  const excludedUrls: string[] = [];
  
  try {
    // Check posts collection
    const posts = await getCollection('posts');
    for (const post of posts) {
      if (post.data.sitemap === false) {
        // Build the URL from the post slug (format: YYYY-MM-DD-slug)
        const parts = post.slug.split('-');
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        const slug = parts.slice(3).join('-');
        excludedUrls.push(`/${year}/${month}/${day}/${slug}/`);
      }
    }
    
    // Check pages collection
    const pages = await getCollection('pages');
    for (const page of pages) {
      if (page.data.sitemap === false) {
        excludedUrls.push(`/${page.slug}/`);
      }
    }
  } catch (error) {
    console.warn('Could not load content collections for sitemap filtering:', error);
  }
  
  return excludedUrls;
}

/**
 * Static list of pages that should be excluded from sitemap
 * These are pages defined in src/pages/*.astro that have sitemap: false
 * in their original Jekyll source
 */
export const STATIC_EXCLUDED_PAGES = [
  '/404/',
  '/_not-found/',
  '/fine-print/', // Has sitemap: false in original Jekyll source (fine-print.md, now fine-print.astro)
];
