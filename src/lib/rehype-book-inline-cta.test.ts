import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { VFile } from 'vfile';
import { rehypeBookInlineCta } from './rehype-book-inline-cta';

const processor = unified().use(remarkParse).use(remarkRehype).use(rehypeBookInlineCta).use(rehypeStringify);

async function render(md: string, frontmatter?: Record<string, unknown>) {
  const file = new VFile({ value: md });
  if (frontmatter) file.data.astro = { frontmatter };
  return String(await processor.process(file));
}

const paragraphs = (n: number) => Array.from({ length: n }, (_, i) => `Paragraph ${i + 1}.`).join('\n\n');

describe('rehypeBookInlineCta', () => {
  it('inserts a tagged callout about a third of the way into an adapted post', async () => {
    const html = await render(paragraphs(9), { bookRelation: 'adapted' });
    expect(html).toContain('utm_source=benbalter-inline');
    expect(html).toContain('data-track-book-cta');
    expect(html.indexOf('book-inline-cta')).toBeGreaterThan(html.indexOf('Paragraph 4.'));
    expect(html.indexOf('book-inline-cta')).toBeLessThan(html.indexOf('Paragraph 5.'));
  });

  it('prefers the boundary before the second heading', async () => {
    const md = `Intro.\n\n## One\n\nA.\n\nB.\n\n## Two\n\nC.\n\nD.\n\n## Three\n\nE.\n\nF.\n\nG.\n\nH.`;
    const html = await render(md, { bookRelation: 'inspired' });
    expect(html).toContain('inspired a chapter');
    expect(html.indexOf('book-inline-cta')).toBeLessThan(html.indexOf('<h2>Two</h2>'));
    expect(html.indexOf('book-inline-cta')).toBeGreaterThan(html.indexOf('B.'));
  });

  it('skips cut posts, hidden CTAs, short posts, and files without frontmatter', async () => {
    expect(await render(paragraphs(9), { bookRelation: 'cut' })).not.toContain('book-inline-cta');
    expect(await render(paragraphs(9), { bookRelation: 'adapted', hideBookCta: true })).not.toContain('book-inline-cta');
    expect(await render(paragraphs(3), { bookRelation: 'adapted' })).not.toContain('book-inline-cta');
    expect(await render(paragraphs(9))).not.toContain('book-inline-cta');
  });
});
