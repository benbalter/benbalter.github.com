/**
 * Utility functions for generating post URLs from slugs
 * 
 * These functions convert Jekyll-style slugs (YYYY-MM-DD-title) to URL paths
 */

/**
 * Generate a Jekyll-style URL path from a post slug
 * 
 * @param slug - Post slug in format YYYY-MM-DD-title
 * @returns URL path in format /YYYY/MM/DD/title/
 */
export function getPostUrl(slug: string): string {
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (match) {
    const [, year, month, day, postSlug] = match;
    return `/${year}/${month}/${day}/${postSlug}/`;
  }
  return `/posts/${slug}/`; // fallback
}

/**
 * Generate a Jekyll-style URL path from a post slug, or return null if invalid
 * 
 * @param slug - Post slug in format YYYY-MM-DD-title
 * @returns URL path in format /YYYY/MM/DD/title/ or null if invalid
 */
export function getPostUrlOrNull(slug: string): string | null {
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (match) {
    const [, year, month, day, postSlug] = match;
    return `/${year}/${month}/${day}/${postSlug}/`;
  }
  return null;
}
