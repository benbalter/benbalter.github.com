/**
 * Remark Objection Directives Plugin
 *
 * Transforms a container directive into a styled "But what about…" objection
 * block — a scannable objection-and-rebuttal the reader can screenshot to win
 * an argument:
 *
 *   :::objection[Won't async just slow everything down?]
 *   No — it front-loads the thinking. The minutes you spend writing a decision
 *   doc save hours of the same conversation happening five times in five DMs.
 *   :::
 *
 * The `[…]` label is the objection (rendered with its inline markup preserved);
 * the body is the rebuttal. Outputs an <aside class="objection"> styled in
 * global.css. Because it runs in the shared remark pipeline, it renders in the
 * RSS feed too (unlike an Astro component).
 *
 * Must run AFTER remarkDirective.
 */

import type { Root, Node } from 'mdast';
import { visit } from 'unist-util-visit';

const OBJECTION_NAME = 'objection';

type Child = Node & {
  data?: { directiveLabel?: boolean } & Record<string, unknown>;
  children?: Node[];
};

type DirectiveNode = Node & {
  name?: string;
  children?: Child[];
  data?: Record<string, unknown>;
};

export function remarkObjectionDirectives() {
  return (tree: Root) => {
    visit(tree, (node: Node) => {
      const n = node as DirectiveNode;
      if (n.type !== 'containerDirective' || n.name !== OBJECTION_NAME) return;

      const children = n.children ?? [];

      // Split the label (the objection question) from the rebuttal body.
      let labelChildren: Node[] = [];
      const bodyChildren = children.filter((child) => {
        if (child.data?.directiveLabel) {
          labelChildren = child.children ?? [];
          return false;
        }
        return true;
      });

      if (labelChildren.length === 0) {
        throw new Error(
          'A :::objection block needs a question label, e.g. ' +
            ':::objection[Won\'t this slow us down?]'
        );
      }

      // Question paragraph: "But what about… <objection>". Reusing the label's
      // own child nodes preserves its inline markup and typographic processing.
      const questionNode = {
        type: 'paragraph',
        data: { hName: 'p', hProperties: { className: ['objection-q'] } },
        children: [
          {
            type: 'html',
            value: '<span class="objection-label">But what about…</span> ',
          },
          ...labelChildren,
        ],
      } as unknown as Node;

      // Rebuttal body wrapper.
      const bodyNode = {
        type: 'blockquote',
        data: { hName: 'div', hProperties: { className: ['objection-a'] } },
        children: bodyChildren,
      } as unknown as Node;

      n.data = {
        hName: 'aside',
        hProperties: {
          className: ['objection'],
          'aria-label': 'Objection and response',
        },
      };
      n.children = [questionNode, bodyNode] as Child[];
    });
  };
}
