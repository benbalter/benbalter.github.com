import { stripHtml, inlineMarkdownToHtml } from './markdown';

// Mock the config module
jest.mock('@/lib/config', () => ({
  getSiteConfig: () => ({
    repository: 'benbalter/benbalter.github.com',
  }),
}));

// Mock the emoji module
jest.mock('./emoji', () => ({
  processEmoji: (text: string) => text,
}));

// Create a mock for the unified/remark pipeline
const mockProcess = jest.fn();
const mockUse = jest.fn().mockReturnThis();

// Mock the remark/rehype ecosystem to avoid ESM issues in Jest
jest.mock('remark', () => ({
  remark: () => ({
    use: mockUse,
    process: mockProcess,
  }),
}));

jest.mock('remark-gfm', () => ({
  default: jest.fn(),
}));

jest.mock('remark-github', () => ({
  default: jest.fn(),
}));

jest.mock('remark-rehype', () => ({
  default: jest.fn(),
}));

jest.mock('rehype-raw', () => ({
  default: jest.fn(),
}));

jest.mock('rehype-sanitize', () => ({
  default: jest.fn(),
  defaultSchema: {},
}));

jest.mock('rehype-slug', () => ({
  default: jest.fn(),
}));

jest.mock('rehype-autolink-headings', () => ({
  default: jest.fn(),
}));

jest.mock('rehype-stringify', () => ({
  default: jest.fn(),
}));

jest.mock('./remark-kramdown-attrs', () => ({
  default: jest.fn(),
}));

describe('Markdown Processing', () => {
  beforeEach(() => {
    mockProcess.mockReset();
    mockUse.mockClear();
  });

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

  describe('inlineMarkdownToHtml', () => {
    it('should strip wrapping paragraph tags for single line content', async () => {
      mockProcess.mockResolvedValue({
        toString: () => '<p>Test content</p>\n',
      });
      
      const result = await inlineMarkdownToHtml('Test content');
      expect(result).toBe('Test content');
    });

    it('should preserve content when no paragraph wrapper exists', async () => {
      mockProcess.mockResolvedValue({
        toString: () => '<strong>Bold</strong>',
      });
      
      const result = await inlineMarkdownToHtml('**Bold**');
      expect(result).toBe('<strong>Bold</strong>');
    });

    it('should handle multi-paragraph content', async () => {
      mockProcess.mockResolvedValue({
        toString: () => '<p>First</p>\n<p>Second</p>\n',
      });
      
      const result = await inlineMarkdownToHtml('First\n\nSecond');
      // Multi-paragraph shouldn't have outer p tags stripped
      expect(result).toBe('<p>First</p>\n<p>Second</p>\n');
    });

    it('should handle empty string', async () => {
      mockProcess.mockResolvedValue({
        toString: () => '',
      });
      
      const result = await inlineMarkdownToHtml('');
      expect(result).toBe('');
    });
  });
});

