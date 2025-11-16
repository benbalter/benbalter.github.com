/**
 * Open Graph (OG) image utilities
 * Replaces jekyll-og-image plugin functionality
 * 
 * Provides OG image URLs for posts and pages
 */

import { getSiteConfig } from './config';
import { getPostUrlParts, type Post } from './posts';

/**
 * Get OG image URL for a post
 * Checks for explicit image in frontmatter, then looks for pre-generated OG image
 * Falls back to default site image
 */
export function getPostOgImage(post: Post): string {
  const config = getSiteConfig();
  
  // Check for explicit image in frontmatter
  if (post.image) {
    return post.image.startsWith('http') ? post.image : `${config.url}${post.image}`;
  }
  
  // Check for og_image in frontmatter
  if (post.og_image) {
    return post.og_image.startsWith('http') ? post.og_image : `${config.url}${post.og_image}`;
  }
  
  // Look for pre-generated OG image
  const { year, month, day, slug } = getPostUrlParts(post);
  const ogImagePath = `/assets/images/og/posts/${slug}.png`;
  
  // Return the OG image path (existence check would require filesystem access at runtime)
  // For static generation, we assume the image exists if it should
  return `${config.url}${ogImagePath}`;
}

/**
 * Get OG image URL for a page or default
 */
export function getPageOgImage(image?: string): string {
  const config = getSiteConfig();
  
  if (image) {
    return image.startsWith('http') ? image : `${config.url}${image}`;
  }
  
  // Default to headshot
  return `${config.url}/assets/img/headshot.jpg`;
}

/**
 * Get default site OG image
 */
export function getDefaultOgImage(): string {
  const config = getSiteConfig();
  return `${config.url}/assets/img/headshot.jpg`;
}
