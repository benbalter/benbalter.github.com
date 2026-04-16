/**
 * Reading time calculation utilities using the reading-time npm package
 * 
 * Wraps the reading-time library to provide a consistent API for the Astro site.
 * The reading-time package provides Medium-like reading time estimation.
 */

import readingTime from 'reading-time';

/**
 * Strip markdown footnotes (definitions + inline references) so they don't
 * inflate the reading-time estimate. Footnote bodies are supplemental and
 * most readers skim or skip them — counting them overstates time-to-read.
 */
function stripFootnotes(content: string): string {
  // Remove footnote definitions first. A definition starts at the beginning
  // of a line with `[^label]:` and extends through any subsequent indented
  // lines (the GFM footnote body). We stop at the first non-indented,
  // non-empty line that isn't another definition. Note: this must run before
  // inline-ref stripping, or `[^1]:` would be corrupted into `:`.
  const lines = content.split('\n');
  const kept: string[] = [];
  let inDef = false;

  for (const line of lines) {
    if (/^\[\^[^\]]+\]:/.test(line)) {
      inDef = true;
      continue;
    }
    if (inDef) {
      // Indented continuation lines and blank lines stay inside the definition.
      if (/^[ \t]+\S/.test(line) || line.trim() === '') {
        continue;
      }
      inDef = false;
    }
    kept.push(line);
  }

  // Remove inline footnote references like [^1], [^note-a], etc.
  return kept.join('\n').replace(/\[\^[^\]]+\]/g, '');
}

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

  const cleaned = stripFootnotes(content);
  const stats = readingTime(cleaned, { wordsPerMinute });

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
