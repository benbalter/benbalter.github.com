import { render } from '@testing-library/react';
import MarkdownContent from './MarkdownContent';

// Mock the markdown utility
jest.mock('@/lib/markdown', () => ({
  markdownToHtml: jest.fn(async (markdown: string) => {
    // Simple mock that converts markdown to basic HTML
    return `<p>${markdown}</p>`;
  }),
}));

describe('MarkdownContent', () => {
  it('should render markdown content', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    markdownToHtml.mockResolvedValueOnce('<p>Test content</p>');
    
    // MarkdownContent is an async component, so we need to await it
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: 'Test content',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.querySelector('p')).toHaveTextContent('Test content');
  });

  it('should apply custom className', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    markdownToHtml.mockResolvedValueOnce('<p>Content</p>');
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: 'Content',
      className: 'custom-class',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should render without className', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    markdownToHtml.mockResolvedValueOnce('<p>Content</p>');
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: 'Content',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should call markdownToHtml with correct markdown', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    markdownToHtml.mockResolvedValueOnce('<p>Test markdown</p>');
    
    await MarkdownContent({ 
      markdown: 'Test markdown',
    });
    
    expect(markdownToHtml).toHaveBeenCalledWith('Test markdown');
  });

  it('should render HTML from markdownToHtml', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    const complexHtml = '<h1>Title</h1><p>Paragraph</p><ul><li>Item</li></ul>';
    markdownToHtml.mockResolvedValueOnce(complexHtml);
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: '# Title\n\nParagraph\n\n- Item',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.querySelector('h1')).toHaveTextContent('Title');
    expect(container.querySelector('p')).toHaveTextContent('Paragraph');
    expect(container.querySelector('li')).toHaveTextContent('Item');
  });

  it('should handle empty markdown', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    markdownToHtml.mockResolvedValueOnce('');
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: '',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should use dangerouslySetInnerHTML for HTML content', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    markdownToHtml.mockResolvedValueOnce('<strong>Bold text</strong>');
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: '**Bold text**',
    });
    
    const { container } = render(MarkdownContentResolved);
    
    expect(container.querySelector('strong')).toHaveTextContent('Bold text');
  });
});
