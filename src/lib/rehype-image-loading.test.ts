/**
 * Tests for rehype-image-loading plugin
 *
 * Verifies that images get correct loading, decoding, and fetchpriority attributes.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { rehypeImageLoading } from './rehype-image-loading';

describe('rehypeImageLoading', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeImageLoading)
    .use(rehypeStringify);

  it('sets first image to eager with high priority', async () => {
    const md = '![First](https://example.com/a.png)';
    const html = String(await processor.process(md));

    expect(html).toContain('loading="eager"');
    expect(html).toContain('decoding="auto"');
    expect(html).toContain('fetchpriority="high"');
  });

  it('sets subsequent images to lazy', async () => {
    const md = '![First](https://example.com/a.png)\n\n![Second](https://example.com/b.png)';
    const html = String(await processor.process(md));

    const secondImgMatch = html.match(/<img[^>]*b\.png[^>]*>/);
    expect(secondImgMatch).toBeTruthy();
    expect(secondImgMatch![0]).toContain('loading="lazy"');
    expect(secondImgMatch![0]).toContain('decoding="async"');
    expect(secondImgMatch![0]).not.toContain('fetchpriority="high"');
  });

  it('handles a single image', async () => {
    const md = '![Only](https://example.com/only.png)';
    const html = String(await processor.process(md));

    expect(html).toContain('loading="eager"');
    expect(html).toContain('fetchpriority="high"');
    expect(html).not.toContain('loading="lazy"');
  });

  it('handles three images correctly', async () => {
    const md = [
      '![A](https://example.com/a.png)',
      '',
      '![B](https://example.com/b.png)',
      '',
      '![C](https://example.com/c.png)',
    ].join('\n');
    const html = String(await processor.process(md));

    const firstImg = html.match(/<img[^>]*a\.png[^>]*>/)!;
    const secondImg = html.match(/<img[^>]*b\.png[^>]*>/)!;
    const thirdImg = html.match(/<img[^>]*c\.png[^>]*>/)!;

    expect(firstImg[0]).toContain('loading="eager"');
    expect(secondImg[0]).toContain('loading="lazy"');
    expect(thirdImg[0]).toContain('loading="lazy"');
  });

  it('does not modify non-image elements', async () => {
    const md = '[A link](https://example.com)\n\n![Image](https://example.com/a.png)';
    const html = String(await processor.process(md));

    expect(html).not.toMatch(/<a[^>]*loading/);
    expect(html).toContain('loading="eager"');
  });

  it('handles raw HTML img tags after rehype-raw', async () => {
    const md = '<img src="https://example.com/a.png" alt="First" />';
    const html = String(await processor.process(md));

    expect(html).toContain('loading="eager"');
    expect(html).toContain('fetchpriority="high"');
  });

  it('handles mixed markdown and raw HTML images', async () => {
    const md = [
      '<img src="https://example.com/a.png" alt="First raw" />',
      '',
      '![Second md](https://example.com/b.png)',
    ].join('\n');
    const html = String(await processor.process(md));

    const firstImg = html.match(/<img[^>]*a\.png[^>]*>/)!;
    const secondImg = html.match(/<img[^>]*b\.png[^>]*>/)!;

    expect(firstImg[0]).toContain('loading="eager"');
    expect(secondImg[0]).toContain('loading="lazy"');
  });

  it('preserves existing class attributes on raw HTML images', async () => {
    const md = '<img src="https://example.com/a.png" alt="Test" class="img-fluid" />';
    const html = String(await processor.process(md));

    expect(html).toContain('class="img-fluid"');
    expect(html).toContain('loading="eager"');
  });
});
