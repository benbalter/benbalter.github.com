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
    email: 'ben@balter.com',
    handle: 'benbalter',
  })),
  getContactLinks: jest.fn(() => [
    { name: 'Email', url: 'mailto:ben@balter.com', icon: 'fa-solid fa-envelope' },
    { name: 'GitHub', url: 'https://github.com/benbalter', icon: 'fa-brands fa-github' },
  ]),
  getPgpKey: jest.fn(() => '07C6 73FB F30E 01C0 C342 7AB8 DBB6 7C24 6AD3 56C4'),
}));

jest.mock('@/lib/seo', () => ({
  getPageMetadata: jest.fn(() => ({})),
  getWebPageJsonLd: jest.fn(() => ({ '@type': 'WebPage' })),
  getPageBreadcrumbJsonLd: jest.fn(() => ({ '@type': 'BreadcrumbList' })),
}));

jest.mock('@/app/components/ContactLinks', () => {
  return function MockContactLinks({ contactLinks, pgpKey }: { contactLinks: any[]; pgpKey?: string }) {
    return (
      <div data-testid="contact-links">
        {contactLinks.map(link => (
          <a key={link.name} href={link.url}>{link.name}</a>
        ))}
        {pgpKey && <span data-testid="pgp-key">{pgpKey}</span>}
      </div>
    );
  };
});

describe('ContactPage', () => {
  it('renders the page title', async () => {
    const Page = await ContactPage();
    render(Page);
    
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders intro text with email link', async () => {
    const Page = await ContactPage();
    render(Page);
    
    expect(screen.getByText(/Looking to get in touch/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ben@balter.com' })).toHaveAttribute('href', 'mailto:ben@balter.com');
  });

  it('renders contact links component', async () => {
    const Page = await ContactPage();
    render(Page);
    
    expect(screen.getByTestId('contact-links')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
  });

  it('renders PGP key', async () => {
    const Page = await ContactPage();
    render(Page);
    
    expect(screen.getByTestId('pgp-key')).toHaveTextContent('07C6 73FB F30E 01C0 C342 7AB8 DBB6 7C24 6AD3 56C4');
  });

  it('has correct page structure', async () => {
    const Page = await ContactPage();
    const { container } = render(Page);
    
    expect(container.querySelector('.page-contact')).toBeInTheDocument();
    expect(container.querySelector('.col-md-10')).toBeInTheDocument();
  });
});
