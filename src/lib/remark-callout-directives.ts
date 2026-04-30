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
        let titleHtml = '';
        const contentChildren = children.filter(
          (child) => {
            if (child.data?.directiveLabel) {
              // Extract text from label paragraph
              titleHtml = (child.children || [])
                .map((c) => c.value || '')
                .join('');
              return false;
            }
            return true;
          },
        );

        // Build the callout HTML structure
        const data = (n.data || {}) as Record<string, unknown>;
        n.data = data;
        data.hName = 'aside';
        data.hProperties = {
          className: [`callout`, `callout-${type}`],
          role: 'note',
          'aria-label': `${type} callout`,
        };

        // Prepend title if provided
        if (titleHtml) {
          const titleNode = {
            type: 'html' as const,
            value: `<div class="callout-title"><span class="callout-icon" aria-hidden="true">${icon}</span><strong>${titleHtml}</strong></div>`,
          };
          n.children = [
            titleNode,
            ...contentChildren,
          ] as Node[];
        } else if (icon) {
          // Add icon-only title bar with capitalized type name
          const iconNode = {
            type: 'html' as const,
            value: `<div class="callout-title"><span class="callout-icon" aria-hidden="true">${icon}</span><strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong></div>`,
          };
          n.children = [
            iconNode,
            ...contentChildren,
          ] as Node[];
        }
      }
    });
  };
}
