import { stripHtml } from './markdown';

// Mock the remark/rehype ecosystem to avoid ESM issues in Jest
jest.mock('remark', () => ({
  remark: jest.fn(),
}));

jest.mock('remark-html', () => ({
  default: jest.fn(),
}));

jest.mock('remark-gfm', () => ({
  default: jest.fn(),
}));

jest.mock('remark-github', () => ({
  default: jest.fn(),
}));

jest.mock('rehype-slug', () => ({
  default: jest.fn(),
}));

jest.mock('rehype-autolink-headings', () => ({
  default: jest.fn(),
}));

describe('Markdown Processing', () => {
  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      expect(stripHtml(html)).toBe('Hello World');
    });

    it('should handle links', () => {
      const html = '<a href="https://example.com">Link</a>';
      expect(stripHtml(html)).toBe('Link');
    });

    it('should skip images', () => {
      const html = '<p>Text <img src="image.jpg" alt="Alt"> More</p>';
      const result = stripHtml(html);
      expect(result).not.toContain('Alt');
      expect(result).toContain('Text');
      expect(result).toContain('More');
    });

    it('should handle empty string', () => {
      expect(stripHtml('')).toBe('');
    });

    it('should handle plain text', () => {
      expect(stripHtml('Plain text')).toBe('Plain text');
    });

    it('should remove script tags', () => {
      const html = '<p>Text</p><script>alert("xss")</script>';
      const result = stripHtml(html);
      expect(result).toBe('Text');
      expect(result).not.toContain('script');
      expect(result).not.toContain('alert');
    });

    it('should handle nested HTML tags', () => {
      const html = '<div><p>Nested <span>content</span></p></div>';
      expect(stripHtml(html)).toBe('Nested content');
    });

    it('should preserve spacing between elements', () => {
      const html = '<p>First</p><p>Second</p>';
      const result = stripHtml(html);
      expect(result).toContain('First');
      expect(result).toContain('Second');
    });
  });
});

