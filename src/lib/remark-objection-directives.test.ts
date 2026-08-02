/**
 * Tests for the remark-objection-directives plugin
 *
 * Verifies that `:::objection[question?]` container directives become an
 * accessible "But what about…" objection/response aside, and that a directive
 * with no question label errors loudly rather than rendering a broken block.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkObjectionDirectives } from './remark-objection-directives';

const processor = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkObjectionDirectives)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

const render = (markdown: string) => processor.process(markdown).then(String);

describe('remarkObjectionDirectives', () => {
  it('renders an accessible objection/response aside', async () => {
    const html = await render(
      ':::objection[Is this really necessary?]\nYes, and here is why.\n:::',
    );

    expect(html).toContain('<aside class="objection" aria-label="Objection and response">');
    expect(html).toContain('class="objection-q"');
    expect(html).toContain('But what about…');
    expect(html).toContain('Is this really necessary?');
    expect(html).toContain('class="objection-a"');
    expect(html).toContain('Yes, and here is why.');
  });

  it('preserves inline markup in the question label', async () => {
    const html = await render(':::objection[Is *this* the point?]\nNo.\n:::');
    expect(html).toContain('<em>this</em>');
  });

  it('throws when the directive has no question label', async () => {
    await expect(render(':::objection\nNo question here.\n:::')).rejects.toThrow(
      /needs a question label/,
    );
  });

  it('leaves unrelated container directives untouched', async () => {
    const html = await render(':::note[Heads up]\nBody.\n:::');
    expect(html).not.toContain('class="objection"');
  });
});
