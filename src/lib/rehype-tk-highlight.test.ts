/**
 * Tests for the rehype-tk-highlight plugin
 *
 * Verifies that standalone "TK" placeholders get a dev-only highlight, that
 * words merely containing TK and code are left alone, and that the plugin is
 * a no-op in production. Uses the real markdown pipeline
 * (remark → rehype-raw → rehype-tk-highlight) as production does.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { rehypeTkHighlight } from './rehype-tk-highlight';

const render = async (markdown: string, enabled?: boolean) =>
  String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeTkHighlight, enabled === undefined ? {} : { enabled })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(markdown),
  );

const markCount = (html: string) => (html.match(/class="tk-marker"/g) ?? []).length;

describe('rehypeTkHighlight', () => {
  it('wraps a standalone TK in a mark', async () => {
    expect(await render('TK: the night itself', true)).toBe(
      '<p><mark class="tk-marker" title="TK: still to come">TK</mark>: the night itself</p>',
    );
  });

  it('wraps every TK, including inside inline HTML', async () => {
    expect(markCount(await render('TK one, then <strong>TK two</strong>', true))).toBe(2);
  });

  it('leaves words that merely contain TK alone', async () => {
    expect(markCount(await render('TKO, ATK, and tk stay as they are', true))).toBe(0);
  });

  it('skips inline code and code blocks', async () => {
    expect(markCount(await render('`TK`\n\n```\nTK\n```', true))).toBe(0);
  });

  it('does nothing when disabled', async () => {
    expect(markCount(await render('TK', false))).toBe(0);
  });

  it('defaults to off in production', async () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      expect(markCount(await render('TK'))).toBe(0);
    } finally {
      process.env.NODE_ENV = previous;
    }
  });

  it('defaults to on outside production', async () => {
    const previous = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      expect(markCount(await render('TK'))).toBe(1);
    } finally {
      process.env.NODE_ENV = previous;
    }
  });
});
