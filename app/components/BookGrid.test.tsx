import { render } from '@testing-library/react';
import BookGrid from './BookGrid';
import type { Book } from '@/lib/data';

describe('BookGrid', () => {
  const mockBooks: Book[] = [
    {
      title: 'Book 1',
      asin: 'B00TEST001',
      tldr: 'Description 1',
    },
    {
      title: 'Book 2',
      asin: 'B00TEST002',
      tldr: 'Description 2',
    },
    {
      title: 'Book 3',
      asin: 'B00TEST003',
      tldr: 'Description 3',
    },
    {
      title: 'Book 4',
      asin: 'B00TEST004',
      tldr: 'Description 4',
    },
  ];

  const affiliatesTag = 'test-tag-20';

  it('renders books in rows with default 3 books per row', () => {
    const { container } = render(<BookGrid books={mockBooks} affiliatesTag={affiliatesTag} />);
    const rows = container.querySelectorAll('.row.pt-2');
    
    // 4 books with 3 per row = 2 rows
    expect(rows.length).toBe(2);
  });

  it('renders books in rows with custom books per row', () => {
    const { container } = render(<BookGrid books={mockBooks} affiliatesTag={affiliatesTag} booksPerRow={2} />);
    const rows = container.querySelectorAll('.row.pt-2');
    
    // 4 books with 2 per row = 2 rows
    expect(rows.length).toBe(2);
  });

  it('applies correct column classes for 3 books per row', () => {
    const { container } = render(<BookGrid books={mockBooks} affiliatesTag={affiliatesTag} booksPerRow={3} />);
    const columns = container.querySelectorAll('.col-md-4');
    
    // 4 books, all should have col-md-4 (12/3)
    expect(columns.length).toBe(4);
  });

  it('applies correct column classes for 2 books per row', () => {
    const { container } = render(<BookGrid books={mockBooks} affiliatesTag={affiliatesTag} booksPerRow={2} />);
    const columns = container.querySelectorAll('.col-md-6');
    
    // 4 books, all should have col-md-6 (12/2)
    expect(columns.length).toBe(4);
  });

  it('renders correct number of BookCard components', () => {
    const { container } = render(<BookGrid books={mockBooks} affiliatesTag={affiliatesTag} />);
    const bookCards = container.querySelectorAll('.text-center');
    
    expect(bookCards.length).toBe(4);
  });

  it('handles empty books array', () => {
    const { container } = render(<BookGrid books={[]} affiliatesTag={affiliatesTag} />);
    const rows = container.querySelectorAll('.row.pt-2');
    
    expect(rows.length).toBe(0);
  });

  it('handles single book', () => {
    const { container } = render(<BookGrid books={[mockBooks[0]]} affiliatesTag={affiliatesTag} />);
    const rows = container.querySelectorAll('.row.pt-2');
    
    expect(rows.length).toBe(1);
  });

  it('validates booksPerRow and falls back to 3 for invalid values', () => {
    const { container } = render(<BookGrid books={mockBooks} affiliatesTag={affiliatesTag} booksPerRow={5} />);
    const columns = container.querySelectorAll('.col-md-4');
    
    // Invalid value 5 should fall back to 3, producing col-md-4
    expect(columns.length).toBe(4);
  });

  it('accepts valid booksPerRow value of 1', () => {
    const { container } = render(<BookGrid books={mockBooks} affiliatesTag={affiliatesTag} booksPerRow={1} />);
    const columns = container.querySelectorAll('.col-md-12');
    
    expect(columns.length).toBe(4);
  });

  it('accepts valid booksPerRow value of 4', () => {
    const { container } = render(<BookGrid books={mockBooks} affiliatesTag={affiliatesTag} booksPerRow={4} />);
    const columns = container.querySelectorAll('.col-md-3');
    
    expect(columns.length).toBe(4);
  });

  it('accepts valid booksPerRow value of 6', () => {
    const sixBooks = [...mockBooks, { title: 'Book 5', asin: 'B00TEST005', tldr: 'Description 5' }, { title: 'Book 6', asin: 'B00TEST006', tldr: 'Description 6' }];
    const { container } = render(<BookGrid books={sixBooks} affiliatesTag={affiliatesTag} booksPerRow={6} />);
    const columns = container.querySelectorAll('.col-md-2');
    
    expect(columns.length).toBe(6);
  });
});
