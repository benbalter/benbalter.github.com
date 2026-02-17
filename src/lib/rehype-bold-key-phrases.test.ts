import { describe, it, expect } from 'vitest';
import { rehypeBoldKeyPhrases } from './rehype-bold-key-phrases';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';

describe('rehypeBoldKeyPhrases', () => {
  it('should bold key phrases when post slug matches', async () => {
    const html = '<p>Asynchronous work is great for knowledge workers.</p>';
    
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeBoldKeyPhrases)
      .use(rehypeStringify);

    // Mock the file path to match a popular post
    const file = { path: '/path/to/2022-03-17-why-async.mdx' } as any;
    const result = await processor.process({ value: html, path: file.path });
    
    expect(result.toString()).toContain('<strong>Asynchronous work</strong>');
    expect(result.toString()).toContain('<strong>knowledge workers</strong>');
  });

  it('should not bold phrases when post slug does not match', async () => {
    const html = '<p>Asynchronous work is great for knowledge workers.</p>';
    
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeBoldKeyPhrases)
      .use(rehypeStringify);

    // Mock a non-popular post file path
    const file = { path: '/path/to/2024-01-01-random-post.mdx' } as any;
    const result = await processor.process({ value: html, path: file.path });
    
    expect(result.toString()).not.toContain('<strong>');
    expect(result.toString()).toBe(html);
  });

  it('should not bold text in code blocks', async () => {
    const html = '<code>asynchronous work</code>';
    
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeBoldKeyPhrases)
      .use(rehypeStringify);

    const file = { path: '/path/to/2022-03-17-why-async.mdx' } as any;
    const result = await processor.process({ value: html, path: file.path });
    
    // Should not bold inside code tags
    expect(result.toString()).toBe(html);
  });

  it('should not bold text in headings', async () => {
    const html = '<h2>Working asynchronously</h2>';
    
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeBoldKeyPhrases)
      .use(rehypeStringify);

    const file = { path: '/path/to/2022-03-17-why-async.mdx' } as any;
    const result = await processor.process({ value: html, path: file.path });
    
    // Should not bold inside headings
    expect(result.toString()).toBe(html);
  });

  it('should preserve case of matched phrases', async () => {
    const html = '<p>Knowledge Workers are important.</p>';
    
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeBoldKeyPhrases)
      .use(rehypeStringify);

    const file = { path: '/path/to/2022-03-17-why-async.mdx' } as any;
    const result = await processor.process({ value: html, path: file.path });
    
    // Should preserve the original case
    expect(result.toString()).toContain('<strong>Knowledge Workers</strong>');
  });

  it('should handle multiple occurrences of key phrases', async () => {
    const html = '<p>Async work is great. Async work improves productivity.</p>';
    
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeBoldKeyPhrases)
      .use(rehypeStringify);

    const file = { path: '/path/to/2022-03-17-why-async.mdx' } as any;
    const result = await processor.process({ value: html, path: file.path });
    
    // Should bold both occurrences
    const matches = result.toString().match(/<strong>Async work<\/strong>/g);
    expect(matches).toHaveLength(2);
  });

  it('should extract post slug correctly from file path', async () => {
    const html = '<p>Show their work to leaders.</p>';
    
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeBoldKeyPhrases)
      .use(rehypeStringify);

    // Test various path formats
    const file1 = { path: '/absolute/path/to/2022-02-16-leaders-show-their-work.md' } as any;
    const result1 = await processor.process({ value: html, path: file1.path });
    expect(result1.toString()).toContain('<strong>Show their work</strong>');

    const file2 = { path: 'src/content/posts/2022-02-16-leaders-show-their-work.mdx' } as any;
    const result2 = await processor.process({ value: html, path: file2.path });
    expect(result2.toString()).toContain('<strong>Show their work</strong>');
  });

  it('should handle malformed file paths gracefully', async () => {
    const html = '<p>Asynchronous work is great.</p>';
    
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeBoldKeyPhrases)
      .use(rehypeStringify);

    // Test edge cases where file path doesn't match expected pattern
    const testCases = [
      'no-date-in-filename.md',  // No date
      '2022-03-17-no-extension',  // No file extension
      'invalid-date-99-99-99-test.md',  // Invalid date format (still matches pattern)
      'src/content/pages/about.md',  // Non-post file
    ];

    for (const testPath of testCases) {
      const result = await processor.process({ value: html, path: testPath });
      // Should not bold any text since path doesn't match or post isn't popular
      expect(result.toString()).toBe(html);
    }
  });

  it('should handle post slugs with dots correctly', async () => {
    const html = '<p>Test content.</p>';
    
    const processor = unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeBoldKeyPhrases)
      .use(rehypeStringify);

    // Ensure slugs with dots in them (like version numbers) are handled correctly
    const file = { path: '/path/to/2024-01-01-version-1.2.3-release.md' } as any;
    const result = await processor.process({ value: html, path: file.path });
    
    // This post won't have key phrases, but the slug should be extracted correctly
    // (not throwing an error or matching incorrectly)
    expect(result.toString()).toBe(html);
  });
});

