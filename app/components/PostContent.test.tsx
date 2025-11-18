import { render } from '@testing-library/react';
import PostContent from './PostContent';

// Mock MarkdownContent component
jest.mock('./MarkdownContent', () => {
  return function MarkdownContent({ markdown, className }: { markdown: string; className?: string }) {
    return <div className={className} data-testid="markdown-content">{markdown}</div>;
  };
});

describe('PostContent', () => {
  it('should render with content', () => {
    const { getByTestId } = render(<PostContent content="Test post content" />);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent).toHaveTextContent('Test post content');
  });

  it('should pass content to MarkdownContent as markdown prop', () => {
    const { getByTestId } = render(<PostContent content="My blog post" />);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent).toHaveTextContent('My blog post');
  });

  it('should apply entrybody className', () => {
    const { getByTestId } = render(<PostContent content="Content" />);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent).toHaveClass('entrybody');
  });

  it('should render with empty content', () => {
    const { getByTestId } = render(<PostContent content="" />);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent).toBeInTheDocument();
  });

  it('should handle long content', () => {
    const longContent = 'Lorem ipsum '.repeat(100);
    const { getByTestId } = render(<PostContent content={longContent} />);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent.textContent).toContain('Lorem ipsum');
  });
});
