/**
 * Tests for remark-callout-directives plugin
 *
 * Verifies that :::note, :::warning, etc. directives are transformed
 * into styled callout HTML elements.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { remarkCalloutDirectives } from './remark-callout-directives';

describe('remarkCalloutDirectives', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkCalloutDirectives)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify);

  it('should transform :::note into a styled callout', async () => {
    const markdown = ':::note\nThis is a note.\n:::';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('class="callout callout-note"');
    expect(html).toContain('role="note"');
    expect(html).toContain('This is a note.');
  });

  it('should transform :::warning into a warning callout', async () => {
    const markdown = ':::warning\nBe careful!\n:::';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('class="callout callout-warning"');
    expect(html).toContain('⚠️');
    expect(html).toContain('Be careful!');
  });

  it('should transform :::error into an error callout', async () => {
    const markdown = ':::error\nSomething went wrong.\n:::';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('class="callout callout-error"');
    expect(html).toContain('❌');
  });

  it('should transform :::success into a success callout', async () => {
    const markdown = ':::success\nAll good!\n:::';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('class="callout callout-success"');
    expect(html).toContain('✅');
  });

  it('should transform :::tip into a tip callout', async () => {
    const markdown = ':::tip\nHelpful tip here.\n:::';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('class="callout callout-tip"');
    expect(html).toContain('💡');
  });

  it('should add a default title with the type name', async () => {
    const markdown = ':::note\nContent here.\n:::';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('<strong>Note</strong>');
  });

  it('should support custom titles via directive label', async () => {
    const markdown = ':::warning[Custom Warning Title]\nContent here.\n:::';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('<strong>Custom Warning Title</strong>');
  });

  it('should not transform unknown directive types', async () => {
    const markdown = ':::custom\nThis should not be a callout.\n:::';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).not.toContain('class="callout');
  });

  it('should include aria-label for accessibility', async () => {
    const markdown = ':::note\nAccessible note.\n:::';
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('aria-label="note callout"');
  });
});
