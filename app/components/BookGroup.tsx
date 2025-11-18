import { Book } from '@/lib/data';
import BookCard from './BookCard';

interface BookGroupProps {
  groupName: string;
  books: Book[];
  amazonTag: string;
  booksPerRow: number;
}

/**
 * Converts a string to a URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export default async function BookGroup({ 
  groupName, 
  books, 
  amazonTag,
  booksPerRow 
}: BookGroupProps) {
  const columnClass = `col-md-${12 / booksPerRow}`;
  const groupId = slugify(groupName);
  
  // Split books into rows
  const rows: Book[][] = [];
  for (let i = 0; i < books.length; i += booksPerRow) {
    rows.push(books.slice(i, i + booksPerRow));
  }
  
  return (
    <>
      <h3 id={groupId} className="book-group">
        {groupName}
      </h3>
      
      {rows.map((row, rowIndex) => (
        <div className="row pt-2" key={rowIndex}>
          {row.map((book) => (
            <div className={columnClass} key={book.asin}>
              <BookCard book={book} amazonTag={amazonTag} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
