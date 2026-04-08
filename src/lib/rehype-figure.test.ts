/**
 * Tests for rehype-figure plugin
 *
 * Verifies that standalone images in paragraphs are wrapped in <figure> elements
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypeFigure } from './rehype-figure';

describe('rehypeFigure', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeFigure)
    .use(rehypeStringify);

  it('should wrap a standalone image in <figure> with <figcaption>', async () => {
    const markdown = '![A cat sitting on a mat](cat.jpg)';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('<figure>');
    expect(html).toContain('<img src="cat.jpg" alt="A cat sitting on a mat">');
    expect(html).toContain('<figcaption>A cat sitting on a mat</figcaption>');
    expect(html).toContain('</figure>');
    expect(html).not.toContain('<p>');
  });

  it('should omit <figcaption> when alt text is empty', async () => {
    const markdown = '![](photo.jpg)';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('<figure>');
    expect(html).toContain('<img src="photo.jpg" alt="">');
    expect(html).not.toContain('<figcaption>');
    expect(html).toContain('</figure>');
  });

  it('should not wrap images mixed with text in a paragraph', async () => {
    const markdown = 'Here is an image ![alt](img.jpg) in a paragraph.';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).not.toContain('<figure>');
    expect(html).toContain('<p>');
    expect(html).toContain('<img');
  });

  it('should handle multiple standalone images in separate paragraphs', async () => {
    const markdown = '![First](a.jpg)\n\n![Second](b.jpg)';
    const result = await processor.process(markdown);
    const html = String(result);

    const figureCount = (html.match(/<figure>/g) || []).length;
    expect(figureCount).toBe(2);
    expect(html).toContain('<figcaption>First</figcaption>');
    expect(html).toContain('<figcaption>Second</figcaption>');
  });

  it('should not affect non-image paragraphs', async () => {
    const markdown = 'Just a regular paragraph.';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).not.toContain('<figure>');
    expect(html).toContain('<p>Just a regular paragraph.</p>');
  });

  it('should not wrap paragraphs with multiple images', async () => {
    // Two images in the same paragraph (no blank line between)
    const markdown = '![A](a.jpg)![B](b.jpg)';
    const result = await processor.process(markdown);
    const html = String(result);

    // Both images in the same <p>, so should not be wrapped
    expect(html).not.toContain('<figure>');
  });
});
