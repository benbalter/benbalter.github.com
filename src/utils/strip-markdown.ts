/**
 * Reduce Markdown to plain text.
 *
 * One parser-backed implementation for every place that needs the prose of a
 * Markdown string: post cards and OG images (descriptions), SEO validation,
 * related-post scoring, reading time, and the standard.site sync payload.
 * Parsing with remark (+ GFM) instead of regexes means emphasis, links, tables,
 * footnotes, and escapes are handled the way the site actually renders them,
 * and intraword underscores like `snake_case` survive intact.
 */

import type { Nodes, Parent, Root, Text } from 'mdast';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import { stripHtmlTags } from './strip-html';

export interface MarkdownToTextOptions {
  /**
   * Keep the text of code blocks and inline code (default: true). Pass false
   * for prose-only output, e.g. search/AT Protocol text or TF-IDF input.
   */
  code?: boolean;
}

const processor = unified().use(remarkParse).use(remarkGfm);

/** Nodes whose text is a single run of prose, emitted as one chunk. */
const TEXT_BLOCKS = new Set(['paragraph', 'heading', 'tableCell']);

/**
 * Convert Markdown to plain text with collapsed whitespace.
 *
 * - Links become their text; images, footnote references, and footnote
 *   definitions are dropped.
 * - Raw HTML is reduced to its text content.
 * - Block boundaries (paragraphs, headings, list items, table cells) become
 *   a single space, so words from adjacent blocks never run together.
 */
export function markdownToText(markdown: string, { code = true }: MarkdownToTextOptions = {}): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  const tree = processor.runSync(processor.parse(markdown)) as Root;

  // Rewrite or drop nodes before extracting text.
  visit(tree, (node, index, parent: Parent | undefined) => {
    if (!parent || index === undefined) return;
    const drop =
      node.type === 'footnoteReference' ||
      node.type === 'footnoteDefinition' ||
      node.type === 'definition' ||
      node.type === 'image' ||
      node.type === 'imageReference' ||
      (!code && (node.type === 'code' || node.type === 'inlineCode'));
    if (drop) {
      parent.children.splice(index, 1);
      return [SKIP, index];
    }
    if (node.type === 'html' || node.type === 'break') {
      const value = 'value' in node && typeof node.value === 'string' ? stripHtmlTags(node.value, ' ') : ' ';
      const text: Text = { type: 'text', value };
      parent.children.splice(index, 1, text);
      return SKIP;
    }
    return undefined;
  });

  const chunks: string[] = [];
  visit(tree, (node: Nodes) => {
    if (TEXT_BLOCKS.has(node.type) || node.type === 'code' || node.type === 'text') {
      // Headings, paragraphs, and cells are phrasing containers: toString
      // joins their inline children without adding spaces inside words.
      chunks.push(toString(node, { includeImageAlt: false }));
      return SKIP;
    }
    return undefined;
  });

  return chunks.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Strip Markdown formatting from a short string such as a post description.
 *
 * @param text - The markdown text to strip
 * @returns Plain text without markdown formatting
 */
export function stripMarkdown(text: string): string {
  return markdownToText(text);
}
