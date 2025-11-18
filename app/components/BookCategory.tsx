import type { Book } from '@/lib/data';
import BookGrid from './BookGrid';

interface BookCategoryProps {
  category: string;
  books: Book[];
  affiliatesTag: string;
  booksPerRow?: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function BookCategory({ category, books, affiliatesTag, booksPerRow = 3 }: BookCategoryProps) {
  return (
    <div>
      <h3 id={slugify(category)} className="book-group">
        {category}
      </h3>
      <BookGrid books={books} affiliatesTag={affiliatesTag} booksPerRow={booksPerRow} />
    </div>
  );
}
