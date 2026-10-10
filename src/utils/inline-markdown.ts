import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';
import { unified } from 'unified';

const processor = unified()
  .use(remarkParse)
  .use(remarkSmartypants)
  .use(remarkRehype)
  .use(rehypeStringify);

/**
 * Render a one-line Markdown string (a TL;DR, a front-matter blurb) to inline
 * HTML with the same smart quotes and dashes post bodies get.
 *
 * `marked.parseInline` skipped smartypants, so a TL;DR showed straight quotes
 * ("people's") a few lines above the body's curly ones.
 */
export function renderInlineMarkdown(markdown: string): string {
  const html = String(processor.processSync(markdown)).trim();
  return html.replace(/^<p>([\s\S]*)<\/p>$/, '$1');
}
