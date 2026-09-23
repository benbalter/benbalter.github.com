/**
 * Content integrity checks for bulk edits to posts.
 *
 * Automated passes (linters, style sweeps, LLM copy-editing) are meant to
 * touch prose, but have silently changed other things: a copy pass rewrote a
 * post's script endpoint (2e13b67d, the Zen of GitHub Octocat), grammar passes
 * changed verbs inside quotations, and an "MDX compat" pass deleted whole
 * sections and embeds (da5acbb0). This module compares a post before and
 * after a change and reports:
 *
 * - word loss: the post lost more than WORD_LOSS_RATIO of its prose words
 *   and more than WORD_LOSS_MIN words
 * - non-prose edits: any removed or modified fenced code block, inline code,
 *   <script>/<style> block, link/image URL, or blockquote text
 *
 * Pure additions (new code blocks, new links, new quotes) are not findings.
 * The git plumbing and exit codes live in script/check-content-integrity.ts.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMdx from 'remark-mdx';

/** A diff touching at least this many existing posts is a bulk pass and gates CI. */
export const BULK_POST_THRESHOLD = 6;
/** Word loss is flagged only when both limits are exceeded. */
export const WORD_LOSS_RATIO = 0.1;
export const WORD_LOSS_MIN = 40;
/** Commit-message trailer that acknowledges findings as deliberate. */
export const REVIEW_TRAILER = /^Content-Integrity:\s*reviewed\s*$/im;

export type RegionKind = 'code block' | 'inline code' | 'script/style' | 'url' | 'blockquote';

export interface Regions {
  'code block': string[];
  'inline code': string[];
  'script/style': string[];
  url: string[];
  blockquote: string[];
  /** Prose word count (text nodes only; no code, markup, URLs, or front matter). */
  words: number;
  /** True when MDX parsing failed and plain Markdown parsing was used instead. */
  fallback: boolean;
}

export type Finding =
  | { kind: 'word loss'; before: number; after: number }
  | { kind: RegionKind; before: string; after: string | null }
  | { kind: 'deleted' };

// Minimal structural type for the mdast/MDX nodes we walk.
interface Node {
  type: string;
  value?: string;
  url?: string;
  name?: string | null;
  attributes?: Array<{ type: string; name?: string; value?: unknown }>;
  children?: Node[];
  position?: { start: { offset?: number }; end: { offset?: number } };
}

/** Straighten curly quotes and collapse whitespace so typography alone isn't a change. */
export function normalize(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text: string): number {
  // Drop kramdown inline attribute lists ({: .class }), which parse as text.
  const cleaned = normalize(text.replace(/\{:[^}]*\}/g, ' '));
  return cleaned.match(/[A-Za-z0-9']+/g)?.length ?? 0;
}

function parse(source: string, mdx: boolean): Node {
  const processor = unified().use(remarkParse).use(remarkFrontmatter, ['yaml']).use(remarkGfm).use(remarkDirective);
  if (mdx) processor.use(remarkMdx);
  return processor.parse(source) as unknown as Node;
}

function slice(source: string, node: Node): string {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  return start !== undefined && end !== undefined ? source.slice(start, end) : '';
}

function textOf(node: Node): string {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? '';
  return (node.children ?? []).map(textOf).join(' ');
}

const URL_ATTR = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;

/** Extract the non-prose regions and prose word count of a Markdown or MDX document. */
export function extractRegions(source: string, mdx: boolean): Regions {
  const regions: Regions = {
    'code block': [],
    'inline code': [],
    'script/style': [],
    url: [],
    blockquote: [],
    words: 0,
    fallback: false,
  };

  let tree: Node;
  try {
    tree = parse(source, mdx);
  } catch {
    // Legacy posts aren't always valid MDX; plain Markdown still finds code,
    // links, and quotes, and treats JSX as raw HTML.
    tree = parse(source, false);
    regions.fallback = true;
  }

  let proseText = '';
  const walk = (node: Node): void => {
    switch (node.type) {
      case 'yaml':
        return;
      case 'code':
        regions['code block'].push(node.value ?? '');
        return;
      case 'inlineCode':
        regions['inline code'].push(node.value ?? '');
        return;
      case 'link':
      case 'image':
      case 'definition':
        if (node.url) regions.url.push(node.url);
        break;
      case 'html': {
        const html = node.value ?? '';
        if (/^\s*<(script|style)\b/i.test(html)) {
          regions['script/style'].push(html);
          return;
        }
        for (const m of html.matchAll(URL_ATTR)) regions.url.push(m[1]);
        return;
      }
      case 'mdxJsxFlowElement':
      case 'mdxJsxTextElement': {
        const name = (node.name ?? '').toLowerCase();
        if (name === 'script' || name === 'style') {
          regions['script/style'].push(slice(source, node));
          return;
        }
        for (const attr of node.attributes ?? []) {
          if ((attr.name === 'href' || attr.name === 'src') && typeof attr.value === 'string') {
            regions.url.push(attr.value);
          }
        }
        break;
      }
      case 'mdxFlowExpression':
      case 'mdxTextExpression':
      case 'mdxjsEsm':
        return;
      case 'blockquote':
        regions.blockquote.push(normalize(textOf(node)));
        break;
      case 'text':
        proseText += ` ${node.value ?? ''}`;
        return;
    }
    for (const child of node.children ?? []) walk(child);
  };
  walk(tree);

  regions.words = countWords(proseText);
  return regions;
}

/** Items in `before` with no identical counterpart in `after` (multiset difference). */
function missing(before: string[], after: string[]): string[] {
  const remaining = new Map<string, number>();
  for (const item of after) remaining.set(item, (remaining.get(item) ?? 0) + 1);
  const out: string[] = [];
  for (const item of before) {
    const n = remaining.get(item) ?? 0;
    if (n > 0) remaining.set(item, n - 1);
    else out.push(item);
  }
  return out;
}

/** Character-level similarity (Dice coefficient on bigrams), for pairing a changed item with its replacement. */
function similarity(a: string, b: string): number {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a === b) return 1;
  const grams = (s: string) => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) m.set(s.slice(i, i + 2), (m.get(s.slice(i, i + 2)) ?? 0) + 1);
    return m;
  };
  const ga = grams(a);
  const gb = grams(b);
  let overlap = 0;
  for (const [g, n] of ga) overlap += Math.min(n, gb.get(g) ?? 0);
  const total = Math.max(a.length - 1, 0) + Math.max(b.length - 1, 0);
  return total ? (2 * overlap) / total : 0;
}

