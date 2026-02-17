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
});
