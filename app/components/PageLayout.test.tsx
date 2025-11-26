import { render, screen } from '@testing-library/react';
import PageLayout from './PageLayout';
import type { Page } from '@/lib/pages';

// Mock next-seo
jest.mock('next-seo', () => ({
  JsonLdScript: ({ data, scriptKey }: { data: object; scriptKey: string }) => (
    <script data-testid={`jsonld-${scriptKey}`} type="application/ld+json">
      {JSON.stringify(data)}
    </script>
  ),
}));

// Mock SEO functions
jest.mock('@/lib/seo', () => ({
  getWebPageJsonLd: jest.fn(() => ({ '@type': 'WebPage', name: 'Test Page' })),
  getPageBreadcrumbJsonLd: jest.fn(() => ({ '@type': 'BreadcrumbList' })),
}));

describe('PageLayout', () => {
  const mockPage: Page = {
    slug: 'test-page',
    title: 'Test Page Title',
    description: 'Test page description',
    content: 'Test content',
  };

  it('renders page title by default', () => {
    render(
      <PageLayout page={mockPage} path="/test-page/">
        <p>Child content</p>
      </PageLayout>
    );

    expect(screen.getByText('Test Page Title')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('hides title when showTitle is false', () => {
    render(
      <PageLayout page={mockPage} path="/test-page/" showTitle={false}>
        <p>Child content</p>
      </PageLayout>
    );

    expect(screen.queryByText('Test Page Title')).not.toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('uses custom pageClassName when provided', () => {
    const { container } = render(
      <PageLayout page={mockPage} path="/test-page/" pageClassName="custom">
        <p>Content</p>
      </PageLayout>
    );

    expect(container.querySelector('.page-custom')).toBeInTheDocument();
  });

  it('uses slug as default class name', () => {
    const { container } = render(
      <PageLayout page={mockPage} path="/test-page/">
        <p>Content</p>
      </PageLayout>
    );

    expect(container.querySelector('.page-test-page')).toBeInTheDocument();
  });

  it('renders JSON-LD scripts', () => {
    render(
      <PageLayout page={mockPage} path="/test-page/">
        <p>Content</p>
      </PageLayout>
    );

    expect(screen.getByTestId('jsonld-webpage-schema')).toBeInTheDocument();
    expect(screen.getByTestId('jsonld-breadcrumb-schema')).toBeInTheDocument();
  });

  it('renders additional JSON-LD when provided', () => {
    const additionalJsonLd = [
      { data: { '@type': 'Person', name: 'Test' }, scriptKey: 'person-schema' },
    ];

    render(
      <PageLayout page={mockPage} path="/test-page/" additionalJsonLd={additionalJsonLd}>
        <p>Content</p>
      </PageLayout>
    );

    expect(screen.getByTestId('jsonld-person-schema')).toBeInTheDocument();
  });

  it('applies Bootstrap grid classes', () => {
    const { container } = render(
      <PageLayout page={mockPage} path="/test-page/">
        <p>Content</p>
      </PageLayout>
    );

    expect(container.querySelector('.row')).toBeInTheDocument();
    expect(container.querySelector('.col-md-10.offset-md-1')).toBeInTheDocument();
  });
});
