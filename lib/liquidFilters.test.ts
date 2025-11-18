import { markdownify, stripHtml, absoluteUrl, truncate, markdownifyAndStrip } from './liquidFilters';

// Mock the config module
jest.mock('./config', () => ({
  getSiteConfig: () => ({
    url: 'https://ben.balter.com',
    repository: 'benbalter/benbalter.github.com',
  }),
}));

// Mock the markdown module
jest.mock('./markdown', () => ({
  markdownToHtml: jest.fn((markdown: string) => {
    // Simple mock that converts **bold** to <strong>bold</strong>
    return Promise.resolve(
      markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
    );
  }),
  stripHtml: jest.fn((html: string) => {
    // Simple mock that removes HTML tags
    return html.replace(/<[^>]*>/g, '');
  }),
}));

describe('liquidFilters', () => {
  describe('markdownify', () => {
    it('should convert markdown to HTML', async () => {
      const result = await markdownify('**bold text**');
      expect(result).toBe('<strong>bold text</strong>');
    });

    it('should handle plain text', async () => {
      const result = await markdownify('plain text');
      expect(result).toBe('plain text');
    });

    it('should handle empty string', async () => {
      const result = await markdownify('');
      expect(result).toBe('');
    });

    it('should handle italic text', async () => {
      const result = await markdownify('*italic text*');
      expect(result).toBe('<em>italic text</em>');
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
    });

    it('should handle plain text', () => {
      expect(stripHtml('Plain text')).toBe('Plain text');
    });

    it('should handle empty string', () => {
      expect(stripHtml('')).toBe('');
    });

    it('should remove nested tags', () => {
      expect(stripHtml('<div><p>Nested <span>content</span></p></div>')).toBe('Nested content');
    });
  });

  describe('absoluteUrl', () => {
    it('should convert relative URL to absolute', () => {
      expect(absoluteUrl('/path/to/page')).toBe('https://ben.balter.com/path/to/page');
    });

    it('should handle URL without leading slash', () => {
      expect(absoluteUrl('path/to/page')).toBe('https://ben.balter.com/path/to/page');
    });

    it('should return absolute URLs as-is (http)', () => {
      expect(absoluteUrl('http://example.com/page')).toBe('http://example.com/page');
    });

    it('should return absolute URLs as-is (https)', () => {
      expect(absoluteUrl('https://example.com/page')).toBe('https://example.com/page');
    });

    it('should handle root path', () => {
      expect(absoluteUrl('/')).toBe('https://ben.balter.com/');
    });

    it('should handle URL with query params', () => {
      expect(absoluteUrl('/page?param=value')).toBe('https://ben.balter.com/page?param=value');
    });

    it('should handle URL with hash', () => {
      expect(absoluteUrl('/page#section')).toBe('https://ben.balter.com/page#section');
    });
  });

  describe('truncate', () => {
    it('should truncate text longer than limit', () => {
      const text = 'This is a very long text that needs to be truncated';
      expect(truncate(text, 20)).toBe('This is a very long...');
    });

    it('should not truncate text shorter than limit', () => {
      const text = 'Short text';
      expect(truncate(text, 50)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exactly fifty characters long text for testing it';
      expect(truncate(text, 50)).toBe('Exactly fifty characters long text for testing it');
    });

    it('should use custom ellipsis', () => {
      const text = 'This is a very long text that needs to be truncated';
      expect(truncate(text, 20, '…')).toBe('This is a very long…');
    });

    it('should respect word boundaries', () => {
      const text = 'One two three four five six seven eight nine ten';
      const result = truncate(text, 20);
      // Should break at a space, not mid-word
      expect(result).not.toContain('thre...');
      expect(result).toMatch(/^One two three/);
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });

    it('should handle text with no spaces', () => {
      const text = 'Verylongtextwithoutanyspacesorbreaks';
      const result = truncate(text, 10);
      expect(result.length).toBeLessThanOrEqual(13); // 10 + '...'
    });

    it('should use default length of 50', () => {
      const text = 'This text is exactly forty-nine characters long!';
      expect(truncate(text)).toBe('This text is exactly forty-nine characters long!');
    });

    it('should use default ellipsis', () => {
      const text = 'This is a very long text that definitely needs to be truncated for sure';
      const result = truncate(text, 30);
      expect(result).toContain('...');
    });

    it('should trim whitespace before adding ellipsis', () => {
      const text = 'This is text with trailing spaces at cut point';
      const result = truncate(text, 25);
      expect(result).not.toMatch(/\s+\.\.\./);
      expect(result).toMatch(/\w\.\.\./);
    });
  });

  describe('markdownifyAndStrip', () => {
    it('should convert markdown to HTML and strip tags', async () => {
      const result = await markdownifyAndStrip('**bold** text');
      expect(result).toBe('bold text');
    });

    it('should handle plain text', async () => {
      const result = await markdownifyAndStrip('plain text');
      expect(result).toBe('plain text');
    });

    it('should handle empty string', async () => {
      const result = await markdownifyAndStrip('');
      expect(result).toBe('');
    });

    it('should handle complex markdown with multiple tags', async () => {
      const result = await markdownifyAndStrip('**bold** and *italic* text');
      expect(result).toBe('bold and italic text');
    });
  });

  describe('edge cases', () => {
    it('truncate should handle null/undefined gracefully', () => {
      expect(truncate(null as any, 10)).toBe(null);
      expect(truncate(undefined as any, 10)).toBe(undefined);
    });

    it('absoluteUrl should handle complex paths', () => {
      const url = '/2021/02/01/what-to-read-before-starting/';
      expect(absoluteUrl(url)).toBe('https://ben.balter.com/2021/02/01/what-to-read-before-starting/');
    });

    it('should handle markdown with links', async () => {
      const markdown = '[Link text](https://example.com)';
      const html = await markdownify(markdown);
      expect(html).toContain('Link text');
    });
  });
});
