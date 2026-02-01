/**
 * Rehype plugin to convert absolute internal URLs to relative URLs
 * 
 * This plugin converts absolute URLs pointing to ben.balter.com to relative URLs
 * to maximize Astro view transitions usage. View transitions work better with
 * relative URLs as they can be intercepted and handled client-side.
 * 
 * Examples:
 * - https://ben.balter.com/about/ → /about/
 * - https://ben.balter.com/2021/01/15/post-title/ → /2021/01/15/post-title/
 * 
 * Note: This only affects internal links. External links are left unchanged.
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { siteConfig } from '../config';

/**
 * Convert an absolute internal URL to a relative URL
 * 
 * @param absoluteUrl - The absolute URL to convert
 * @returns The relative URL
 */
function convertToRelativeUrl(absoluteUrl: string): string {
  // Remove the site URL prefix
  let relativeUrl = absoluteUrl.substring(siteConfig.url.length);
  
  // Ensure the relative URL starts with /
  if (!relativeUrl.startsWith('/')) {
    relativeUrl = '/' + relativeUrl;
  }
  
  return relativeUrl;
}

/**
 * Rehype plugin to convert absolute internal URLs to relative URLs
 * 
 * @returns Transformer function for rehype
 */
export function rehypeRelativeUrls() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // Handle anchor tags with href attributes
      if (node.tagName === 'a' && node.properties && typeof node.properties.href === 'string') {
        const href = node.properties.href;
        
        // Check if this is an absolute URL pointing to our site
        if (href.startsWith(siteConfig.url)) {
          node.properties.href = convertToRelativeUrl(href);
        }
      }
      
      // Handle img tags with src attributes
      if (node.tagName === 'img' && node.properties && typeof node.properties.src === 'string') {
        const src = node.properties.src;
        
        // Check if this is an absolute URL pointing to our site
        if (src.startsWith(siteConfig.url)) {
          node.properties.src = convertToRelativeUrl(src);
        }
      }
    });
  };
}
