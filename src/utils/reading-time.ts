/**
 * Reading time calculation utilities using the reading-time npm package
 * 
 * Wraps the reading-time library to provide a consistent API for the Astro site.
 * The reading-time package provides Medium-like reading time estimation.
 */

import readingTime from 'reading-time';
import { stripHtmlTags } from './strip-html';
import { markdownToText } from './strip-markdown';

/**
 * Reduce Markdown or rendered HTML to the prose a reader actually reads.
 *
 * Post pages count their rendered HTML while cards count the raw Markdown
 * body, so both paths must drop the same things: footnotes (Markdown
 * `[^1]` refs and definitions, or their rendered `data-footnote-ref` links
 * and `<section data-footnotes>`),
 * `<script>`/`<style>` contents, and tag markup, whose attributes otherwise
 * count as words. Without this, long annotated posts read about twice as long
 * on their own page as on the cards linking to them.
 */
const countableTextCache = new Map<string, string>();

function toCountableText(content: string): string {
  // Every card re-counts its post's body (a post can appear in dozens of
  // "Keep reading" lists) and post pages count once for reading time and once
  // for word count, so memoize the parse.
  const cached = countableTextCache.get(content);
  if (cached !== undefined) return cached;
  const countable = computeCountableText(content);
  countableTextCache.set(content, countable);
  return countable;
}

function computeCountableText(content: string): string {
  const withoutHtmlFootnotes = content
    .replace(/<section\b[^>]*\bdata-footnotes\b[^>]*>[\s\S]*?<\/section>/g, ' ')
    .replace(/<a\b[^>]*\bdata-footnote-ref\b[^>]*>[\s\S]*?<\/a>/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, ' ');
  // markdownToText drops Markdown footnotes (refs and definitions) and reduces
  // Markdown and raw HTML to text; the final tag strip catches markup that
  // survives as code text (e.g. indented HTML parsed as a code block).
  return stripHtmlTags(markdownToText(withoutHtmlFootnotes), ' ');
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

  const cleaned = toCountableText(content);
  const stats = readingTime(cleaned, { wordsPerMinute });

  // Return minutes, ensuring minimum of 1 minute
  return Math.max(1, Math.ceil(stats.minutes));
}

/**
 * Calculate the word count for content.
 *
 * Strips footnotes and markup (consistent with reading-time) and uses the reading-time
 * library's tokenizer so the word count matches what's used for the
 * reading-time estimate.
 *
 * @param content - The HTML or markdown content to analyze
 * @returns Number of words in the content
 */
export function calculateWordCount(content: string): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  const cleaned = toCountableText(content);
  const stats = readingTime(cleaned);
  return stats.words;
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
