/**
 * Remark Directive Fallback Plugin
 *
 * remark-directive parses any `:name` as a text directive and `::name` as a
 * leaf directive. That means ordinary prose colons — times (`3:00`), ratios
 * (`16:9`), ports (`0:80`), and one-on-ones (`1:1`) — get parsed as directives
 * and, when no plugin handles them, rendered as empty `<div></div>` elements.
 *
 * Callout directives (`:::note`, etc.) are handled upstream by
 * remarkCalloutDirectives, which sets `data.hName` on the nodes it claims.
 * This plugin runs after it and reverts any remaining (unhandled) text or leaf
 * directive back to its literal source text so it renders as written.
 *
 * Must run AFTER remarkCalloutDirectives.
 */

import type { Root, Node, Parent, RootContent } from 'mdast';
import { visit, SKIP } from 'unist-util-visit';

type DirectiveNode = Node & {
  name?: string;
  children?: RootContent[];
  data?: { hName?: string };
};

export function remarkDirectiveFallback() {
  return (tree: Root) => {
    visit(tree, (node: Node, index, parent: Parent | undefined) => {
      const n = node as DirectiveNode;
      if (
        (n.type === 'textDirective' || n.type === 'leafDirective') &&
        !n.data?.hName &&
        parent &&
        typeof index === 'number'
      ) {
        const prefix = n.type === 'leafDirective' ? '::' : ':';
        const literal: RootContent = { type: 'text', value: `${prefix}${n.name ?? ''}` };
        // Re-emit any label children inline (bare directives have none).
        const replacement: RootContent[] = [literal, ...(n.children ?? [])];
        parent.children.splice(index, 1, ...replacement);
        return [SKIP, index + replacement.length];
      }
      return undefined;
    });
  };
}
