/**
 * Tests for rehype-relative-urls plugin
 * 
 * Verifies that absolute internal URLs are converted to relative URLs
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypeRelativeUrls } from './rehype-relative-urls';

describe('rehypeRelativeUrls', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeRelativeUrls)
    .use(rehypeStringify);

  describe('anchor tags', () => {
    it('should convert absolute internal URL to relative', async () => {
      const markdown = '[About](/about/)';
      // Create a version with absolute URL
      const markdownAbsolute = '[About](https://ben.balter.com/about/)';
      const result = await processor.process(markdownAbsolute);
      const html = String(result);
      
      expect(html).toContain('href="/about/"');
      expect(html).not.toContain('https://ben.balter.com');
    });

    it('should convert blog post URLs to relative', async () => {
      const markdown = '[Post](https://ben.balter.com/2021/01/15/my-post/)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('href="/2021/01/15/my-post/"');
      expect(html).not.toContain('https://ben.balter.com');
    });

    it('should leave external URLs unchanged', async () => {
      const markdown = '[GitHub](https://github.com)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('href="https://github.com"');
    });

    it('should leave relative URLs unchanged', async () => {
      const markdown = '[About](/about/)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('href="/about/"');
    });

    it('should handle multiple absolute internal URLs', async () => {
      const markdown = `
[About](https://ben.balter.com/about/)
[Contact](https://ben.balter.com/contact/)
[External](https://github.com)
`;
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('href="/about/"');
      expect(html).toContain('href="/contact/"');
      expect(html).toContain('href="https://github.com"');
    });

    it('should handle URLs with query parameters', async () => {
      const markdown = '[Search](https://ben.balter.com/search/?q=test)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('href="/search/?q=test"');
    });

    it('should handle URLs with anchors', async () => {
      const markdown = '[Section](https://ben.balter.com/about/#team)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('href="/about/#team"');
    });
  });

  describe('img tags', () => {
    it('should convert absolute internal image URLs to relative', async () => {
      const markdown = '![Alt text](https://ben.balter.com/assets/img/photo.jpg)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('src="/assets/img/photo.jpg"');
      expect(html).not.toContain('https://ben.balter.com');
    });

    it('should leave external image URLs unchanged', async () => {
      const markdown = '![Alt text](https://example.com/image.jpg)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('src="https://example.com/image.jpg"');
    });

    it('should leave relative image URLs unchanged', async () => {
      const markdown = '![Alt text](/assets/img/photo.jpg)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('src="/assets/img/photo.jpg"');
    });

    it('should handle images from wp-content', async () => {
      const markdown = '![WP Image](https://ben.balter.com/wp-content/uploads/2010/09/image.png)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('src="/wp-content/uploads/2010/09/image.png"');
      expect(html).not.toContain('https://ben.balter.com');
    });
  });

  describe('mixed content', () => {
    it('should handle both links and images', async () => {
      const markdown = `
[Visit my about page](https://ben.balter.com/about/)

![Profile](https://ben.balter.com/assets/img/headshot.jpg)

[External link](https://github.com/benbalter)
`;
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('href="/about/"');
      expect(html).toContain('src="/assets/img/headshot.jpg"');
      expect(html).toContain('href="https://github.com/benbalter"');
    });
  });

  describe('edge cases', () => {
    it('should handle URL with trailing slash missing', async () => {
      const markdown = '[About](https://ben.balter.com/about)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('href="/about"');
    });

    it('should handle root URL', async () => {
      const markdown = '[Home](https://ben.balter.com)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      // Should convert to / (empty string after removing siteConfig.url becomes /)
      expect(html).toMatch(/href="\/?"/);
    });

    it('should handle root URL with trailing slash', async () => {
      const markdown = '[Home](https://ben.balter.com/)';
      const result = await processor.process(markdown);
      const html = String(result);
      
      expect(html).toContain('href="/"');
    });
  });
});
