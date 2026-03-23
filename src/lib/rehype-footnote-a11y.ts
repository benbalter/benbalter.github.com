/**
 * Rehype plugin to improve footnote accessibility
 *
 * Enhances remark-gfm footnote output with:
 * - aria-label="Footnotes" on the footnotes section
 * - role="note" on each footnote list item
 *
 * Uses standard ARIA roles instead of deprecated DPUB-ARIA roles
 * (doc-endnotes, doc-endnote) which axe-core flags as deprecated.
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

      // Add role="note" to each footnote list item
      // remark-gfm renders these as <li id="user-content-fn-...">
      if (node.tagName === 'li') {
        const id = String(node.properties.id || '');
        if (id.startsWith('user-content-fn-')) {
          node.properties.role = 'note';
        }
      }
    });
  };
}
