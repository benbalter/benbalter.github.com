/**
 * Utility to strip markdown formatting from text
 * 
 * This utility removes common markdown formatting syntax to produce plain text,
 * which is useful for displaying descriptions in contexts where HTML/markdown
 * rendering is not desired.
 */

/**
 * Strip markdown formatting from text
 * 
 * Removes the following markdown syntax:
 * - Links: [text](url) -> text
 * - Bold: **text** or __text__ -> text
 * - Italic: *text* or _text_ -> text
 * - Code: `code` -> code
 * - Inline HTML tags
 * 
 * @param text - The markdown text to strip
 * @returns Plain text without markdown formatting
 */
export function stripMarkdown(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let result = text;

  // Remove markdown links [text](url) -> text
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove bold **text** or __text__ -> text
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/__([^_]+)__/g, '$1');

  // Remove italic *text* or _text_ -> text
  // For asterisks, just remove them
  result = result.replace(/\*([^*]+)\*/g, '$1');
  // For underscores, be more careful to avoid breaking snake_case
  // Only match underscores surrounded by whitespace or punctuation
  result = result.replace(/(\s|^)_([^_]+)_(\s|$)/g, '$1$2$3');

  // Remove inline code `code` -> code
  result = result.replace(/`([^`]+)`/g, '$1');

  // Remove inline HTML tags (add space to preserve word boundaries)
  result = result.replace(/<[^>]+>/g, ' ');

  // Clean up any extra whitespace
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}
