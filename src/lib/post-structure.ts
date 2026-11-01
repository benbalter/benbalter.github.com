/**
 * Structure checks for blog posts, from the packaging checklist in Ben's
 * writing-style guide (references/long-form.md in benbalter/writing-style):
 *
 * - label headings: an H2/H3 that's a label ("Background", "Conclusion")
 *   instead of a claim a skimmer can read
 * - fake headings: a paragraph that's only bold text standing in for a heading,
 *   which screen readers can't navigate to (Hard Rule 9)
 * - pull quotes: more than five `:quote[...]` directives, or two in one section
 * - sparse headings: a long post with too few H2s to skim
 * - TL;DR: a `tldr` that isn't two or three sentences, or repeats `description`
 *
 * Everything here is a judgment call, so script/validate-seo.ts reports these
 * as warnings, never errors.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMdx from 'remark-mdx';
import { normalize } from './content-integrity';

/** Headings that name a section instead of making a claim. */
const LABEL_HEADING =
  /^(?:background|overview|introduction|intro|conclusion|conclusions|summary|final thoughts|closing thoughts|wrapping up|wrap-up|key takeaways|takeaways)[.:!]?$/i;
/** A bold paragraph longer than this is an emphasized note, not a heading. */
const FAKE_HEADING_MAX_CHARS = 80;
export const MAX_PULL_QUOTES = 5;
/** The guide asks for a heading about every 250 words; warn well past that. */
const MAX_WORDS_PER_SECTION = 500;
/** Shorter posts read fine without headings. */
const MIN_WORDS_FOR_HEADINGS = 800;

interface Node {
  type: string;
  depth?: number;
  name?: string;
  value?: string;
  children?: Node[];
}

function parse(source: string, mdx: boolean): Node {
  const processor = unified().use(remarkParse).use(remarkFrontmatter, ['yaml']).use(remarkGfm).use(remarkDirective);
  if (mdx) processor.use(remarkMdx);
  try {
    return processor.parse(source) as unknown as Node;
  } catch {
    // Legacy posts aren't always valid MDX; fall back to plain Markdown.
    return parse(source, false);
  }
}

function textOf(node: Node): string {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}

function countWords(node: Node): number {
  if (node.type === 'code' || node.type === 'yaml' || node.type === 'html') return 0;
  if (node.type === 'text') return node.value?.match(/[A-Za-z0-9']+/g)?.length ?? 0;
  return (node.children ?? []).reduce((sum, child) => sum + countWords(child), 0);
}

function countQuotes(node: Node): number {
  const own = node.type === 'textDirective' && node.name === 'quote' ? 1 : 0;
  return own + (node.children ?? []).reduce((sum, child) => sum + countQuotes(child), 0);
}

/** Count sentences: runs ending in . ! or ? followed by whitespace or the end. */
export function countSentences(text: string): number {
  return normalize(text).match(/[^.!?]+[.!?]+(?=\s|$)/g)?.length ?? 0;
}

export interface PostFrontmatter {
  description?: string;
  tldr?: string;
}

/** Return a warning message for each structure problem in a post. */
export function checkPostStructure(source: string, mdx: boolean, frontmatter: PostFrontmatter = {}): string[] {
  const warnings: string[] = [];
  const root = parse(source, mdx);

  // Sections split at each H2; the intro before the first H2 is section 0.
  const sections: { title: string; words: number; quotes: number }[] = [{ title: 'the intro', words: 0, quotes: 0 }];
  for (const node of root.children ?? []) {
    if (node.type === 'heading') {
      const text = textOf(node).trim();
      if ((node.depth === 2 || node.depth === 3) && LABEL_HEADING.test(text)) {
        warnings.push(`Heading "${text}" is a label. Make it a claim a skimmer can act on.`);
      }
      if (node.depth === 2) sections.push({ title: `"${text}"`, words: 0, quotes: 0 });
      continue;
    }
    const section = sections[sections.length - 1];
    section.words += countWords(node);
    section.quotes += countQuotes(node);

    const only = node.children?.length === 1 ? node.children[0] : undefined;
    if (node.type === 'paragraph' && only?.type === 'strong') {
      const text = textOf(only).trim();
      if (text.length <= FAKE_HEADING_MAX_CHARS) {
        warnings.push(`"${text}" is a bold line standing in for a heading. Use a real ## heading.`);
      }
    }
  }

  const quotes = sections.reduce((sum, s) => sum + s.quotes, 0);
  if (quotes > MAX_PULL_QUOTES) {
    warnings.push(`${quotes} pull quotes; keep it to ${MAX_PULL_QUOTES} or fewer so each one stands out.`);
  }
  for (const section of sections) {
    if (section.quotes > 1) {
      warnings.push(`${section.quotes} pull quotes in ${section.title}; use at most one per section.`);
    }
  }

  const words = sections.reduce((sum, s) => sum + s.words, 0);
  const h2s = sections.length - 1;
  if (words >= MIN_WORDS_FOR_HEADINGS && words / sections.length > MAX_WORDS_PER_SECTION) {
    warnings.push(
      `${words} words under ${h2s} H2 heading${h2s === 1 ? '' : 's'} (about ${Math.round(words / sections.length)} words a section). Add a heading every 250 words or so.`,
    );
  }

  const tldr = frontmatter.tldr?.trim();
  if (tldr) {
    const sentences = countSentences(tldr);
    if (sentences < 2 || sentences > 3) {
      warnings.push(`tldr is ${sentences} sentence${sentences === 1 ? '' : 's'}; aim for two or three.`);
    }
    if (frontmatter.description && normalize(tldr) === normalize(frontmatter.description)) {
      warnings.push('tldr repeats description. Give each its own job: the description earns the click, the tldr states the thesis and the action.');
    }
  }

  return warnings;
}
