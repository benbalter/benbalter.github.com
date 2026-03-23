/**
 * Rehype plugin to optimize image loading attributes for LCP
 *
 * Sets the first image in each document to eager load with high fetch priority
 * (likely LCP candidate), and all subsequent images to lazy load with async
 * decoding so they don't compete for bandwidth.
 *
 * Must run after rehype-raw so that inline HTML images are proper elements.
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

export function rehypeImageLoading() {
  return (tree: Root) => {
    let firstImage = true;

    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img' || !node.properties) return;

      if (firstImage) {
        node.properties.loading = 'eager';
        node.properties.decoding = 'auto';
        node.properties.fetchpriority = 'high';
        firstImage = false;
      } else {
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }
    });
  };
}
