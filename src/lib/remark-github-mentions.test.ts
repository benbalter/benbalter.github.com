/**
 * Tests for remark-github-mentions plugin
 * 
 * Verifies that @mentions are converted to GitHub profile links
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkGitHubMentions } from './remark-github-mentions';

describe('remarkGitHubMentions', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGitHubMentions)
    .use(remarkRehype)
    .use(rehypeStringify);

  it('should convert @username to GitHub profile link', async () => {
    const markdown = 'Hello @benbalter how are you?';
    const result = await processor.process(markdown);
    const html = String(result);
    
    expect(html).toContain('href="https://github.com/benbalter"');
    expect(html).toContain('@benbalter');
  });

  it('should convert multiple @mentions in the same text', async () => {
    const markdown = 'Thanks to @benbalter and @defunkt for their work.';
    const result = await processor.process(markdown);
    const html = String(result);
    
    expect(html).toContain('href="https://github.com/benbalter"');
    expect(html).toContain('href="https://github.com/defunkt"');
  });

  it('should handle @mentions at the start of a line', async () => {
    const markdown = '@benbalter is the author.';
    const result = await processor.process(markdown);
    const html = String(result);
    
    expect(html).toContain('href="https://github.com/benbalter"');
  });

  it('should handle @mentions at the end of a sentence', async () => {
    const markdown = 'This was written by @benbalter.';
    const result = await processor.process(markdown);
    const html = String(result);
    
    expect(html).toContain('href="https://github.com/benbalter"');
  });

  it('should handle @mentions with underscores', async () => {
    const markdown = 'Thanks @some_user for the contribution.';
    const result = await processor.process(markdown);
    const html = String(result);
    
    expect(html).toContain('href="https://github.com/some_user"');
  });

  it('should handle @mentions with hyphens', async () => {
    const markdown = 'Thanks @some-user for the contribution.';
    const result = await processor.process(markdown);
    const html = String(result);
    
    expect(html).toContain('href="https://github.com/some-user"');
  });

  it('should not convert email addresses', async () => {
    const markdown = 'Contact me at user@example.com';
    const result = await processor.process(markdown);
    const html = String(result);
    
    // Email should not be converted to a GitHub link
    expect(html).not.toContain('href="https://github.com/example.com"');
    expect(html).toContain('user@example.com');
  });

  it('should handle @mentions in code blocks correctly', async () => {
    const markdown = '`@benbalter` should not be linked inside code.';
    const result = await processor.process(markdown);
    const html = String(result);
    
    // Check that @benbalter appears in code tag
    expect(html).toContain('<code>@benbalter</code>');
  });

  it('should handle @mentions in markdown lists', async () => {
    const markdown = `
- @benbalter contributed
- @defunkt reviewed
- @parkr merged
`;
    const result = await processor.process(markdown);
    const html = String(result);
    
    expect(html).toContain('href="https://github.com/benbalter"');
    expect(html).toContain('href="https://github.com/defunkt"');
    expect(html).toContain('href="https://github.com/parkr"');
  });

  it('should handle @mentions in blockquotes', async () => {
    const markdown = '> @benbalter said something important';
    const result = await processor.process(markdown);
    const html = String(result);
    
    expect(html).toContain('href="https://github.com/benbalter"');
    expect(html).toContain('<blockquote>');
  });
});
