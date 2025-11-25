import { render, screen } from '@testing-library/react';
import ContactPage from './page';

// Mock the modules
jest.mock('@/lib/pages', () => ({
  getPageBySlug: jest.fn(() => ({
    slug: 'contact',
    title: 'Contact',
    description: 'Contact Ben Balter via email or social media',
    content: 'Looking to get in touch? Email me.',
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

describe('ContactPage', () => {
  it('renders the page title', async () => {
    const Page = await ContactPage();
    render(Page);
    
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders markdown content', async () => {
    const Page = await ContactPage();
    render(Page);
    
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
    expect(screen.getByText(/Looking to get in touch/i)).toBeInTheDocument();
  });

  it('has correct page structure', async () => {
    const Page = await ContactPage();
    const { container } = render(Page);
    
    expect(container.querySelector('.page-contact')).toBeInTheDocument();
    expect(container.querySelector('.col-md-10')).toBeInTheDocument();
  });
});
