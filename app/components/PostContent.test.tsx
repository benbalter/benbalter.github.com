import { render } from '@testing-library/react';
import PostContent from './PostContent';

// Mock MarkdownContent component (also async)
jest.mock('./MarkdownContent', () => {
  return jest.fn(({ markdown, className }: { markdown: string; className?: string }) => {
    return <div className={className} data-testid="markdown-content">{markdown}</div>;
  });
});

describe('PostContent', () => {
  it('should render with content', async () => {
    const PostContentResolved = await PostContent({ content: 'Test post content' });
    const { getByTestId } = render(PostContentResolved);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent).toHaveTextContent('Test post content');
  });

  it('should pass content to MarkdownContent as markdown prop', async () => {
    const PostContentResolved = await PostContent({ content: 'My blog post' });
    const { getByTestId } = render(PostContentResolved);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent).toHaveTextContent('My blog post');
  });

  it('should apply entrybody className', async () => {
    const PostContentResolved = await PostContent({ content: 'Content' });
    const { getByTestId } = render(PostContentResolved);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent).toHaveClass('entrybody');
  });

  it('should render with empty content', async () => {
    const PostContentResolved = await PostContent({ content: '' });
    const { getByTestId } = render(PostContentResolved);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent).toBeInTheDocument();
  });

  it('should handle long content', async () => {
    const longContent = 'Lorem ipsum '.repeat(100);
    const PostContentResolved = await PostContent({ content: longContent });
    const { getByTestId } = render(PostContentResolved);
    
    const markdownContent = getByTestId('markdown-content');
    expect(markdownContent.textContent).toContain('Lorem ipsum');
  });
});
