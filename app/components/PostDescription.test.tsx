import { render, screen } from '@testing-library/react';
import PostDescription from './PostDescription';

// Mock the markdown module
jest.mock('@/lib/markdown', () => ({
  inlineMarkdownToHtml: jest.fn().mockImplementation(async (text: string) => text),
}));

describe('PostDescription', () => {
  it('should render TL;DR abbreviation with correct title', async () => {
    const description = 'This is a test description.';
    const PostDescriptionComponent = await PostDescription({ description });
    const { container } = render(PostDescriptionComponent);
    
    const abbr = container.querySelector('abbr');
    expect(abbr).toBeInTheDocument();
    expect(abbr).toHaveTextContent('TL;DR');
    expect(abbr).toHaveAttribute('title', '"Too Long; Didn\'t Read" — Internet shorthand for "a brief summary of longer writing"');
  });

  it('should have lead class on container div', async () => {
    const description = 'Test description';
    const PostDescriptionComponent = await PostDescription({ description });
    const { container } = render(PostDescriptionComponent);
    
    const leadDiv = container.querySelector('div.lead');
    expect(leadDiv).toBeInTheDocument();
  });

  it('should render description content', async () => {
    const description = 'This is a simple description without markdown.';
    const PostDescriptionComponent = await PostDescription({ description });
    const { container } = render(PostDescriptionComponent);
    
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent(description);
  });

  it('should have tooltip attributes on abbreviation', async () => {
    const description = 'Test';
    const PostDescriptionComponent = await PostDescription({ description });
    const { container } = render(PostDescriptionComponent);
    
    const abbr = container.querySelector('abbr');
    expect(abbr).toHaveAttribute('data-bs-toggle', 'tooltip');
    expect(abbr).toHaveAttribute('data-bs-placement', 'right');
    expect(abbr).toHaveClass('initialism');
  });

  it('should render description with HTML from markdown processing', async () => {
    const description = 'Test description with **bold** text.';
    const PostDescriptionComponent = await PostDescription({ description });
    const { container } = render(PostDescriptionComponent);
    
    const span = container.querySelector('span');
    expect(span).toHaveTextContent(description);
  });

  it('should render with proper structure', async () => {
    const description = 'Test';
    const PostDescriptionComponent = await PostDescription({ description });
    const { container } = render(PostDescriptionComponent);
    
    // Check structure: lead > strong > abbr
    const leadDiv = container.querySelector('div.lead');
    const strong = leadDiv?.querySelector('strong');
    const abbr = strong?.querySelector('abbr');
    
    expect(leadDiv).toBeInTheDocument();
    expect(strong).toBeInTheDocument();
    expect(abbr).toBeInTheDocument();
  });
});

