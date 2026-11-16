/**
 * Rehype plugin for the footnotes section remark-gfm renders at the end of a post
 *
 * - aria-label="Footnotes" on the footnotes section
 * - a text-presentation selector (U+FE0E) after the "↩" back-reference, which
 *   Apple platforms otherwise draw as a color emoji in the middle of prose
 * - the list folds into a closed <details> with a "Footnotes · N" summary, so
 *   a long list doesn't push the share bar and the book down the page. Readers
 *   already get each footnote in a hover or tap card (link-previews.ts), and
 *   src/scripts/footnotes.ts opens the list whenever a link jumps into it.
 *
 * The section landmark with aria-label provides sufficient context for
 * screen readers without needing custom roles on individual list items
 * (which would break list semantics flagged by axe-core).
 *
 * Web only: feeds and email (syndicationRehypePlugins) keep the plain list,
 * since mail clients handle <details> badly.
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/** Class on the <details> that folds the list; footnotes.ts and global.css key on it */
export const FOOTNOTES_TOGGLE_CLASS = 'footnotes-toggle';

const span = (properties: Element['properties'], text: string): Element => ({
  type: 'element',
  tagName: 'span',
  properties,
  children: [{ type: 'text', value: text }],
});

/** Wrap the section's <ol> in a closed <details> labelled with the footnote count */
function foldList(section: Element) {
  const index = section.children.findIndex(
    (child) => child.type === 'element' && child.tagName === 'ol',
  );
  const list = section.children[index];
  if (!list || list.type !== 'element') return;

  const count = list.children.filter(
    (child) => child.type === 'element' && child.tagName === 'li',
  ).length;

  const summary: Element = {
    type: 'element',
    tagName: 'summary',
    properties: {},
    children: [
      { type: 'text', value: 'Footnotes ' },
      span({ ariaHidden: 'true' }, '·'),
      { type: 'text', value: ' ' },
      span({ className: ['footnotes-count'] }, String(count)),
    ],
  };
  const details: Element = {
    type: 'element',
    tagName: 'details',
    properties: { className: [FOOTNOTES_TOGGLE_CLASS] },
    children: [summary, list],
  };
  section.children.splice(index, 1, details);
}

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
        foldList(node);
      }

      if (node.tagName === 'a' && node.properties.dataFootnoteBackref !== undefined) {
        for (const child of node.children) {
          if (child.type === 'text') {
            child.value = child.value.replace(/↩(?!︎)/g, '↩︎');
          }
        }
      }
    });
  };
}
