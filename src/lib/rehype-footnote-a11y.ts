/**
 * Rehype plugin to add DPUB-ARIA roles to footnotes
 *
 * Enhances remark-gfm footnote output with:
 * - role="doc-endnotes" on the footnotes section
 * - aria-label="Footnotes" on the footnotes section
 * - role="doc-endnote" on each footnote list item
 *
 * These DPUB-ARIA roles improve screen reader navigation by identifying
 * the footnotes section as a distinct document landmark.
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

export function rehypeFootnoteA11y() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (!node.properties) return;

      // Add role="doc-endnotes" and aria-label to the footnotes section
      // remark-gfm renders this as <section data-footnotes class="footnotes">
      if (
        node.tagName === 'section' &&
        node.properties.dataFootnotes !== undefined
      ) {
        node.properties.role = 'doc-endnotes';
        node.properties.ariaLabel = 'Footnotes';
      }

      // Add role="doc-endnote" to each footnote list item
      // remark-gfm renders these as <li id="user-content-fn-...">
      if (node.tagName === 'li') {
        const id = String(node.properties.id || '');
        if (id.startsWith('user-content-fn-')) {
          node.properties.role = 'doc-endnote';
        }
      }

      // Add role="doc-backlink" to footnote back-references
      // remark-gfm renders these as <a ... data-footnote-backref ...>
      if (
        node.tagName === 'a' &&
        node.properties.dataFootnoteBackref !== undefined
      ) {
        node.properties.role = 'doc-backlink';
      }

      // Add role="doc-noteref" to footnote references in body text
      // remark-gfm renders these as <a ... data-footnote-ref ...>
      if (
        node.tagName === 'a' &&
        node.properties.dataFootnoteRef !== undefined
      ) {
        node.properties.role = 'doc-noteref';
      }
    });
  };
}
