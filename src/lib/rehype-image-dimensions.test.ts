/**
 * Tests for rehype-image-dimensions plugin
 *
 * Verifies that WordPress-sized images get width/height attributes so the
 * browser can reserve space and avoid layout shift, while other images are
 * left untouched.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { rehypeImageDimensions } from './rehype-image-dimensions';

describe('rehypeImageDimensions', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeImageDimensions)
    .use(rehypeStringify);

  it('parses WordPress -WxH suffix into width/height', async () => {
    const md = '<img src="https://ben.balter.com/x/photo-300x223.png" alt="Test" />';
    const html = String(await processor.process(md));

    expect(html).toContain('width="300"');
    expect(html).toContain('height="223"');
  });

  it('handles suffixes on jpg/gif and large renditions', async () => {
    const md = '<img src="https://ben.balter.com/x/wide-1024x363.jpg" alt="Wide" />';
    const html = String(await processor.process(md));

    expect(html).toContain('width="1024"');
    expect(html).toContain('height="363"');
  });

  it('parses a suffix even with a query string', async () => {
    const md = '<img src="https://ben.balter.com/x/photo-292x300.jpg?v=2" alt="Q" />';
    const html = String(await processor.process(md));

    expect(html).toContain('width="292"');
    expect(html).toContain('height="300"');
  });

  it('leaves images without a parseable size unchanged', async () => {
    const src = 'https://ben.balter.com/x/original.jpg';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const md = `<img src="${src}" alt="Original" />`;
    const html = String(await processor.process(md));

    expect(html).not.toContain('width=');
    expect(html).not.toContain('height=');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining(src));
    warn.mockRestore();
  });

  it('does not override dimensions that are already set', async () => {
    const md = '<img src="https://ben.balter.com/x/photo-300x223.png" alt="T" width="50" height="40" />';
    const html = String(await processor.process(md));

    expect(html).toContain('width="50"');
    expect(html).toContain('height="40"');
    expect(html).not.toContain('width="300"');
  });

  it('does not touch non-image elements', async () => {
    const md = '[link](https://ben.balter.com/x/a-300x200.png)';
    const html = String(await processor.process(md));

    expect(html).not.toContain('width="300"');
  });

  describe('warning dedup', () => {
    let warn: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });
    afterEach(() => warn.mockRestore());

    it('warns at most once per src across runs', async () => {
      // A distinct src so module-level dedup state is clean for this assertion.
      const src = 'https://ben.balter.com/x/dedup-me.png';
      const md = `<img src="${src}" alt="A" />`;
      await processor.process(md);
      await processor.process(md);

      const calls = warn.mock.calls.filter((c: unknown[]) => String(c[0]).includes(src));
      expect(calls).toHaveLength(1);
    });
  });
});
