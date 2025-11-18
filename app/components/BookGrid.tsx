import type { Book } from '@/lib/data';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  affiliatesTag: string;
  booksPerRow?: number;
}

export default function BookGrid({ books, affiliatesTag, booksPerRow = 3 }: BookGridProps) {
  // Group books into rows
  const rows: Book[][] = [];
  for (let i = 0; i < books.length; i += booksPerRow) {
    rows.push(books.slice(i, i + booksPerRow));
  }

  return (
    <>
      {rows.map((rowBooks, rowIndex) => (
        <div key={rowIndex} className="row pt-2">
          {rowBooks.map((book) => (
            <div key={book.asin} className={`col-md-${12 / booksPerRow}`}>
              <BookCard book={book} affiliatesTag={affiliatesTag} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
