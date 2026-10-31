/**
 * Rehype plugin to highlight "TK" placeholders while drafting.
 *
 * TK is newsroom shorthand for "to come": a fact, quote, or section still to
 * be filled in. Wraps each standalone, uppercase "TK" in
 * `<mark class="tk-marker">` so it's impossible to miss in the dev server.
 *
 * Dev only: a no-op when NODE_ENV is "production" (`astro build` sets it), so
 * production pages, feeds, and email never carry the highlight. Text inside
 * code, pre, and existing marks is left alone.
 *
 * Must run after rehype-raw so inline HTML is real elements we can skip.
 */

import type { Root, Element, Text, RootContent } from 'hast';

const TK_PATTERN = /\bTK\b/g;
const SKIP_TAGS = new Set(['code', 'pre', 'mark', 'script', 'style']);

interface Options {
  /** Force the highlight on or off (defaults to on outside production). */
  enabled?: boolean;
}

function splitText(node: Text): RootContent[] | null {
  const { value } = node;
  TK_PATTERN.lastIndex = 0;
  if (!TK_PATTERN.test(value)) return null;

  const parts: RootContent[] = [];
  let last = 0;
  TK_PATTERN.lastIndex = 0;
  for (let match = TK_PATTERN.exec(value); match; match = TK_PATTERN.exec(value)) {
    if (match.index > last) parts.push({ type: 'text', value: value.slice(last, match.index) });
    parts.push({
      type: 'element',
      tagName: 'mark',
      properties: { className: ['tk-marker'], title: 'TK: still to come' },
      children: [{ type: 'text', value: 'TK' }],
    });
    last = match.index + match[0].length;
  }
  if (last < value.length) parts.push({ type: 'text', value: value.slice(last) });
  return parts;
}

function walk(parent: Root | Element): void {
  const next: RootContent[] = [];
  for (const child of parent.children as RootContent[]) {
    if (child.type === 'text') {
      next.push(...(splitText(child) ?? [child]));
      continue;
    }
    if (child.type === 'element' && !SKIP_TAGS.has(child.tagName)) walk(child);
    next.push(child);
  }
  parent.children = next as typeof parent.children;
}

export function rehypeTkHighlight(options: Options = {}) {
  return (tree: Root) => {
    const enabled = options.enabled ?? process.env.NODE_ENV !== 'production';
    if (!enabled) return;
    walk(tree);
  };
}
