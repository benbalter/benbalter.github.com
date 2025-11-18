import { render, screen } from '@testing-library/react';
import BookCard from './BookCard';
import type { Book } from '@/lib/data';

describe('BookCard', () => {
  const mockBook: Book = {
    title: 'Test Book Title',
    asin: 'B00TEST123',
    tldr: 'This is a test book description.',
  };

  const affiliatesTag = 'test-tag-20';

  it('renders book title', () => {
    render(<BookCard book={mockBook} affiliatesTag={affiliatesTag} />);
    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
  });

  it('renders book description', () => {
    render(<BookCard book={mockBook} affiliatesTag={affiliatesTag} />);
    expect(screen.getByText('This is a test book description.')).toBeInTheDocument();
  });

  it('renders Amazon affiliate link with correct tag', () => {
    const { container } = render(<BookCard book={mockBook} affiliatesTag={affiliatesTag} />);
    const link = container.querySelector('a');
    
    expect(link).toBeInTheDocument();
    expect(link?.getAttribute('href')).toBe(
      'https://www.amazon.com/gp/product/B00TEST123/?tag=test-tag-20'
    );
  });

  it('renders book image with correct ASIN', () => {
    const { container } = render(<BookCard book={mockBook} affiliatesTag={affiliatesTag} />);
    const img = container.querySelector('img');
    
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute('src')).toBe(
      'https://images.amazon.com/images/P/B00TEST123.01.MZZZZZZZ.jpg'
    );
    expect(img?.getAttribute('alt')).toBe('Test Book Title');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<BookCard book={mockBook} affiliatesTag={affiliatesTag} />);
    
    expect(container.querySelector('.text-center')).toBeInTheDocument();
    expect(container.querySelector('.mb-2')).toBeInTheDocument();
    expect(container.querySelector('.title.font-weight-bold.min-y-5')).toBeInTheDocument();
    expect(container.querySelector('.small.text-justify')).toBeInTheDocument();
  });
});
