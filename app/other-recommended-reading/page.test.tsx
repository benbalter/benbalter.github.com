import { render, screen } from '@testing-library/react';
import OtherRecommendedReadingPage from './page';

// Mock the data and config modules
jest.mock('@/lib/data', () => ({
  getBooks: jest.fn(() => ({
    'IT Management and Leadership': [
      {
        title: 'Test Book 1',
        asin: 'B00TEST001',
        tldr: 'A test book for testing purposes.',
      },
      {
        title: 'Test Book 2',
        asin: 'B00TEST002',
        tldr: 'Another test book.',
      },
    ],
    'Open source': [
      {
        title: 'Test Book 3',
        asin: 'B00TEST003',
        tldr: 'Open source test book.',
      },
    ],
  })),
}));

jest.mock('@/lib/config', () => ({
  getAmazonAffiliatesTag: jest.fn(() => 'test-tag-20'),
}));

jest.mock('@/lib/pages', () => ({
  getPageBySlug: jest.fn(() => ({
    slug: 'other-recommended-reading',
    title: 'Other recommended reading',
    description: 'Books that have influenced my career',
  })),
}));

describe('OtherRecommendedReadingPage', () => {
  it('renders the page title', () => {
    render(<OtherRecommendedReadingPage />);
    expect(screen.getByText('Other recommended reading')).toBeInTheDocument();
  });

  it('renders book categories', () => {
    render(<OtherRecommendedReadingPage />);
    expect(screen.getByText('IT Management and Leadership')).toBeInTheDocument();
    expect(screen.getByText('Open source')).toBeInTheDocument();
  });

  it('renders book titles', () => {
    render(<OtherRecommendedReadingPage />);
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    expect(screen.getByText('Test Book 3')).toBeInTheDocument();
  });

  it('renders book descriptions', () => {
    render(<OtherRecommendedReadingPage />);
    expect(screen.getByText('A test book for testing purposes.')).toBeInTheDocument();
    expect(screen.getByText('Another test book.')).toBeInTheDocument();
    expect(screen.getByText('Open source test book.')).toBeInTheDocument();
  });

  it('renders Amazon affiliate links with correct tag', () => {
    const { container } = render(<OtherRecommendedReadingPage />);
    const links = container.querySelectorAll('a[href*="amazon.com"]');
    
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link.getAttribute('href')).toContain('tag=test-tag-20');
    });
  });

  it('renders book images with correct ASIN', () => {
    const { container } = render(<OtherRecommendedReadingPage />);
    const images = container.querySelectorAll('img[src*="images.amazon.com"]');
    
    expect(images.length).toBe(3);
    expect(images[0].getAttribute('src')).toContain('B00TEST001');
    expect(images[1].getAttribute('src')).toContain('B00TEST002');
    expect(images[2].getAttribute('src')).toContain('B00TEST003');
  });

  it('renders category anchor links with slugified IDs', () => {
    const { container } = render(<OtherRecommendedReadingPage />);
    const itManagementHeader = container.querySelector('#it-management-and-leadership');
    const openSourceHeader = container.querySelector('#open-source');
    
    expect(itManagementHeader).toBeInTheDocument();
    expect(openSourceHeader).toBeInTheDocument();
  });

  it('organizes books in rows with correct Bootstrap classes', () => {
    const { container } = render(<OtherRecommendedReadingPage />);
    const rows = container.querySelectorAll('.row.pt-2');
    
    // IT Management has 2 books, Open source has 1 book
    // Should create 2 rows total
    expect(rows.length).toBe(2);
  });

  it('applies correct column classes for 3 books per row', () => {
    const { container } = render(<OtherRecommendedReadingPage />);
    const columns = container.querySelectorAll('.col-md-4');
    
    // 3 books total, all should have col-md-4 (12/3)
    expect(columns.length).toBe(3);
  });
});
