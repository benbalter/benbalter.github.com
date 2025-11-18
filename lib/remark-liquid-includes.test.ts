import { describe, it } from 'node:test';
import assert from 'node:assert';
import { remark } from 'remark';
import remarkLiquidIncludes from './remark-liquid-includes';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

describe('Remark Liquid Includes Plugin', () => {
  async function processMarkdown(markdown: string): Promise<string> {
    const result = await remark()
      .use(remarkLiquidIncludes)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(markdown);
    
    return result.toString();
  }

  it('should convert github-culture include to HTML', async () => {
    const markdown = 'Some content\n\n{% include_cached github-culture.html %}\n\nMore content';
    const result = await processMarkdown(markdown);
    
    assert.ok(result.includes('<div class="alert alert-primary text-center"'));
    assert.ok(result.includes('Interested in learning more about how GitHub works'));
    assert.ok(result.includes('/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/'));
  });

  it('should handle include with various whitespace', async () => {
    const markdown = '{%  include_cached   github-culture.html  %}';
    const result = await processMarkdown(markdown);
    
    assert.ok(result.includes('<div class="alert alert-primary text-center"'));
  });

  it('should not affect markdown without includes', async () => {
    const markdown = 'Just regular markdown content';
    const result = await processMarkdown(markdown);
    
    assert.ok(!result.includes('alert'));
    assert.ok(result.includes('Just regular markdown content'));
  });
});
