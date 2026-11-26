/**
 * Tests for the syndication (RSS feed and email) rehype plugin list.
 *
 * Feed readers and mail clients don't load site CSS or run site JS, so web-only
 * markup (heading anchors, the CSS-sized :quote share icon) must not leak in,
 * and internal links must stay absolute.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkQuoteDirective } from './remark-quote-directive';
import { restoreIdentifierHyphens, syndicationRehypePlugins } from './markdown-pipeline';

const SITE = 'https://ben.balter.com';

function render(markdown: string) {
  return unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkQuoteDirective)
    .use(remarkRehype, { allowDangerousHtml: true })
    // use() accepts a plugin list and applies each entry in order, unpacking
    // [plugin, options] tuples, the same as the old per-plugin loop did
    .use(syndicationRehypePlugins(SITE))
    .use(rehypeStringify)
    .process(markdown)
    .then(String);
}

describe('syndicationRehypePlugins', () => {
  it('flattens the :quote share affordance to plain highlighted text', async () => {
    const html = await render('Ben says :quote[Show your work.]{#show-your-work} often.');
    expect(html).toContain('Show your work.');
    expect(html).not.toContain('quote-inline-icon');
    expect(html).not.toContain('<svg');
  });

  it('does not add heading anchor links', async () => {
    const html = await render('## A heading');
    expect(html).toContain('<h2');
    expect(html).not.toContain('anchor-link');
  });

  it('keeps internal links absolute', async () => {
    const html = await render(`See [this post](${SITE}/2024/01/15/post/).`);
    expect(html).toContain(`href="${SITE}/2024/01/15/post/"`);
  });

  it('absolutizes root-relative links and images', async () => {
    const html = await render('See [this post](/2024/01/15/post/).\n\n![Chart](/assets/img/chart.png)');
    expect(html).toContain(`href="${SITE}/2024/01/15/post/"`);
    expect(html).toContain(`src="${SITE}/assets/img/chart.png"`);
  });

  it('does not open absolutized internal links in a new tab', async () => {
    const html = await render('See [this post](/2024/01/15/post/).');
    expect(html).not.toContain('target="_blank"');
  });

  it('opens external links in a new tab', async () => {
    const html = await render('See [example](https://example.com/).');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener"');
    // Keep the referrer (origin only, per Referrer-Policy) so linked sites can attribute clicks
    expect(html).not.toContain('noreferrer');
  });
});

describe('restoreIdentifierHyphens', () => {
  it('restores hyphens in letter-prefixed identifiers', () => {
    expect(restoreIdentifierHyphens('OMB memoranda M-10–22 and M-10–23')).toBe(
      'OMB memoranda M-10-22 and M-10-23',
    );
  });

  it('restores hyphens in FAR and DFARS clause numbers', () => {
    expect(restoreIdentifierHyphens('FAR 52.227–14 and DFARS 252.227–7014')).toBe(
      'FAR 52.227-14 and DFARS 252.227-7014',
    );
  });

  it('leaves plain numeric and decimal ranges as en dashes', () => {
    expect(restoreIdentifierHyphens('8–10x growth, 2013–2016, 1.5–2 hours')).toBe(
      '8–10x growth, 2013–2016, 1.5–2 hours',
    );
  });
});
