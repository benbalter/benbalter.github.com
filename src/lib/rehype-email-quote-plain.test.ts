/**
 * Tests for rehype-email-quote-plain plugin
 *
 * Verifies that the web-only :quote share affordance (anchor, CSS-sized icon
 * SVG, sr-only hint) is flattened to its highlighted <mark> for email and RSS.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { remarkQuoteDirective } from './remark-quote-directive';
import { rehypeEmailQuotePlain } from './rehype-email-quote-plain';

// Mirror the syndication pipeline: directive → hast (rehypeRaw) → plugin.
function render(markdown: string) {
  return unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkQuoteDirective)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeEmailQuotePlain)
    .use(rehypeStringify)
    .process(markdown)
    .then(String);
}

function renderHtml(html: string) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeEmailQuotePlain)
    .use(rehypeStringify)
    .process(html)
    .then(String);
}

describe('rehypeEmailQuotePlain', () => {
  it('keeps the highlighted quote text', async () => {
    const html = await render('Ben says :quote[Show your work.]{#show-your-work} often.');
    expect(html).toContain('quote-inline-mark');
    expect(html).toContain('Show your work.');
    expect(html).toContain('Ben says');
    expect(html).toContain('often.');
  });

  it('drops the share anchor, icon SVG, and sr-only hint', async () => {
    const html = await render('Ben says :quote[Show your work.]{#show-your-work} often.');
    expect(html).not.toContain('class="quote-inline"');
    expect(html).not.toContain('quote-inline-icon');
    expect(html).not.toContain('<svg');
    expect(html).not.toContain('sr-only');
    expect(html).not.toContain('href="#quote-show-your-work"');
  });

  it('falls back to the anchor children when there is no <mark>', async () => {
    const html = await renderHtml(
      '<p><a class="quote-inline" href="#q">Plain text<span class="quote-inline-icon"><svg></svg></span><span class="sr-only">Share</span></a></p>',
    );
    expect(html).toContain('Plain text');
    expect(html).not.toContain('<a');
    expect(html).not.toContain('<svg');
    expect(html).not.toContain('Share');
  });

  it('leaves ordinary links alone', async () => {
    const html = await renderHtml('<p><a class="other" href="/x">Link</a></p>');
    expect(html).toContain('<a class="other" href="/x">Link</a>');
  });
});