const REGION_KINDS: RegionKind[] = ['code block', 'inline code', 'script/style', 'url', 'blockquote'];

/**
 * Compare two versions of a post. `after` of null means the post was deleted.
 * Removed or modified non-prose items are findings; additions are not.
 */
export function comparePost(
  before: string,
  after: string | null,
  mdx: { before: boolean; after: boolean },
): Finding[] {
  if (after === null) return [{ kind: 'deleted' }];

  const a = extractRegions(before, mdx.before);
  const b = extractRegions(after, mdx.after);
  const findings: Finding[] = [];

  const lost = a.words - b.words;
  if (a.words > 0 && lost > WORD_LOSS_MIN && lost / a.words > WORD_LOSS_RATIO) {
    findings.push({ kind: 'word loss', before: a.words, after: b.words });
  }

  for (const kind of REGION_KINDS) {
    const gone = missing(a[kind], b[kind]);
    if (gone.length === 0) continue;
    const added = missing(b[kind], a[kind]);
    for (const item of gone) {
      // Pair with the most similar new item (an edit) or report as removed.
      let best: string | null = null;
      let bestScore = 0.5;
      for (const candidate of added) {
        const score = similarity(item, candidate);
        if (score > bestScore) {
          best = candidate;
          bestScore = score;
        }
      }
      if (best !== null) added.splice(added.indexOf(best), 1);
      findings.push({ kind, before: item, after: best });
    }
  }
  return findings;
}

/** The first line that differs between two snippets, for a compact before → after report. */
export function firstDifference(before: string, after: string | null, width = 160): { before: string; after: string } {
  const clip = (s: string) => (s.length > width ? `${s.slice(0, width - 1)}…` : s);
  if (after === null) {
    const first = before.split('\n').find((l) => l.trim()) ?? before;
    return { before: clip(first.trim()), after: '(removed)' };
  }
  const a = before.split('\n');
  const b = after.split('\n');
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const la = (a[i] ?? '').trim();
    const lb = (b[i] ?? '').trim();
    if (la === lb) continue;
    // On long lines (quotes), start the window just before the first change.
    let p = 0;
    while (p < la.length && la[p] === lb[p]) p++;
    const from = p > width / 2 ? p - 40 : 0;
    const lead = from > 0 ? '…' : '';
    return { before: clip(lead + la.slice(from)), after: clip(lead + lb.slice(from)) };
  }
  return { before: clip(before), after: clip(after) };
}

/** Whether a diff touching `changedPosts` existing posts is a bulk pass. */
export function isBulk(changedPosts: number): boolean {
  return changedPosts >= BULK_POST_THRESHOLD;
}

/** Whether any commit message in the range acknowledges the findings. */
export function hasReviewTrailer(messages: string): boolean {
  return REVIEW_TRAILER.test(messages);
}
