import { render, screen } from '@testing-library/react';
import PostDescription from './PostDescription';

// Mock the config module
jest.mock('@/lib/config', () => ({
  getSiteConfig: () => ({
    repository: 'benbalter/benbalter.github.com',
  }),
}));

// Mock react-markdown and remark plugins to avoid ES module issues in Jest
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div data-testid="markdown-content">{children}</div>,
}));

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: () => {},
}));

jest.mock('remark-github', () => ({
  __esModule: true,
  default: () => {},
}));

describe('PostDescription', () => {
  it('should render TL;DR abbreviation with correct title', () => {
    const description = 'This is a test description.';
    const { container } = render(<PostDescription description={description} />);
    
    const abbr = container.querySelector('abbr');
    expect(abbr).toBeInTheDocument();
    expect(abbr).toHaveTextContent('TL;DR');
    expect(abbr).toHaveAttribute('title', '"Too Long; Didn\'t Read" — Internet shorthand for "a brief summary of longer writing"');
  });

  it('should have lead class on container div', () => {
    const description = 'Test description';
    const { container } = render(<PostDescription description={description} />);
    
    const leadDiv = container.querySelector('div.lead');
    expect(leadDiv).toBeInTheDocument();
  });

  it('should render description content', () => {
    const description = 'This is a simple description without markdown.';
    render(<PostDescription description={description} />);
    
    const markdownContent = screen.getByTestId('markdown-content');
    expect(markdownContent).toBeInTheDocument();
    expect(markdownContent).toHaveTextContent(description);
  });

  it('should have tooltip attributes on abbreviation', () => {
    const description = 'Test';
    const { container } = render(<PostDescription description={description} />);
    
    const abbr = container.querySelector('abbr');
    expect(abbr).toHaveAttribute('data-bs-toggle', 'tooltip');
    expect(abbr).toHaveAttribute('data-bs-placement', 'right');
    expect(abbr).toHaveClass('initialism');
  });

  it('should pass description to ReactMarkdown', () => {
    const description = 'Test description with **bold** text.';
    render(<PostDescription description={description} />);
    
    const markdownContent = screen.getByTestId('markdown-content');
    expect(markdownContent).toHaveTextContent(description);
  });

  it('should render with proper structure', () => {
    const description = 'Test';
    const { container } = render(<PostDescription description={description} />);
    
    // Check structure: lead > strong > abbr
    const leadDiv = container.querySelector('div.lead');
    const strong = leadDiv?.querySelector('strong');
    const abbr = strong?.querySelector('abbr');
    
    expect(leadDiv).toBeInTheDocument();
    expect(strong).toBeInTheDocument();
    expect(abbr).toBeInTheDocument();
  });
});

