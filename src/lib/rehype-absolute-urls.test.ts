/**
 * Tests for rehype-absolute-urls plugin
 *
 * Verifies that root-relative URLs are absolutized for feed readers and mail clients
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { absolutize, rehypeAbsoluteUrls } from './rehype-absolute-urls';

const SITE = 'https://ben.balter.com';

async function render(html: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeAbsoluteUrls, { siteUrl: SITE })
    .use(rehypeStringify)
    .process(html);
  return String(result);
}

describe('absolutize', () => {
  it('prefixes root-relative URLs', () => {
    expect(absolutize('/about/', SITE)).toBe(`${SITE}/about/`);
  });

  it('tolerates a trailing slash on siteUrl', () => {
    expect(absolutize('/about/', `${SITE}/`)).toBe(`${SITE}/about/`);
  });

  it('leaves absolute, protocol-relative, fragment, and mailto URLs alone', () => {
    expect(absolutize('https://example.com/', SITE)).toBe('https://example.com/');
    expect(absolutize('//cdn.example.com/x.png', SITE)).toBe('//cdn.example.com/x.png');
    expect(absolutize('#section', SITE)).toBe('#section');
    expect(absolutize('mailto:ben@example.com', SITE)).toBe('mailto:ben@example.com');
  });

  it('returns undefined for empty input', () => {
    expect(absolutize(undefined, SITE)).toBeUndefined();
    expect(absolutize('', SITE)).toBeUndefined();
  });
});

describe('rehypeAbsoluteUrls', () => {
  it('absolutizes root-relative links', async () => {
    const html = await render('<a href="/2022/03/17/why-async/">post</a>');
    expect(html).toContain(`href="${SITE}/2022/03/17/why-async/"`);
  });

  it('absolutizes image src and video poster', async () => {
    const html = await render('<img src="/assets/img/a.png" alt=""><video poster="/v.jpg"></video>');
    expect(html).toContain(`src="${SITE}/assets/img/a.png"`);
    expect(html).toContain(`poster="${SITE}/v.jpg"`);
  });

  it('absolutizes every srcset candidate and keeps descriptors', async () => {
    const html = await render('<img src="/a.png" srcset="/a-1x.png 1x, https://cdn.example.com/a-2x.png 2x" alt="">');
    expect(html).toContain(`srcset="${SITE}/a-1x.png 1x, https://cdn.example.com/a-2x.png 2x"`);
  });

  it('leaves external and fragment links alone', async () => {
    const html = await render('<a href="https://example.com/">x</a><a href="#fn1">1</a>');
    expect(html).toContain('href="https://example.com/"');
    expect(html).toContain('href="#fn1"');
  });
});
