import { render } from '@testing-library/react';
import PostContent from './PostContent';

// Mock the MarkdownContent component
jest.mock('./MarkdownContent', () => ({
  __esModule: true,
  default: ({ markdown, className }: { markdown: string; className: string }) => (
    <div className={className} data-testid="markdown-content">{markdown}</div>
  ),
}));

describe('PostContent', () => {
  it('should render markdown content', () => {
    const { getByTestId } = render(<PostContent content="# Test Content" />);
    
    const content = getByTestId('markdown-content');
    expect(content).toBeInTheDocument();
  });

  it('should pass content to MarkdownContent', () => {
    const testContent = '# Heading\n\nThis is a test post content.';
    const { getByTestId } = render(<PostContent content={testContent} />);
    
    const content = getByTestId('markdown-content');
    // The mock strips out newlines, so we test for the content without them
    expect(content).toHaveTextContent('# Heading This is a test post content.');
  });

  it('should apply entrybody class', () => {
    const { getByTestId } = render(<PostContent content="Test" />);
    
    const content = getByTestId('markdown-content');
    expect(content).toHaveClass('entrybody');
  });
});
