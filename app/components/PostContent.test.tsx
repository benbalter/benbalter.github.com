import { render } from '@testing-library/react';
import PostContent from './PostContent';

// Mock MarkdownContent component since PostContent now uses it
jest.mock('./MarkdownContent', () => ({
  __esModule: true,
  default: ({ markdown, className }: { markdown: string; className?: string }) => (
    <div className={className} data-testid="markdown-content">{markdown}</div>
  ),
}));

describe('PostContent', () => {
  it('should render markdown content', () => {
    const content = '# Test Heading\n\nTest content';
    const { container } = render(<PostContent content={content} />);
    
    expect(container.textContent).toContain('# Test Heading');
    expect(container.textContent).toContain('Test content');
  });

  it('should apply entrybody class', () => {
    const content = '# Content';
    const { container } = render(<PostContent content={content} />);
    
    const div = container.querySelector('[data-testid="markdown-content"]');
    expect(div).toHaveClass('entrybody');
  });

  it('should pass content to MarkdownContent', () => {
    const content = 'Test markdown content';
    const { container } = render(<PostContent content={content} />);
    
    expect(container.textContent).toContain(content);
  });

  it('should handle empty content', () => {
    const { container } = render(<PostContent content="" />);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle markdown with special characters', () => {
    const content = '# Heading with **bold** and *italic*';
    const { container } = render(<PostContent content={content} />);
    
    expect(container.textContent).toContain(content);
  });

  it('should handle markdown with code blocks', () => {
    const content = '```javascript\nconst x = 1;\n```';
    const { container } = render(<PostContent content={content} />);
    
    expect(container.textContent).toContain('const x = 1;');
  });
});
