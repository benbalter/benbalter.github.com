/**
 * Tests for remark-directive-fallback plugin
 *
 * Verifies that stray text/leaf directives (ordinary prose colons that
 * remark-directive misparses) are reverted to literal text instead of
 * rendering as empty <div> elements, while real callout directives survive.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import { remarkCalloutDirectives } from './remark-callout-directives';
import { remarkDirectiveFallback } from './remark-directive-fallback';

describe('remarkDirectiveFallback', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkCalloutDirectives)
    .use(remarkDirectiveFallback)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true });

  it.each([
    ['one-on-ones', 'We hold regular 1:1 syncs.', '1:1'],
    ['one-on-ones plural', 'We hold regular 1:1s.', '1:1s'],
    ['times', 'Standup is at 9:00 AM.', '9:00'],
    ['ratios', 'Use a 16:9 aspect ratio.', '16:9'],
    ['ports', 'It listens on 0:80.', '0:80'],
  ])('reverts stray colon in %s to literal text', async (_label, markdown, expected) => {
    const html = String(await processor.process(markdown));
    expect(html).toContain(expected);
    expect(html).not.toContain('<div></div>');
  });

  it('does not emit empty divs for prose colons', async () => {
    const html = String(await processor.process('Meeting and 1:1 agendas created each week.'));
    expect(html).toBe('<p>Meeting and 1:1 agendas created each week.</p>');
  });

  it('preserves real callout directives', async () => {
    const markdown = ':::note\nThis is a note.\n:::';
    const html = String(await processor.process(markdown));
    expect(html).toContain('<aside');
    expect(html).toContain('callout-note');
    expect(html).toContain('This is a note.');
  });
});
