/**
 * Tests for rehype-footnote-a11y plugin
 *
 * Verifies that accessibility attributes are added to footnote elements
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypeFootnoteA11y } from './rehype-footnote-a11y';

describe('rehypeFootnoteA11y', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeFootnoteA11y)
    .use(rehypeStringify);

  const markdownWithFootnote = `
Here is some text with a footnote[^1].

[^1]: This is the footnote content.
`;

  it('should add aria-label="Footnotes" to the footnotes section', async () => {
    const result = await processor.process(markdownWithFootnote);
    const html = String(result);

    expect(html).toMatch(/section[^>]*aria-label="Footnotes"/);
  });

  it('should not add deprecated doc-endnotes role to section', async () => {
    const result = await processor.process(markdownWithFootnote);
    const html = String(result);

    expect(html).not.toContain('doc-endnotes');
  });

  it('should add role="note" to footnote list items', async () => {
    const result = await processor.process(markdownWithFootnote);
    const html = String(result);

    expect(html).toMatch(/li[^>]*role="note"/);
  });

  it('should not add deprecated DPUB-ARIA roles', async () => {
    const result = await processor.process(markdownWithFootnote);
    const html = String(result);

    expect(html).not.toContain('doc-endnote');
    expect(html).not.toContain('doc-backlink');
    expect(html).not.toContain('doc-noteref');
  });

  it('should handle multiple footnotes', async () => {
    const markdown = `
First point[^1] and second point[^2].

[^1]: First footnote.
[^2]: Second footnote.
`;
    const result = await processor.process(markdown);
    const html = String(result);

    // Should have exactly one footnotes section with aria-label
    const labelCount = (html.match(/aria-label="Footnotes"/g) || []).length;
    expect(labelCount).toBe(1);

    // Should have two footnote items with role="note"
    const noteCount = (html.match(/role="note"/g) || []).length;
    expect(noteCount).toBe(2);
  });

  it('should not affect content without footnotes', async () => {
    const markdown = 'Just a regular paragraph with no footnotes.';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).not.toContain('role="note"');
    expect(html).not.toContain('aria-label="Footnotes"');
  });
});
