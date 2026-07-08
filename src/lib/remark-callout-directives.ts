/**
 * Remark Callout Directives Plugin
 *
 * Transforms remark-directive container/leaf directives into styled callout
 * HTML elements. Allows writing callouts in plain markdown syntax:
 *
 *   :::note
 *   This is a note.
 *   :::
 *
 *   :::warning[Custom Title]
 *   This is a warning with a custom title.
 *   :::
 *
 * Supported types: note, info, warning, error, success, tip
 * Outputs <aside> elements with callout CSS classes (styled in global.css).
 */

import type { Root, Node } from 'mdast';
import { visit } from 'unist-util-visit';

const CALLOUT_TYPES = new Set([
  'note',
  'info',
  'warning',
  'error',
  'success',
  'tip',
]);

const CALLOUT_ICONS: Record<string, string> = {
  note: '💡',
  info: '💡',
  warning: '⚠️',
  error: '❌',
  success: '✅',
  tip: '💡',
};

export function remarkCalloutDirectives() {
  return (tree: Root) => {
    visit(tree, (node: Node) => {
      const n = node as Node & { name?: string; children?: Node[]; data?: Record<string, unknown> };
      if (
        (n.type === 'containerDirective' ||
          n.type === 'leafDirective') &&
        typeof n.name === 'string' &&
        CALLOUT_TYPES.has(n.name)
      ) {
        const type = n.name;
        const icon = CALLOUT_ICONS[type];

        // Get optional title from directive label (:::warning[Title])
        const children = (n.children || []) as Array<Node & { data?: Record<string, unknown>; children?: Array<Node & { value?: string }>; value?: string }>;
        let titleText = '';
        const contentChildren = children.filter(
          (child) => {
            if (child.data?.directiveLabel) {
              // Extract text from label paragraph
              titleText = (child.children || [])
                .map((c) => c.value || '')
                .join('');
              return false;
            }
            return true;
          },
        );

        const label = titleText || type.charAt(0).toUpperCase() + type.slice(1);

        // Build the callout <aside> wrapper.
        const data = (n.data || {}) as Record<string, unknown>;
        n.data = data;
        data.hName = 'aside';
        data.hProperties = {
          className: [`callout`, `callout-${type}`],
          role: 'note',
          'aria-label': `${type} callout`,
        };

        // Render the icon + label as an inline lead-in so it sits on the same
        // line as the body text, e.g. "💡 Info This post was originally…".
        const labelHtml = `<strong class="callout-label"><span class="callout-icon" aria-hidden="true">${icon}</span> ${label}</strong> `;
        const firstParagraph = contentChildren.find(
          (c) => c.type === 'paragraph',
        ) as (Node & { children?: Node[] }) | undefined;

        if (firstParagraph) {
          firstParagraph.children = [
            { type: 'html', value: labelHtml } as Node,
            ...(firstParagraph.children || []),
          ];
          n.children = contentChildren as Node[];
        } else {
          // No leading paragraph (e.g. a list) — fall back to a block title bar.
          const titleNode = {
            type: 'html' as const,
            value: `<div class="callout-title">${labelHtml}</div>`,
          };
          n.children = [titleNode, ...contentChildren] as Node[];
        }
      }
    });
  };
}
