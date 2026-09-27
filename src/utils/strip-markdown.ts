import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import stripMarkdownPlugin from 'strip-markdown';
import { unified } from 'unified';
import { stripHtmlTags } from './strip-html';

const markdownParser = unified()
  .use(remarkParse)
  .use(stripMarkdownPlugin, {
    remove: [['html', (node) => ({ type: 'text', value: stripHtmlTags(node.value ?? '', ' ') })]],
  });

/**
 * Remove Markdown formatting and HTML tags, returning normalized plain text.
 */
export function stripMarkdown(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const tree = markdownParser.runSync(markdownParser.parse(text));
  return tree.children
    .map((node) => toString(node))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
