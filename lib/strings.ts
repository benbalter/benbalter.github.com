/**
 * String utility functions for text manipulation
 */

import { slug } from 'github-slugger';

/**
 * Convert a string to a URL-friendly slug
 * Uses github-slugger to match GitHub's markdown heading slug behavior
 * 
 * @param text The text to slugify
 * @returns A lowercase, hyphenated string suitable for URLs and IDs
 * 
 * @example
 * slugify('IT Management and Leadership') // 'it-management-and-leadership'
 * slugify('Category & Name!') // 'category-name'
 */
export function slugify(text: string): string {
  return slug(text);
}
