/**
 * Open Graph (OG) image utilities
 * Replaces jekyll-og-image plugin functionality
 * 
 * Provides OG image URLs for posts and pages
 */

import { getSiteConfig } from './config';
import { getPostUrlParts, type Post } from './posts';

/**
 * Convert a relative or absolute image URL to an absolute URL
 * If the URL is already absolute (starts with http), return as-is
 * Otherwise, prepend the site URL
 */
function normalizeImageUrl(image: string | undefined): string | undefined {
  if (!image) {
    return undefined;
  }
  
  const config = getSiteConfig();
  return image.startsWith('http') ? image : `${config.url}${image}`;
}

/**
 * Get OG image URL for a post
 * Checks for explicit image in frontmatter, then looks for pre-generated OG image
 * Falls back to default site image
 */
export function getPostOgImage(post: Post): string {
  const config = getSiteConfig();
  
  // Check for explicit image in frontmatter
  const normalizedImage = normalizeImageUrl(post.image);
  if (normalizedImage) {
    return normalizedImage;
  }
  
  // Check for og_image in frontmatter
  const normalizedOgImage = normalizeImageUrl(post.og_image as string | undefined);
  if (normalizedOgImage) {
    return normalizedOgImage;
  }
  
  // Look for pre-generated OG image
  const { slug } = getPostUrlParts(post);
  const ogImagePath = `/assets/images/og/posts/${slug}.png`;
  
  // Return the OG image path (existence check would require filesystem access at runtime)
  // For static generation, we assume the image exists if it should
  return `${config.url}${ogImagePath}`;
}

/**
 * Get OG image URL for a page or default
 */
export function getPageOgImage(image?: string): string {
  const normalizedImage = normalizeImageUrl(image);
  if (normalizedImage) {
    return normalizedImage;
  }
  
  // Default to headshot
  return getDefaultOgImage();
}

/**
 * Get default site OG image
 */
export function getDefaultOgImage(): string {
  const config = getSiteConfig();
  return `${config.url}/assets/img/headshot.jpg`;
}
