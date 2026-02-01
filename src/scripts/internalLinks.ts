/**
 * Internal Links Script
 * 
 * Processes all links on the page after Astro page load to ensure that
 * absolute internal URLs (e.g., https://ben.balter.com/about/) are treated
 * as internal links for Astro view transitions.
 * 
 * This is necessary because Astro by default only applies transitions to
 * relative URLs. When content contains absolute URLs to internal pages,
 * they would trigger a full page reload instead of using transitions.
 * 
 * We add data-astro-reload="false" to internal links to ensure smooth transitions.
 */

import { isInternalUrl } from '../utils/is-internal-url';
import { siteConfig } from '../config';

/**
 * Process all links on the page to mark internal absolute URLs
 */
function processLinks(): void {
  // Get all anchor tags on the page
  const links = document.querySelectorAll('a[href]');
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    
    // Skip if no href or already processed
    if (!href || link.hasAttribute('data-internal-processed')) {
      return;
    }
    
    // Mark as processed to avoid re-processing
    link.setAttribute('data-internal-processed', 'true');
    
    // Check if this is an internal URL
    if (isInternalUrl(href, siteConfig.url)) {
      // For absolute internal URLs, ensure Astro treats them as internal
      // by explicitly setting data-astro-reload="false"
      if (href.startsWith('http://') || href.startsWith('https://')) {
        link.setAttribute('data-astro-reload', 'false');
      }
    }
  });
}

// Run on initial page load
document.addEventListener('DOMContentLoaded', processLinks);

// Re-run after Astro page transitions
document.addEventListener('astro:page-load', processLinks);
