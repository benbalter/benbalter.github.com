import { render } from '@testing-library/react';
import MarkdownContent from './MarkdownContent';

// Mock the config module
jest.mock('@/lib/config', () => ({
  getSiteConfig: jest.fn(() => ({
    repository: 'user/repo',
  })),
}));

// Mock emoji module
jest.mock('@/lib/emoji', () => ({
  processEmoji: jest.fn((text: string) => text),
}));

// Mock react-markdown and plugins
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: any) => <div className="markdown-mock">{children}</div>,
}));

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('remark-github', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('rehype-raw', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('rehype-sanitize', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('rehype-slug', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('rehype-autolink-headings', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('MarkdownContent', () => {
  it('should render markdown content', () => {
    const markdown = '# Test Heading\n\nTest content';
    const { container } = render(<MarkdownContent markdown={markdown} />);
    
    expect(container.textContent).toContain('# Test Heading');
    expect(container.textContent).toContain('Test content');
  });

  it('should apply default className when not provided', () => {
    const { container } = render(<MarkdownContent markdown="Test" />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<MarkdownContent markdown="Test" className="custom-class" />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should handle empty markdown', () => {
    const { container } = render(<MarkdownContent markdown="" />);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle markdown with GFM features', () => {
    const markdown = '- [ ] Task\n- [x] Completed task';
    const { container } = render(<MarkdownContent markdown={markdown} />);
    
    expect(container.textContent).toContain('Task');
  });

  it('should handle markdown with mentions', () => {
    const markdown = 'Hello @username';
    const { container } = render(<MarkdownContent markdown={markdown} />);
    
    expect(container.textContent).toContain('@username');
  });

  it('should handle markdown with code blocks', () => {
    const markdown = '```javascript\nconst x = 1;\n```';
    const { container } = render(<MarkdownContent markdown={markdown} />);
    
    expect(container.textContent).toContain('const x = 1;');
  });

  it('should handle markdown with links', () => {
    const markdown = '[Link text](https://example.com)';
    const { container } = render(<MarkdownContent markdown={markdown} />);
    
    expect(container.textContent).toContain('Link text');
  });
});
