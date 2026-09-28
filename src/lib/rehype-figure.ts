/**
 * Rehype plugin to wrap standalone images in <figure> elements
 *
 * Replaces <p><img></p> patterns with <figure><img></figure>. Image alt text
 * stays an accessible description; visible captions must be authored as
 * <figcaption> content instead of being duplicated from alt text.
 *
 * This replaces rehype-unwrap-images with proper semantic HTML.
 * Must run after rehype-raw so raw HTML images are proper elements.
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

export function rehypeFigure() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;

      // Check if the paragraph contains only a single image (plus optional whitespace)
      const meaningful = node.children.filter((child) => {
        if (child.type === 'text' && !child.value.trim()) return false;
        return true;
      });

      if (meaningful.length !== 1) return;
      const img = meaningful[0];
      if (img.type !== 'element' || img.tagName !== 'img') return;

      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [img],
      };

      parent.children[index] = figure;
    });
  };
}
