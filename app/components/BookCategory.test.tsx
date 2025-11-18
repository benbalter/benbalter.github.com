import { render, screen } from '@testing-library/react';
import BookCategory from './BookCategory';
import type { Book } from '@/lib/data';

describe('BookCategory', () => {
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
  ];

  const affiliatesTag = 'test-tag-20';

  it('renders category heading', () => {
    render(<BookCategory category="IT Management" books={mockBooks} affiliatesTag={affiliatesTag} />);
    expect(screen.getByText('IT Management')).toBeInTheDocument();
  });

  it('applies correct CSS class to heading', () => {
    const { container } = render(<BookCategory category="IT Management" books={mockBooks} affiliatesTag={affiliatesTag} />);
    const heading = container.querySelector('h3');
    
    expect(heading).toHaveClass('book-group');
  });

  it('creates slugified ID for heading', () => {
    const { container } = render(<BookCategory category="IT Management and Leadership" books={mockBooks} affiliatesTag={affiliatesTag} />);
    const heading = container.querySelector('h3');
    
    expect(heading?.getAttribute('id')).toBe('it-management-and-leadership');
  });

  it('renders BookGrid component', () => {
    const { container } = render(<BookCategory category="Open Source" books={mockBooks} affiliatesTag={affiliatesTag} />);
    const rows = container.querySelectorAll('.row.pt-2');
    
    // 2 books with default 3 per row = 1 row
    expect(rows.length).toBe(1);
  });

  it('passes booksPerRow prop to BookGrid', () => {
    const { container } = render(
      <BookCategory category="Open Source" books={mockBooks} affiliatesTag={affiliatesTag} booksPerRow={2} />
    );
    const columns = container.querySelectorAll('.col-md-6');
    
    // With 2 books per row, columns should be col-md-6
    expect(columns.length).toBe(2);
  });

  it('handles category names with special characters', () => {
    const { container } = render(<BookCategory category="Category & Name!" books={mockBooks} affiliatesTag={affiliatesTag} />);
    const heading = container.querySelector('h3');
    
    expect(heading?.getAttribute('id')).toBe('category-name');
  });
});
