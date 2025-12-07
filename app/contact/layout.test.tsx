import { render, screen } from '@testing-library/react';
import ContactLayout from './layout';

// Mock the modules
jest.mock('@/lib/config', () => ({
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
}));

describe('ContactLayout', () => {
  it('renders the page title', () => {
    render(
      <ContactLayout>
        <p>Test content</p>
      </ContactLayout>
    );
    
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <ContactLayout>
        <p>Looking to get in touch?</p>
      </ContactLayout>
    );
    
    expect(screen.getByText(/Looking to get in touch/i)).toBeInTheDocument();
  });

  it('renders contact links', () => {
    render(
      <ContactLayout>
        <p>Test content</p>
      </ContactLayout>
    );
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders PGP key', () => {
    render(
      <ContactLayout>
        <p>Test content</p>
      </ContactLayout>
    );
    
    expect(screen.getByText('ABCD 1234 5678')).toBeInTheDocument();
  });

  it('has correct page structure', () => {
    const { container } = render(
      <ContactLayout>
        <p>Test content</p>
      </ContactLayout>
    );
    
    expect(container.querySelector('.page-contact')).toBeInTheDocument();
    expect(container.querySelector('.col-md-10')).toBeInTheDocument();
  });
});
