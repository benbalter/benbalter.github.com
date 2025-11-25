import Image from 'next/image';
import type { Book } from '@/lib/data';

interface BookCardProps {
  book: Book;
  affiliatesTag: string;
}

/**
 * BookCard component (Server Component)
 * Displays a book with its cover image, title, and description.
 * Uses Next.js Image for better loading performance and layout stability.
 */
export default function BookCard({ book, affiliatesTag }: BookCardProps) {
  return (
    <div className="text-center">
      <a href={`https://www.amazon.com/gp/product/${book.asin}/?tag=${affiliatesTag}`}>
        <div className="mb-2">
          <Image
            src={`https://images.amazon.com/images/P/${book.asin}.01.MZZZZZZZ.jpg`}
            alt={book.title}
            width={110}
            height={160}
            style={{ width: 'auto', height: 'auto' }}
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
