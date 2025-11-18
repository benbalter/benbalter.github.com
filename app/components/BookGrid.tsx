import type { Book } from '@/lib/data';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  affiliatesTag: string;
  booksPerRow?: number;
}

// Valid Bootstrap column sizes that divide 12 evenly
const VALID_BOOKS_PER_ROW = [1, 2, 3, 4, 6, 12];

export default function BookGrid({ books, affiliatesTag, booksPerRow = 3 }: BookGridProps) {
  // Validate booksPerRow to ensure it produces valid Bootstrap classes
  const validBooksPerRow = VALID_BOOKS_PER_ROW.includes(booksPerRow) ? booksPerRow : 3;
  
  // Group books into rows
  const rows: Book[][] = [];
  for (let i = 0; i < books.length; i += validBooksPerRow) {
    rows.push(books.slice(i, i + validBooksPerRow));
  }

  return (
    <>
      {rows.map((rowBooks, rowIndex) => (
        <div key={rowIndex} className="row pt-2">
          {rowBooks.map((book) => (
            <div key={book.asin} className={`col-md-${12 / validBooksPerRow}`}>
              <BookCard book={book} affiliatesTag={affiliatesTag} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
