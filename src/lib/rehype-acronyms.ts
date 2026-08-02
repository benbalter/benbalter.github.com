/**
 * Rehype plugin to add hover-tooltip abbreviations for a central acronym list.
 *
 * Wraps the FIRST occurrence of each acronym in `src/data/acronyms.yml` (per
 * document) in an `<abbr class="initialism" data-tooltip="true" …>` — the same
 * markup the TL;DR component uses — so the site-wide tooltip runtime
 * (src/scripts/tooltip.ts) drives it. Matching is case-sensitive and exact, with
 * an optional trailing "s" for plurals ("OKRs", "PRs").
 *
 * The post/page source is never modified; wrapping happens at render time and
 * the visible text is unchanged (the acronym string is only wrapped, never
 * rewritten or expanded).
 *
 * Must run after rehype-raw so that inline-HTML acronyms are real elements we
 * can skip. Text inside links, code, headings, and existing abbreviations is
 * left untouched.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import type { Root, Element, Text, RootContent } from 'hast';

interface AcronymEntry {
  acronym: string;
  meaning: string;
  tooltip?: string;
}

// Load and index the central acronym list once at module load.
const acronymsPath = join(process.cwd(), 'src', 'data', 'acronyms.yml');
const entries = (yaml.load(readFileSync(acronymsPath, 'utf-8')) as AcronymEntry[]) ?? [];

// Exact acronym string -> displayed tooltip text.
const tooltipByAcronym = new Map<string, string>();
for (const entry of entries) {
  if (entry?.acronym) {
    tooltipByAcronym.set(entry.acronym, entry.tooltip ?? entry.meaning);
  }
}

// Longest-first so the alternation prefers e.g. "WYSIWYG" over a shorter prefix.
const sortedAcronyms = [...tooltipByAcronym.keys()].sort((a, b) => b.length - a.length);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// One combined, case-sensitive matcher. Custom boundaries (not \b) so acronyms
// containing punctuation like "TL;DR" still match; capture an optional trailing
// "s" separately so plurals wrap ("OKRs") while mapping back to the singular.
const matcher = sortedAcronyms.length
  ? new RegExp(
      `(?<![A-Za-z0-9])(${sortedAcronyms.map(escapeRegExp).join('|')})(s?)(?![A-Za-z0-9])`,
      'g',
    )
  : null;

// Tags whose entire subtree must be left alone.
const SKIP_TAGS = new Set([
  'a', 'code', 'pre', 'kbd', 'abbr', 'script', 'style',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
]);

function makeAbbr(text: string, tooltip: string): Element {
  return {
    type: 'element',
    tagName: 'abbr',
    // camelCase keys → data-tooltip, data-tooltip-text, tabindex. Mirror
    // Tldr.astro's <abbr> so the shared CSS + runtime apply. No role/aria-expanded:
    // this is an abbreviation with a description, not a button (WAI-ARIA tooltip
    // pattern) — the runtime sets aria-describedby while the tooltip is shown.
    // `title` gives the expansion passively (screen-reader focus, no-JS, RSS).
    properties: {
      className: ['initialism'],
      dataTooltip: 'true',
      dataTooltipText: tooltip,
      title: tooltip,
      tabIndex: 0,
    },
    children: [{ type: 'text', value: text }],
  };
}

// Split one text node into [text, <abbr>, text, …], wrapping only acronyms not
// yet seen in this document. Returns null when nothing was wrapped.
function wrapText(node: Text, seen: Set<string>): Array<Text | Element> | null {
  const { value } = node;
  matcher!.lastIndex = 0;

  const out: Array<Text | Element> = [];
  let lastIndex = 0;
  let wrapped = false;
  let match: RegExpExecArray | null;

  while ((match = matcher!.exec(value)) !== null) {
    const acronym = match[1];
    const plural = match[2];
    if (seen.has(acronym)) continue; // first occurrence per document only
    const tooltip = tooltipByAcronym.get(acronym);
    if (!tooltip) continue;

    seen.add(acronym);
    wrapped = true;

    if (match.index > lastIndex) {
      out.push({ type: 'text', value: value.slice(lastIndex, match.index) });
    }
    out.push(makeAbbr(acronym + plural, tooltip));
    lastIndex = match.index + match[0].length;
  }

  if (!wrapped) return null;
  if (lastIndex < value.length) {
    out.push({ type: 'text', value: value.slice(lastIndex) });
  }
  return out;
}

export function rehypeAcronyms() {
  return (tree: Root) => {
    if (!matcher) return;

    // Per-document state. MUST live inside the transformer: unified instantiates
    // the plugin once but runs this function per file — a factory-scope `seen`
    // would only ever wrap the first document processed.
    const seen = new Set<string>();

    const walk = (node: { children?: unknown }, skip: boolean) => {
      // Text and Element widen to RootContent; MDX JSX nodes carry `children`
      // too. Treat the list loosely so we can descend into raw HTML/JSX blocks
      // (e.g. a hand-written `<aside>` in an .mdx file compiles to an
      // `mdxJsxFlowElement`, not a hast `element`).
      const children = node.children as RootContent[] | undefined;
      if (!children) return;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const type = child.type as string;

        if (child.type === 'element') {
          walk(child, skip || SKIP_TAGS.has(child.tagName));
        } else if (type === 'mdxJsxFlowElement' || type === 'mdxJsxTextElement') {
          // Raw HTML/JSX in MDX. `name` is the tag ("aside", "a", …); null for
          // fragments. Skip the same subtrees we skip for real elements.
          const rawName = (child as { name?: unknown }).name;
          const name = typeof rawName === 'string' ? rawName.toLowerCase() : '';
          walk(child as { children?: unknown }, skip || SKIP_TAGS.has(name));
        } else if (child.type === 'text' && !skip) {
          const replacement = wrapText(child, seen);
          if (replacement) {
            children.splice(i, 1, ...replacement);
            i += replacement.length - 1; // skip past the nodes we just inserted
          }
        }
      }
    };

    walk(tree, false);
  };
}
