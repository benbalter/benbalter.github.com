import { describe, it } from 'node:test';
import assert from 'node:assert';
import { markdownToHtml } from './markdown';

describe('Liquid Includes Processing', () => {
  it('should convert {% include_cached github-culture.html %} to callout HTML', async () => {
    const markdown = 'Some content\n\n{% include_cached github-culture.html %}';
    const html = await markdownToHtml(markdown);
    
    // Check that the Liquid syntax is gone
    assert.ok(!html.includes('{% include'), 'Should not contain Liquid syntax');
    
    // Check that the callout HTML is present
    assert.ok(html.includes('alert alert-primary'), 'Should contain alert classes');
    assert.ok(html.includes('Interested in learning more about how GitHub works'), 'Should contain callout text');
    assert.ok(html.includes('/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/'), 'Should contain link to related post');
  });

  it('should convert {% include github-culture.html %} to callout HTML', async () => {
    const markdown = '{% include github-culture.html %}';
    const html = await markdownToHtml(markdown);
    
    assert.ok(!html.includes('{% include'), 'Should not contain Liquid syntax');
    assert.ok(html.includes('alert alert-primary'), 'Should contain alert classes');
  });

  it('should handle markdown with no Liquid includes', async () => {
    const markdown = 'Just some normal markdown content';
    const html = await markdownToHtml(markdown);
    
    assert.ok(html.includes('normal markdown content'), 'Should contain the original content');
  });
});
