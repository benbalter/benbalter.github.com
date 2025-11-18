import { markdownToHtml, stripHtml as stripHtmlFromMarkdown } from './markdown';
import { getSiteConfig } from './config';

/**
 * Converts Markdown text to HTML using the existing remark/rehype pipeline.
 * This is the JavaScript equivalent of Jekyll's `markdownify` filter.
 * 
 * @param markdown - The markdown string to convert
 * @returns Promise resolving to HTML string
 */
export async function markdownify(markdown: string): Promise<string> {
  return markdownToHtml(markdown);
}

/**
 * Removes HTML tags from a string.
 * This is the JavaScript equivalent of Jekyll's `strip_html` filter.
 * 
 * @param html - The HTML string to strip tags from
 * @returns Plain text with HTML tags removed
 */
export function stripHtml(html: string): string {
  return stripHtmlFromMarkdown(html);
}

/**
 * Converts a relative URL to an absolute URL using the site's base URL.
 * This is the JavaScript equivalent of Jekyll's `absolute_url` filter.
 * 
 * @param url - The relative or absolute URL
 * @returns Absolute URL string
 */
export function absoluteUrl(url: string): string {
  const config = getSiteConfig();
  const baseUrl = config.url;
  
  // If already absolute, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Ensure URL starts with /
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  
  // Combine base URL and path
  return new URL(normalizedUrl, baseUrl).toString();
}

/**
 * Truncates text to a specified length and optionally appends an ellipsis.
 * This is the JavaScript equivalent of Jekyll's `truncate` filter.
 * 
 * Respects word boundaries and HTML tags to avoid breaking mid-word or mid-tag.
 * 
 * @param text - The text to truncate
 * @param length - Maximum length (default: 50)
 * @param ellipsis - String to append when truncated (default: '...')
 * @returns Truncated text
 */
export function truncate(text: string, length: number = 50, ellipsis: string = '...'): string {
  if (!text || text.length <= length) {
    return text;
  }
  
  // Find the last space before the length limit to avoid breaking words
  let truncateAt = length;
  const lastSpace = text.lastIndexOf(' ', length);
  
  // Only use the last space if it's not too far from the limit
  // (avoid truncating very short if the first word is very long)
  if (lastSpace > length * 0.5) {
    truncateAt = lastSpace;
  }
  
  return text.slice(0, truncateAt).trim() + ellipsis;
}

/**
 * Combines markdownify and stripHtml operations - a common pattern in Jekyll templates.
 * Converts markdown to HTML and then strips the HTML tags.
 * 
 * @param markdown - The markdown string to process
 * @returns Promise resolving to plain text
 */
export async function markdownifyAndStrip(markdown: string): Promise<string> {
  const html = await markdownify(markdown);
  return stripHtml(html);
}
