import { render } from '@testing-library/react';

// Mock ESM modules before importing component
jest.mock('remark', () => ({
  remark: jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
    process: jest.fn().mockResolvedValue({ toString: () => '<p>Mocked content</p>' }),
  })),
}));

jest.mock('remark-gfm', () => jest.fn());
jest.mock('remark-github', () => jest.fn());
jest.mock('remark-rehype', () => jest.fn());
jest.mock('rehype-slug', () => jest.fn());
jest.mock('rehype-autolink-headings', () => jest.fn());
jest.mock('rehype-raw', () => jest.fn());
jest.mock('rehype-sanitize', () => {
  const mock = jest.fn();
  (mock as unknown as { defaultSchema: object }).defaultSchema = { attributes: {} };
  return mock;
});
jest.mock('rehype-stringify', () => jest.fn());

// Mock config
jest.mock('@/lib/config', () => ({
  getSiteConfig: jest.fn(() => ({
    github: { repository_nwo: 'benbalter/benbalter.github.com' },
  })),
}));

// Mock emoji processing
jest.mock('@/lib/emoji', () => ({
  processEmoji: jest.fn((text: string) => text),
}));

// Mock kramdown attrs plugin
jest.mock('@/lib/remark-kramdown-attrs', () => jest.fn());

// Import after mocks
import MarkdownContent from './MarkdownContent';
import { remark } from 'remark';

describe('MarkdownContent', () => {
  const mockRemark = remark as jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock chain
    mockRemark.mockReturnValue({
      use: jest.fn().mockReturnThis(),
      process: jest.fn().mockResolvedValue({ toString: () => '<p>Mocked content</p>' }),
    });
  });

  it('should render markdown content', async () => {
    const mockProcess = jest.fn().mockResolvedValue({ toString: () => '<p>Test content</p>' });
    mockRemark.mockReturnValue({
      use: jest.fn().mockReturnThis(),
      process: mockProcess,
    });
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: 'Test content',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.querySelector('p')).toHaveTextContent('Test content');
  });

  it('should apply custom className', async () => {
    const mockProcess = jest.fn().mockResolvedValue({ toString: () => '<p>Content</p>' });
    mockRemark.mockReturnValue({
      use: jest.fn().mockReturnThis(),
      process: mockProcess,
    });
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: 'Content',
      className: 'custom-class',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should render without className', async () => {
    const mockProcess = jest.fn().mockResolvedValue({ toString: () => '<p>Content</p>' });
    mockRemark.mockReturnValue({
      use: jest.fn().mockReturnThis(),
      process: mockProcess,
    });
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: 'Content',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should call remark pipeline', async () => {
    const mockUse = jest.fn().mockReturnThis();
    const mockProcess = jest.fn().mockResolvedValue({ toString: () => '<p>Rendered HTML</p>' });
    mockRemark.mockReturnValue({
      use: mockUse,
      process: mockProcess,
    });
    
    await MarkdownContent({ 
      markdown: 'Test markdown',
    });
    
    expect(mockRemark).toHaveBeenCalled();
    expect(mockProcess).toHaveBeenCalled();
  });

  it('should render HTML from remark pipeline', async () => {
    const complexHtml = '<h1>Title</h1><p>Paragraph</p><ul><li>Item</li></ul>';
    const mockProcess = jest.fn().mockResolvedValue({ toString: () => complexHtml });
    mockRemark.mockReturnValue({
      use: jest.fn().mockReturnThis(),
      process: mockProcess,
    });
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: '# Title\n\nParagraph\n\n- Item',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.querySelector('h1')).toHaveTextContent('Title');
    expect(container.querySelector('p')).toHaveTextContent('Paragraph');
    expect(container.querySelector('li')).toHaveTextContent('Item');
  });

  it('should handle empty markdown', async () => {
    const mockProcess = jest.fn().mockResolvedValue({ toString: () => '' });
    mockRemark.mockReturnValue({
      use: jest.fn().mockReturnThis(),
      process: mockProcess,
    });
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: '',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should use dangerouslySetInnerHTML for HTML content', async () => {
    const mockProcess = jest.fn().mockResolvedValue({ toString: () => '<strong>Bold text</strong>' });
    mockRemark.mockReturnValue({
      use: jest.fn().mockReturnThis(),
      process: mockProcess,
    });
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: '**Bold text**',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.querySelector('strong')).toHaveTextContent('Bold text');
  });
});
