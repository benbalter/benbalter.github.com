/**
 * Reading time calculation utilities using the reading-time npm package
 * 
 * Wraps the reading-time library to provide a consistent API for the Astro site.
 * The reading-time package provides Medium-like reading time estimation.
 */

import readingTime from 'reading-time';

/**
 * Calculate reading time for content
 * @param content - The HTML or markdown content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  const stats = readingTime(content, { wordsPerMinute });
  
  // Return minutes, ensuring minimum of 1 minute
  return Math.max(1, Math.ceil(stats.minutes));
}

/**
 * Format reading time as a human-readable string
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min read"
 */
export function formatReadingTime(minutes: number): string {
  if (minutes <= 0) {
    return '1 min read';
  }
  
  return `${minutes} min read`;
}
