import { render, screen } from '@testing-library/react';
import AboutPage from './page';

// Mock the modules
jest.mock('@/lib/pages', () => ({
  getPageBySlug: jest.fn(() => ({
    slug: 'about',
    title: 'About',
    description: 'About Ben Balter',
    content: 'Ben Balter is a developer and attorney.',
  })),
}));

jest.mock('@/lib/config', () => ({
  getSiteConfig: jest.fn(() => ({
    title: 'Ben Balter',
    description: 'Technology leadership, collaboration, and open source',
    url: 'https://ben.balter.com',
    repository: 'benbalter/benbalter.github.com',
    branch: 'main',
    handle: 'benbalter',
    author: {
      name: 'Ben Balter',
      twitter: 'benbalter',
    },
    job_title: 'Director',
    employer: {
      name: 'GitHub',
      url: 'https://github.com',
    },
    social: {
      name: 'Ben Balter',
      links: ['https://github.com/benbalter'],
    },
  })),
  getContactLinks: jest.fn(() => [
    { name: 'Email', url: 'mailto:test@example.com', icon: 'fa-solid fa-envelope' },
    { name: 'GitHub', url: 'https://github.com/benbalter', icon: 'fa-brands fa-github' },
  ]),
  getPgpKey: jest.fn(() => 'ABCD 1234 5678'),
}));

jest.mock('@/lib/seo', () => ({
  getPageMetadata: jest.fn(() => ({})),
  getWebPageJsonLd: jest.fn(() => ({ '@type': 'WebPage' })),
  getPageBreadcrumbJsonLd: jest.fn(() => ({ '@type': 'BreadcrumbList' })),
  getPersonJsonLd: jest.fn(() => ({ '@type': 'Person', name: 'Ben Balter' })),
}));

jest.mock('@/app/components/MarkdownContent', () => {
  return function MockMarkdownContent({ markdown }: { markdown: string }) {
    return <div data-testid="markdown-content">{markdown}</div>;
  };
});

describe('AboutPage', () => {
  it('renders the page title', async () => {
    const Page = await AboutPage();
    render(Page);
    
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders markdown content', async () => {
    const Page = await AboutPage();
    render(Page);
    
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
    expect(screen.getByText(/Ben Balter is a developer/i)).toBeInTheDocument();
  });

  it('renders the headshot image', async () => {
    const Page = await AboutPage();
    render(Page);
    
    const image = screen.getByRole('img', { name: 'Ben Balter' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('github.com'));
  });

  it('renders contact links', async () => {
    const Page = await AboutPage();
    render(Page);
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders PGP key', async () => {
    const Page = await AboutPage();
    render(Page);
    
    expect(screen.getByText('ABCD 1234 5678')).toBeInTheDocument();
  });

  it('has correct page structure', async () => {
    const Page = await AboutPage();
    const { container } = render(Page);
    
    expect(container.querySelector('.page-about')).toBeInTheDocument();
    expect(container.querySelector('.col-md-10')).toBeInTheDocument();
  });
});
