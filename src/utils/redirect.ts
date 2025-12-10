/**
 * Redirect Utility
 * 
 * Helper function to create consistent redirects across the site.
 * Used for maintaining backward compatibility with old URLs.
 */

import type { AstroGlobal } from 'astro';

/**
 * Create a permanent redirect (301) to a new URL
 * 
 * @param Astro - Astro global object
 * @param to - Target URL to redirect to
 * @param from - Optional source URL for documentation purposes
 * @returns Redirect response
 */
export function createRedirect(Astro: AstroGlobal, to: string, from?: string): Response {
  if (from) {
    // Log for debugging purposes
    console.log(`Redirecting from ${from} to ${to}`);
  }
  return Astro.redirect(to, 301);
}
