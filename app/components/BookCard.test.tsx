import { render } from '@testing-library/react';
import BookCard from './BookCard';
import type { Book } from '@/lib/data';

// Mock the markdown function
jest.mock('@/lib/markdown', () => ({
  markdownToHtml: jest.fn((text: string) => Promise.resolve(`<p>${text}</p>`)),
}));

describe('BookCard', () => {
  const mockBook: Book = {
    title: 'Test Book',
    asin: 'B00TEST123',
    tldr: 'This is a test book description',
  };

  const amazonTag = 'testaffiliate-20';

  it('should render book title', async () => {
    const { container } = render(await BookCard({ book: mockBook, amazonTag }));
    
    expect(container.textContent).toContain('Test Book');
  });

  it('should render Amazon link with affiliate tag', async () => {
    const { container } = render(await BookCard({ book: mockBook, amazonTag }));
    
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('href', `https://www.amazon.com/gp/product/${mockBook.asin}/?tag=${amazonTag}`);
  });

  it('should render book image', async () => {
    const { container } = render(await BookCard({ book: mockBook, amazonTag }));
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', `http://images.amazon.com/images/P/${mockBook.asin}.01.MZZZZZZZ.jpg`);
    expect(img).toHaveAttribute('alt', mockBook.title);
  });

  it('should render book description', async () => {
    const { container } = render(await BookCard({ book: mockBook, amazonTag }));
    
    expect(container.textContent).toContain('This is a test book description');
  });

  it('should have lazy loading on image', async () => {
    const { container } = render(await BookCard({ book: mockBook, amazonTag }));
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
