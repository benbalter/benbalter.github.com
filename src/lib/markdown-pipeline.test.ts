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
import { syndicationRehypePlugins } from './markdown-pipeline';

const SITE = 'https://ben.balter.com';

function render(markdown: string) {
  let processor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkQuoteDirective)
    .use(remarkRehype, { allowDangerousHtml: true }) as any;
  for (const plugin of syndicationRehypePlugins(SITE)) {
    processor = Array.isArray(plugin) ? processor.use(plugin[0], plugin[1]) : processor.use(plugin);
  }
  return processor.use(rehypeStringify).process(markdown).then(String);
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

  it('opens external links in a new tab', async () => {
    const html = await render('See [example](https://example.com/).');
    expect(html).toContain('target="_blank"');
    expect(html).toMatch(/rel="noopener noreferrer"/);
  });
});
