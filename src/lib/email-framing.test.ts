import { describe, it, expect, vi } from 'vitest';
import { leadInHtml, bookCtaHtml } from './email-framing';
import { siteConfig } from '../config';

describe('leadInHtml', () => {
  it('links to the site and the canonical post URL', () => {
    const html = leadInHtml('https://ben.balter.com/2024/01/15/post/');
    expect(html).toContain(`href="${siteConfig.url}"`);
    expect(html).toContain('href="https://ben.balter.com/2024/01/15/post/"');
    expect(html).toContain('Read it on the web');
  });
});

describe('bookCtaHtml', () => {
  it.each([
    ['adapted', 'adapted from my book'],
    ['cut', "a whole book's worth more"],
    ['inspired', 'inspired a chapter in my book'],
    [undefined, "It's now a book"],
  ] as const)('uses the %s headline', (relation, expected) => {
    expect(bookCtaHtml(relation)).toContain(expected);
  });

  it('links to the email book URL with the price', () => {
    const html = bookCtaHtml();
    expect(html).toContain(`href="${siteConfig.bookUrlEmail}"`);
    expect(html).toContain(siteConfig.bookPrice);
  });

  it('escapes ampersands in the book title', () => {
    const html = bookCtaHtml('adapted');
    expect(html).not.toMatch(/&(?![a-z]+;|#\d+;)/);
  });

  it('escapes every HTML special character in the book title', async () => {
    vi.resetModules();
    vi.doMock('../config', () => ({
      siteConfig: { ...siteConfig, bookTitle: 'Tags <b> & "quotes"' },
    }));
    const { bookCtaHtml: mockedCta } = await import('./email-framing');
    const html = mockedCta('adapted');
    expect(html).toContain('Tags &lt;b&gt; &amp; &quot;quotes&quot;');
    expect(html).not.toContain('<b>');
    vi.doUnmock('../config');
  });

  it('is inline-styled with no class attributes', () => {
    expect(bookCtaHtml()).not.toContain('class=');
  });
});
