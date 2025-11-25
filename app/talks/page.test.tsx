import { render, screen } from '@testing-library/react';
import TalksPage from './page';

// Mock the modules
jest.mock('@/lib/pages', () => ({
  getPageBySlug: jest.fn(() => ({
    slug: 'talks',
    title: 'Talks',
    description: 'Slides and recordings from talks',
    content: '### Community management\n\n* [A community of communities](https://example.com)',
  })),
}));

jest.mock('@/lib/config', () => ({
  getSiteConfig: jest.fn(() => ({
    title: 'Ben Balter',
    description: 'Technology leadership, collaboration, and open source',
    url: 'https://ben.balter.com',
    author: {
      name: 'Ben Balter',
      twitter: 'benbalter',
    },
  })),
}));

jest.mock('@/lib/seo', () => ({
  getPageMetadata: jest.fn(() => ({})),
  getWebPageJsonLd: jest.fn(() => ({ '@type': 'WebPage' })),
  getPageBreadcrumbJsonLd: jest.fn(() => ({ '@type': 'BreadcrumbList' })),
}));

jest.mock('@/app/components/MarkdownContent', () => {
  return function MockMarkdownContent({ markdown }: { markdown: string }) {
    return <div data-testid="markdown-content">{markdown}</div>;
  };
});

describe('TalksPage', () => {
  it('renders the page title', async () => {
    const Page = await TalksPage();
    render(Page);
    
    expect(screen.getByText('Talks')).toBeInTheDocument();
  });

  it('renders markdown content', async () => {
    const Page = await TalksPage();
    render(Page);
    
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
    expect(screen.getByText(/Community management/i)).toBeInTheDocument();
  });

  it('has correct page structure', async () => {
    const Page = await TalksPage();
    const { container } = render(Page);
    
    expect(container.querySelector('.page-talks')).toBeInTheDocument();
    expect(container.querySelector('.col-md-10')).toBeInTheDocument();
  });
});
