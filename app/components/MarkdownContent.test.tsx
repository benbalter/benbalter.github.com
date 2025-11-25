import { render, screen } from '@testing-library/react';
import MarkdownContent from './MarkdownContent';

// Mock the markdown utility
jest.mock('@/lib/markdown', () => ({
  markdownToHtml: jest.fn(async (markdown: string) => {
    // Simple mock that converts markdown to basic HTML
    return `<p>${markdown}</p>`;
  }),
}));

// Mock the liquid utility
jest.mock('@/lib/liquid', () => ({
  extractComponentPlaceholders: jest.fn((html: string) => ({
    content: html,
    components: [],
  })),
  splitContentAtPlaceholders: jest.fn((html: string) => [
    { type: 'html', content: html },
  ]),
}));

describe('MarkdownContent', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

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

  it('should call markdownToHtml first, then extractComponentPlaceholders on result', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    const { extractComponentPlaceholders } = require('@/lib/liquid');
    
    markdownToHtml.mockResolvedValueOnce('<p>Rendered HTML</p>');
    extractComponentPlaceholders.mockReturnValueOnce({
      content: '<p>Rendered HTML</p>',
      components: [],
    });
    
    await MarkdownContent({ 
      markdown: 'Test markdown',
    });
    
    // markdownToHtml should be called with original markdown
    expect(markdownToHtml).toHaveBeenCalledWith('Test markdown', undefined);
    // extractComponentPlaceholders should be called with rendered HTML
    expect(extractComponentPlaceholders).toHaveBeenCalledWith('<p>Rendered HTML</p>');
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

  it('should render FossAtScale component when extracted from HTML', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    const { extractComponentPlaceholders, splitContentAtPlaceholders } = require('@/lib/liquid');
    
    // Simulate Liquid rendering the foss-at-scale include to HTML
    markdownToHtml.mockResolvedValueOnce('<div class="alert alert-primary text-center" role="alert">This is the first post in a series</div>');
    
    // extractComponentPlaceholders detects the callout pattern and extracts it
    extractComponentPlaceholders.mockReturnValueOnce({
      content: '<div data-component="component-0"></div>',
      components: [{ type: 'foss-at-scale', props: { nth: 'first' }, id: 'component-0' }],
    });
    splitContentAtPlaceholders.mockReturnValueOnce([
      { type: 'component', component: { type: 'foss-at-scale', props: { nth: 'first' }, id: 'component-0' } },
    ]);
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: '{% include foss-at-scale.html nth="first" %}',
    });
    
    render(MarkdownContentResolved);
    
    // FossAtScale component renders with alert role
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/This is the first post in/i)).toBeInTheDocument();
  });

  it('should render GitHubCultureCallout component when extracted from HTML', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    const { extractComponentPlaceholders, splitContentAtPlaceholders } = require('@/lib/liquid');
    
    markdownToHtml.mockResolvedValueOnce('<div class="alert alert-primary text-center" role="alert">GitHub culture content</div>');
    extractComponentPlaceholders.mockReturnValueOnce({
      content: '<div data-component="component-0"></div>',
      components: [{ type: 'github-culture', props: {}, id: 'component-0' }],
    });
    splitContentAtPlaceholders.mockReturnValueOnce([
      { type: 'component', component: { type: 'github-culture', props: {}, id: 'component-0' } },
    ]);
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: '{% include_cached github-culture.html %}',
    });
    
    render(MarkdownContentResolved);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Interested in learning more about how GitHub works/i)).toBeInTheDocument();
  });

  it('should render Callout component when extracted from HTML', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    const { extractComponentPlaceholders, splitContentAtPlaceholders } = require('@/lib/liquid');
    
    markdownToHtml.mockResolvedValueOnce('<div class="alert alert-primary text-center" role="alert">Test callout</div>');
    extractComponentPlaceholders.mockReturnValueOnce({
      content: '<div data-component="component-0"></div>',
      components: [{ type: 'callout', props: { content: 'Test callout' }, id: 'component-0' }],
    });
    splitContentAtPlaceholders.mockReturnValueOnce([
      { type: 'component', component: { type: 'callout', props: { content: 'Test callout' }, id: 'component-0' } },
    ]);
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: '{% include callout.html content="Test callout" %}',
    });
    
    render(MarkdownContentResolved);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test callout')).toBeInTheDocument();
  });

  it('should render mixed HTML and components', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    const { extractComponentPlaceholders, splitContentAtPlaceholders } = require('@/lib/liquid');
    
    markdownToHtml.mockResolvedValueOnce('<p>Before</p><div class="alert alert-primary text-center" role="alert">Callout</div><p>After</p>');
    extractComponentPlaceholders.mockReturnValueOnce({
      content: '<p>Before</p><div data-component="component-0"></div><p>After</p>',
      components: [{ type: 'foss-at-scale', props: { nth: 'second' }, id: 'component-0' }],
    });
    splitContentAtPlaceholders.mockReturnValueOnce([
      { type: 'html', content: '<p>Before</p>' },
      { type: 'component', component: { type: 'foss-at-scale', props: { nth: 'second' }, id: 'component-0' } },
      { type: 'html', content: '<p>After</p>' },
    ]);
    
    const MarkdownContentResolved = await MarkdownContent({ 
      markdown: 'Before {% include foss-at-scale.html nth="second" %} After',
    });
    
    render(MarkdownContentResolved);
    
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/This is the second post in/i)).toBeInTheDocument();
  });
});
