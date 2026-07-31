/**
 * Tests for the remark-quote-directive plugin
 *
 * Verifies that `:quote[text]{#id}` becomes an inline, shareable pull-quote
 * anchor with the expected structure and deep-link, that id validation errors
 * with authoring context, and covers the exported helpers.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import {
  remarkQuoteDirective,
  quoteAnchorId,
  quoteDirectiveId,
} from './remark-quote-directive';

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkQuoteDirective)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

const render = (markdown: string) => processor.process(markdown).then(String);

describe('remarkQuoteDirective', () => {
  it('renders an inline shareable quote anchor deep-linking to itself', async () => {
    const html = await render('Ben says :quote[Show your work.]{#show-your-work} often.');

    expect(html).toContain('class="quote-inline"');
    expect(html).toContain('id="quote-show-your-work"');
    expect(html).toContain('href="#quote-show-your-work"');
    expect(html).toContain('data-quote-id="show-your-work"');
    // Quote text carries semantic emphasis inside a <mark>.
    expect(html).toContain('quote-inline-mark');
    expect(html).toContain('<strong>Show your work.</strong>');
    // Progressive-enhancement affordances.
    expect(html).toContain('quote-inline-icon');
    expect(html).toContain('(share this quote)');
  });

  it('preserves inline markup inside the quote text', async () => {
    const html = await render(':quote[Be *bold*.]{#be-bold}');
    expect(html).toContain('<em>bold</em>');
  });

  it('throws when the id is missing', async () => {
    await expect(render(':quote[No id here.]')).rejects.toThrow(/missing its id/);
  });

  it('throws when the id is not kebab-case', async () => {
    await expect(render(':quote[Bad id.]{#Not_Kebab}')).rejects.toThrow(/kebab-case/);
  });

  it('quoteAnchorId prefixes the fragment', () => {
    expect(quoteAnchorId('show-your-work')).toBe('quote-show-your-work');
  });

  it('quoteDirectiveId validates and returns the id', () => {
    const node = (attributes: Record<string, string>) =>
      ({ type: 'textDirective', name: 'quote', attributes });
    expect(quoteDirectiveId(node({ id: 'ok-id' }))).toBe('ok-id');
    expect(() => quoteDirectiveId(node({ id: 'BAD' }))).toThrow(/kebab-case/);
    expect(() => quoteDirectiveId(node({}))).toThrow(/missing its id/);
  });
});
