/**
 * Utility functions for generating post URLs from slugs and handling dates
 * 
 * These functions convert Jekyll-style slugs (YYYY-MM-DD-title) to URL paths
 * and provide date parsing/formatting utilities
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

/**
 * Parse date from Jekyll-style slug
 * 
 * @param slug - Post slug in format YYYY-MM-DD-title
 * @returns Date object parsed from slug
 */
export function getDateFromSlug(slug: string): Date {
  const match = slug.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  }
  return new Date();
}

/**
 * Format date like Jekyll: "Month Day, Year"
 * 
 * @param date - Date object to format
 * @returns Formatted date string
 */
export function formatPostDate(date: Date): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Format date for resume: "Month Year"
 * 
 * @param dateString - Date string to format
 * @returns Formatted date string or null if invalid
 */
export function formatResumeDate(dateString: string): string | null {
  const date = new Date(dateString);
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Format date to ISO 8601 format (YYYY-MM-DD) for datetime attribute
 * 
 * @param date - Date object to format
 * @returns ISO 8601 formatted date string (YYYY-MM-DD)
 */
export function formatISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}
