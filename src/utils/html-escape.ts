/**
 * HTML Escape Utilities
 * 
 * Utilities for HTML escaping.
 */

/**
 * Escapes HTML special characters to prevent XSS attacks.
 * 
 * @param str - The string to escape
 * @returns The escaped string safe for use in HTML attributes and content
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
