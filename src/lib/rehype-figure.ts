/**
 * Rehype plugin to wrap standalone images in <figure> elements
 *
 * Replaces <p><img></p> patterns with <figure><img><figcaption></figure>,
 * using the image's alt text as the figcaption content.
 *
 * This replaces rehype-unwrap-images with proper semantic HTML.
 * Must run after rehype-raw so raw HTML images are proper elements.
 */

import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';

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

      const alt = String(img.properties?.alt || '').trim();

      const figcaptionChildren: Text[] = alt
        ? [{ type: 'text', value: alt }]
        : [];

      const figure: Element = {
        type: 'element',
        tagName: 'figure',
        properties: {},
        children: [
          img,
          ...(figcaptionChildren.length
            ? [
                {
                  type: 'element' as const,
                  tagName: 'figcaption',
                  properties: {},
                  children: figcaptionChildren,
                } satisfies Element,
              ]
            : []),
        ],
      };

      parent.children[index] = figure;
    });
  };
}
