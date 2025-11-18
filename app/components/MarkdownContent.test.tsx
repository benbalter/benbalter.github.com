import { render } from '@testing-library/react';
import MarkdownContent from './MarkdownContent';
import { markdownToHtml } from '@/lib/markdown';

// Mock the markdown processing library
jest.mock('@/lib/markdown', () => ({
  markdownToHtml: jest.fn(),
}));

describe('MarkdownContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render markdown content as HTML', async () => {
    const mockHtml = '<p>Hello <strong>World</strong></p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const { container } = render(await MarkdownContent({ markdown: '# Test' }));
    
    expect(markdownToHtml).toHaveBeenCalledWith('# Test');
    expect(container.innerHTML).toContain(mockHtml);
  });

  it('should apply custom className', async () => {
    const mockHtml = '<p>Content</p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const { container } = render(
      await MarkdownContent({ markdown: 'Test', className: 'custom-class' })
    );
    
    const div = container.querySelector('div');
    expect(div).toHaveClass('custom-class');
  });

  it('should use default empty className when not provided', async () => {
    const mockHtml = '<p>Content</p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const { container } = render(await MarkdownContent({ markdown: 'Test' }));
    
    const div = container.querySelector('div');
    expect(div).toHaveAttribute('class', '');
  });

  it('should handle complex markdown with headings', async () => {
    const mockHtml = '<h1>Heading</h1><p>Paragraph text</p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = '# Heading\n\nParagraph text';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('<h1>Heading</h1>');
    expect(container.innerHTML).toContain('<p>Paragraph text</p>');
  });

  it('should handle markdown with code blocks', async () => {
    const mockHtml = '<pre><code>const x = 10;</code></pre>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = '```javascript\nconst x = 10;\n```';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('<code>const x = 10;</code>');
  });

  it('should handle markdown with links', async () => {
    const mockHtml = '<p><a href="https://example.com">Link</a></p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = '[Link](https://example.com)';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('href="https://example.com"');
  });

  it('should handle markdown with lists', async () => {
    const mockHtml = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = '- Item 1\n- Item 2';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('<li>Item 1</li>');
    expect(container.innerHTML).toContain('<li>Item 2</li>');
  });

  it('should handle markdown with emoji', async () => {
    const mockHtml = '<p>Hello 👋 World 🌍</p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = 'Hello :wave: World :earth_americas:';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('👋');
    expect(container.innerHTML).toContain('🌍');
  });

  it('should handle markdown with GitHub mentions', async () => {
    const mockHtml = '<p>Thanks <a href="https://github.com/benbalter">@benbalter</a></p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = 'Thanks @benbalter';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('@benbalter');
  });

  it('should handle markdown with heading anchors', async () => {
    const mockHtml = '<h2 id="heading">Heading<a class="anchor-link" href="#heading"><span class="anchor-icon"> #</span></a></h2>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = '## Heading';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('id="heading"');
    expect(container.innerHTML).toContain('anchor-link');
  });

  it('should handle empty markdown string', async () => {
    const mockHtml = '';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const { container } = render(await MarkdownContent({ markdown: '' }));
    
    expect(markdownToHtml).toHaveBeenCalledWith('');
    const div = container.querySelector('div');
    expect(div).toBeInTheDocument();
    expect(div?.innerHTML).toBe('');
  });

  it('should use dangerouslySetInnerHTML for HTML rendering', async () => {
    const mockHtml = '<p>Test content</p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const { container } = render(await MarkdownContent({ markdown: 'Test' }));
    
    const div = container.querySelector('div');
    expect(div?.innerHTML).toBe(mockHtml);
  });

  it('should process markdown asynchronously', async () => {
    const mockHtml = '<p>Async content</p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const component = MarkdownContent({ markdown: '# Test' });
    expect(component).toBeInstanceOf(Promise);
    
    const { container } = render(await component);
    expect(container.innerHTML).toContain('Async content');
  });

  it('should handle markdown with blockquotes', async () => {
    const mockHtml = '<blockquote><p>Quoted text</p></blockquote>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = '> Quoted text';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('<blockquote>');
  });

  it('should handle markdown with images', async () => {
    const mockHtml = '<p><img src="/image.jpg" alt="Alt text"></p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = '![Alt text](/image.jpg)';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('src="/image.jpg"');
  });

  it('should handle markdown with tables', async () => {
    const mockHtml = '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    const markdown = '| Header |\n|--------|\n| Cell |';
    const { container } = render(await MarkdownContent({ markdown }));
    
    expect(markdownToHtml).toHaveBeenCalledWith(markdown);
    expect(container.innerHTML).toContain('<table>');
  });

  it('should call markdownToHtml only once per render', async () => {
    const mockHtml = '<p>Content</p>';
    (markdownToHtml as jest.Mock).mockResolvedValue(mockHtml);
    
    render(await MarkdownContent({ markdown: 'Test' }));
    
    expect(markdownToHtml).toHaveBeenCalledTimes(1);
  });
});
