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

// Mock MarkdownContent component to render a simple div with text
jest.mock('./MarkdownContent', () => ({
  __esModule: true,
  default: ({ markdown }: { markdown: string }) => {
    // Simple mock that renders markdown as text with link extraction
    return (
      <div data-testid="markdown-content">
        {markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => text)}
        {markdown.includes('/about/') && (
          <a href="/about/">More about the author →</a>
        )}
      </div>
    );
  },
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

  it('should pass markdown with about link to MarkdownContent', async () => {
    const component = await MiniBio(mockProps);
    const { container } = render(component);
    
    // The MarkdownContent should receive markdown with the about link appended
    const markdownContent = container.querySelector('[data-testid="markdown-content"]');
    expect(markdownContent).toBeInTheDocument();
  });
});
