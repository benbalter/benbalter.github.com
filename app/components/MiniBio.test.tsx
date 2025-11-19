import { render, screen } from '@testing-library/react';
import MiniBio from './MiniBio';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock markdownToHtml to return HTML
jest.mock('@/lib/markdown', () => ({
  markdownToHtml: jest.fn(async (markdown: string) => {
    // Simple mock that converts basic markdown to HTML
    // Wrap in <p> tags to simulate real markdown processing
    return `<p>${markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')}</p>`;
  }),
}));

describe('MiniBio', () => {
  const mockProps = {
    authorName: 'Ben Balter',
    githubHandle: 'benbalter',
    bioText: 'Ben is a software developer and open source advocate.',
  };

  it('should render bio text', async () => {
    const component = await MiniBio(mockProps);
    const { container } = render(component);
    
    expect(container.textContent).toContain('Ben is a software developer');
  });

  it('should render avatar image', async () => {
    const component = await MiniBio(mockProps);
    const { container } = render(component);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://github.com/benbalter.png?size=100');
    expect(img).toHaveAttribute('alt', 'Ben Balter');
  });

  it('should render link to about page', async () => {
    const component = await MiniBio(mockProps);
    const { container } = render(component);
    
    const link = container.querySelector('a[href="/about/"]');
    expect(link).toBeInTheDocument();
    expect(link?.textContent).toContain('More about the author');
  });

  it('should have correct avatar dimensions', async () => {
    const component = await MiniBio(mockProps);
    const { container } = render(component);
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });

  it('should apply custom className when provided', async () => {
    const component = await MiniBio({ ...mockProps, className: 'custom-class' });
    const { container } = render(component);
    
    const miniBio = container.querySelector('.mini-bio');
    expect(miniBio).toHaveClass('mini-bio', 'custom-class');
  });

  it('should render without custom className', async () => {
    const component = await MiniBio(mockProps);
    const { container } = render(component);
    
    const miniBio = container.querySelector('.mini-bio');
    expect(miniBio).toBeInTheDocument();
  });

  it('should have avatar with rounded class', async () => {
    const component = await MiniBio(mockProps);
    const { container } = render(component);
    
    const img = container.querySelector('img');
    expect(img).toHaveClass('avatar', 'img-fluid', 'rounded');
  });

  it('should render markdown links in bio text', async () => {
    const propsWithMarkdown = {
      ...mockProps,
      bioText: 'Ben works at [GitHub](https://github.com).',
    };
    
    const component = await MiniBio(propsWithMarkdown);
    const { container } = render(component);
    
    const link = container.querySelector('a[href="https://github.com"]');
    expect(link).toBeInTheDocument();
    expect(link?.textContent).toBe('GitHub');
  });

  it('should convert bio markdown to HTML', async () => {
    const { markdownToHtml } = require('@/lib/markdown');
    
    const component = await MiniBio(mockProps);
    render(component);
    
    // Verify markdownToHtml was called with the bio text
    expect(markdownToHtml).toHaveBeenCalledWith(mockProps.bioText);
  });
});
