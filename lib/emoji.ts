/**
 * GitHub emoji processing
 * Replaces jemoji Jekyll plugin functionality
 * 
 * Converts :emoji_name: syntax to Unicode emoji characters
 * Uses node-emoji library for comprehensive emoji support
 */

import { emojify, get, search } from 'node-emoji';

/**
 * Convert :emoji_name: syntax to Unicode emoji
 * Uses node-emoji library which supports GitHub emoji names
 */
export function processEmoji(text: string): string {
  return emojify(text);
}

/**
 * Check if text contains emoji syntax
 */
export function hasEmojiSyntax(text: string): boolean {
  return /:([a-z0-9_+\-]+):/.test(text);
}

/**
 * Get emoji by name
 */
export function getEmoji(name: string): string | undefined {
  return get(name);
}

/**
 * Search for emoji by keyword
 */
export function searchEmoji(keyword: string): string[] {
  return search(keyword).map((e) => e.name);
}
