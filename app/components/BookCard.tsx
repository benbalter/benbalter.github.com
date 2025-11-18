import type { Book } from '@/lib/data';

interface BookCardProps {
  book: Book;
  affiliatesTag: string;
}

export default function BookCard({ book, affiliatesTag }: BookCardProps) {
  return (
    <div className="text-center">
      <a href={`https://www.amazon.com/gp/product/${book.asin}/?tag=${affiliatesTag}`}>
        <div className="mb-2">
          <img
            src={`http://images.amazon.com/images/P/${book.asin}.01.MZZZZZZZ.jpg`}
            alt={book.title}
          />
        </div>

        <div className="title font-weight-bold min-y-5">
          {book.title}
        </div>
      </a>

      <div className="small text-justify">
        {book.tldr}
      </div>
    </div>
  );
}
