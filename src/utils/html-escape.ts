/**
 * HTML Escape Utilities
 * 
 * Utilities for HTML escaping and Cloudflare email protection.
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

/**
 * Wraps HTML content in Cloudflare email_off comments to prevent
 * Cloudflare's email obfuscation from replacing email addresses.
 * 
 * @param html - The HTML content to wrap
 * @returns The HTML wrapped in email_off comments
 */
export function wrapEmailOff(html: string): string {
  return `<!--email_off-->${html}<!--/email_off-->`;
}
