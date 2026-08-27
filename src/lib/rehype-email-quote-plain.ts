/**
 * Rehype plugin (email only) — flatten the :quote share affordance to plain text.
 *
 * On the web, remark-quote-directive renders a :quote as an anchor wrapping a
 * <mark>, plus a share icon (an inline Lucide "link-2" SVG) and a visually-
 * hidden hint. That whole affordance is web-only interactivity — its tap-to-
 * share behavior comes from quote-share.ts, which never runs in an inbox.
 *
 * Worse, the icon SVG carries only a `viewBox`, no width/height; it's sized by
 * CSS (`.quote-inline-icon svg { width: 1em }`) that email clients strip, so it
 * balloons to a giant graphic in the rendered email.
 *
 * For email we keep only the highlighted quote text: replace the whole
 * `a.quote-inline` with its inner `<mark>`, dropping the anchor, the icon, and
 * the sr-only hint. Web rendering is untouched — this runs only in the email
 * pipeline's rehype list.
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

function classList(node: Element): string[] {
  const c: unknown = node.properties?.className;
  if (Array.isArray(c)) return c.map(String);
  if (typeof c === 'string') return c.split(/\s+/).filter(Boolean);
  return [];
}

export function rehypeEmailQuotePlain() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (
        node.tagName !== 'a' ||
        !parent ||
        index === undefined ||
        !classList(node).includes('quote-inline')
      ) {
        return;
      }

      // Keep the highlighted text (<mark>) and discard the icon / sr-only hint.
      const mark = node.children.find(
        (child): child is Element =>
          child.type === 'element' &&
          child.tagName === 'mark' &&
          classList(child).includes('quote-inline-mark')
      );

      // Fall back to the anchor's own children (minus the share decorations) if
      // the expected <mark> isn't there, so nothing silently vanishes.
      if (mark) {
        parent.children[index] = mark;
      } else {
        const kept = node.children.filter(
          (child) =>
            !(
              child.type === 'element' &&
              (classList(child).includes('quote-inline-icon') ||
                classList(child).includes('sr-only'))
            )
        );
        parent.children.splice(index, 1, ...kept);
      }
    });
  };
}
