/**
 * Remark Quote Directive Plugin
 *
 * Turns an inline text directive into a shareable, highlighted pull-quote that
 * stays in the flow of the prose:
 *
 *   :quote[You can be professional without being formal.]{#professional-not-formal}
 *
 * The quote text lives ONLY here, in the post — it's the single source of
 * truth. This plugin renders it inline (a light highlight + a small share
 * link to /q/<id>), and src/utils/quotes.ts collects the same directives from
 * post bodies to generate the standalone /q/<id> pages, their OG cards, and the
 * /quotes wall. The two share the helpers below so render and collection agree.
 *
 * Must run AFTER remarkDirective and BEFORE remarkDirectiveFallback — the
 * fallback reverts any directive that no plugin has claimed, and this plugin
 * claims `:quote` by replacing it outright.
 */

import type { Root, Node, RootContent } from 'mdast';
import { visit, SKIP } from 'unist-util-visit';

export const QUOTE_DIRECTIVE_NAME = 'quote';

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Lucide "link-2", inlined to match the site's Icon set without a runtime import.
const SHARE_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
  'stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M9 17H7A5 5 0 0 1 7 7h2"/>' +
  '<path d="M15 7h2a5 5 0 1 1 0 10h-2"/>' +
  '<line x1="8" x2="16" y1="12" y2="12"/></svg>';

type DirectiveNode = Node & {
  name?: string;
  attributes?: Record<string, string | null | undefined> | null;
  children?: RootContent[];
};

/** Concatenate the plain text of a directive's label children. */
export function directiveText(children: RootContent[] | undefined): string {
  let out = '';
  visit({ type: 'root', children: children ?? [] } as Root, 'text', (n: Node & { value?: string }) => {
    out += n.value ?? '';
  });
  return out.trim();
}

/** Validate and return a quote directive's id, or throw with authoring context. */
export function quoteDirectiveId(node: DirectiveNode): string {
  const id = node.attributes?.id;
  if (!id) {
    throw new Error(
      'A :quote[…] directive is missing its id. Write it as :quote[text]{#kebab-id}.'
    );
  }
  if (!ID_PATTERN.test(id)) {
    throw new Error(`:quote id "${id}" must be kebab-case (a-z, 0-9, hyphens).`);
  }
  return id;
}

/** Fragment id for a quote's in-post anchor, used to deep-link back for context. */
export function quoteAnchorId(id: string): string {
  return `quote-${id}`;
}

export function remarkQuoteDirective() {
  return (tree: Root) => {
    visit(tree, (node: Node) => {
      const n = node as DirectiveNode;
      if (n.type !== 'textDirective' || n.name !== QUOTE_DIRECTIVE_NAME) return undefined;

      const id = quoteDirectiveId(n);

      // Render as <a class="quote-inline"><mark><strong>…</strong></mark><icon></a>.
      // The quote text is authored as plain text in the directive label; the
      // <strong> is added here so the quoted phrase carries SEO-friendly semantic
      // emphasis in the post's indexed content (and any inline markup the label
      // does contain is preserved, since we wrap the directive's own children).
      const strongNode = {
        type: 'strong',
        children: (n.children ?? []) as RootContent[],
      } as unknown as RootContent;
      const markNode = {
        type: 'emphasis',
        data: { hName: 'mark', hProperties: { className: ['quote-inline-mark'] } },
        children: [strongNode],
      } as unknown as RootContent;
      const iconNode = {
        type: 'html',
        value: `<span class="quote-inline-icon">${SHARE_ICON_SVG}</span>`,
      } as RootContent;
      // Visually-hidden purpose hint. No aria-label on the link itself — that
      // would override the accessible name and make screen readers skip the
      // quote text while reading the surrounding prose. Leaving the link's name
      // as the quote text (plus this hint) keeps the sentence readable in flow.
      const srNode = {
        type: 'html',
        value: '<span class="sr-only"> (share this quote)</span>',
      } as RootContent;

      n.data = {
        hName: 'a',
        hProperties: {
          id: quoteAnchorId(id),
          href: `/q/${id}/`,
          className: ['quote-inline'],
          'data-quote-id': id,
        },
      } as DirectiveNode['data'];
      n.children = [markNode, srNode, iconNode];

      // Don't descend into the rewritten children (no nested quotes expected).
      return SKIP;
    });
  };
}
