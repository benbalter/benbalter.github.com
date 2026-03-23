/**
 * Rehype plugin to improve footnote accessibility
 *
 * Enhances remark-gfm footnote output with:
 * - aria-label="Footnotes" on the footnotes section
 *
 * The section landmark with aria-label provides sufficient context for
 * screen readers without needing custom roles on individual list items
 * (which would break list semantics flagged by axe-core).
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

export function rehypeFootnoteA11y() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (!node.properties) return;

      // Add aria-label to the footnotes section for landmark navigation
      // remark-gfm renders this as <section data-footnotes class="footnotes">
      if (
        node.tagName === 'section' &&
        node.properties.dataFootnotes !== undefined
      ) {
        node.properties.ariaLabel = 'Footnotes';
      }
    });
  };
}
