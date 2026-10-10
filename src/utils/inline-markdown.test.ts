import { describe, expect, it } from 'vitest';
import { renderInlineMarkdown } from './inline-markdown';

describe('renderInlineMarkdown', () => {
  it('curls quotes and apostrophes', () => {
    expect(renderInlineMarkdown(`People's "work" doesn't show`)).toBe(
      'People’s “work” doesn’t show',
    );
  });

  it('renders inline Markdown without a wrapping paragraph', () => {
    expect(renderInlineMarkdown('Read *this* and [that](/that/)')).toBe(
      'Read <em>this</em> and <a href="/that/">that</a>',
    );
  });

  it('leaves quotes inside code alone', () => {
    expect(renderInlineMarkdown("Run `git commit -m 'msg'`")).toBe(
      "Run <code>git commit -m 'msg'</code>",
    );
  });
});
