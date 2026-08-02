/**
 * Tests for the rehype-acronyms plugin
 *
 * Verifies that listed acronyms are wrapped in a tooltip <abbr> on first
 * occurrence, that plurals and case-sensitivity behave, and that links, code,
 * headings, and existing abbreviations are skipped. Uses the real markdown
 * pipeline (remark → rehype-raw → rehype-acronyms) so raw HTML and skip
 * elements exist as they do in production.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { rehypeAcronyms } from './rehype-acronyms';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeAcronyms)
  .use(rehypeStringify, { allowDangerousHtml: true });

const render = async (markdown: string) => String(await processor.process(markdown));

// Count how many <abbr> tags the plugin produced.
const abbrCount = (html: string) => (html.match(/<abbr/g) ?? []).length;

describe('rehypeAcronyms', () => {
  it('wraps an acronym in an <abbr> with the tooltip markup Tldr uses', async () => {
    const html = await render('We adopted OKR this quarter.');

    expect(html).toContain('<abbr');
    expect(html).toContain('class="initialism"');
    expect(html).toContain('data-tooltip="true"');
    // Prefix match: the displayed tooltip is the expansion plus an optional gloss.
    expect(html).toContain('data-tooltip-text="Objectives and Key Results');
    expect(html).toContain('title="Objectives and Key Results');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('>OKR</abbr>');
    // WAI-ARIA tooltip pattern: an abbreviation with a description, not a button.
    expect(html).not.toContain('role="button"');
    expect(html).not.toContain('aria-expanded');
  });

  it('wraps only the first occurrence per document', async () => {
    const html = await render('First OKR, then another OKR later.');

    expect(abbrCount(html)).toBe(1);
    // The second occurrence stays as plain text.
    expect(html).toContain('another OKR later');
  });

  it('wraps plurals but shows the singular meaning', async () => {
    const html = await render('We reviewed several PRs today.');

    expect(html).toContain('>PRs</abbr>');
    // Plural wraps, but the tooltip maps back to the singular expansion (+ gloss).
    expect(html).toContain('data-tooltip-text="Pull request');
  });

  it('is case-sensitive: lowercase prose is not wrapped', async () => {
    const html = await render('Open a pr before the PR meeting.');

    // Only the uppercase "PR" is wrapped; lowercase "pr" is untouched.
    expect(abbrCount(html)).toBe(1);
    expect(html).toContain('Open a pr before');
    expect(html).toContain('>PR</abbr>');
  });

  it('does not match an acronym embedded in a larger word', async () => {
    const html = await render('The PRODUCT roadmap is public.');

    expect(abbrCount(html)).toBe(0);
    expect(html).toContain('PRODUCT');
  });

  it('skips text inside code, links, and headings', async () => {
    // Positive control: CI is a live listed acronym, so the 0-counts below are
    // meaningfully due to skipping (not just an unlisted term).
    expect(abbrCount(await render('The CI passed.'))).toBe(1);

    const code = await render('Call the `CI` server.');
    expect(abbrCount(code)).toBe(0);

    const link = await render('See the [CI](https://example.com/) docs.');
    expect(abbrCount(link)).toBe(0);

    const heading = await render('# CI reference');
    expect(abbrCount(heading)).toBe(0);
  });

  it('does not double-wrap an existing <abbr>', async () => {
    const html = await render('Read the <abbr>CI</abbr> spec.');

    expect(abbrCount(html)).toBe(1); // the original, not a nested one
    expect(html).not.toContain('data-tooltip="true"');
  });

  it('resets per document (first occurrence wraps in each separate render)', async () => {
    const first = await render('Ship the OKR now.');
    const second = await render('Draft the OKR later.');

    // Guards the factory-vs-transformer `seen`-scope bug: both documents wrap.
    expect(abbrCount(first)).toBe(1);
    expect(abbrCount(second)).toBe(1);
  });

  // In MDX, a hand-written raw tag (e.g. <aside class="…">) compiles to an
  // `mdxJsxFlowElement`, not a hast `element`. The walker must descend into it
  // (and honor skip tags via its `name`), or acronyms inside raw MDX blocks
  // silently go unwrapped. Run the transformer directly on a hand-built tree
  // since remark's rehype-raw can't produce MDX JSX nodes.
  it('descends into MDX JSX blocks (mdxJsxFlowElement)', () => {
    const tree: any = {
      type: 'root',
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: 'aside',
          attributes: [],
          children: [{ type: 'text', value: 'a WIP preview' }],
        },
      ],
    };
    rehypeAcronyms()(tree);
    const aside = tree.children[0];
    const abbr = aside.children.find((c: any) => c.type === 'element' && c.tagName === 'abbr');
    expect(abbr).toBeTruthy();
    expect(abbr.children[0].value).toBe('WIP');
  });

  it('skips acronyms inside a skippable MDX JSX tag (e.g. <a>)', () => {
    const tree: any = {
      type: 'root',
      children: [
        {
          type: 'mdxJsxTextElement',
          name: 'a',
          attributes: [],
          children: [{ type: 'text', value: 'see the CI' }],
        },
      ],
    };
    rehypeAcronyms()(tree);
    const link = tree.children[0];
    expect(link.children.every((c: any) => c.type !== 'element')).toBe(true);
  });
});
