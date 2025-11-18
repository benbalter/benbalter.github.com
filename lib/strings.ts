/**
 * String utility functions for text manipulation
 */

/**
 * Convert a string to a URL-friendly slug
 * @param text The text to slugify
 * @returns A lowercase, hyphenated string suitable for URLs and IDs
 * 
 * @example
 * slugify('IT Management and Leadership') // 'it-management-and-leadership'
 * slugify('Category & Name!') // 'category-name'
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
