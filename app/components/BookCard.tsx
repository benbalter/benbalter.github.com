import { Book } from '@/lib/data';
import { markdownToHtml } from '@/lib/markdown';

interface BookCardProps {
  book: Book;
  amazonTag: string;
}

export default async function BookCard({ book, amazonTag }: BookCardProps) {
  const titleHtml = await markdownToHtml(book.title);
  const tldrHtml = await markdownToHtml(book.tldr);
  
  return (
    <div className="text-center">
      <a href={`https://www.amazon.com/gp/product/${book.asin}/?tag=${amazonTag}`}>
        <div className="mb-2">
          <img
            src={`http://images.amazon.com/images/P/${book.asin}.01.MZZZZZZZ.jpg`}
            alt={book.title}
            loading="lazy"
          />
        </div>

        <div 
          className="title font-weight-bold min-y-5"
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />
      </a>

      <div 
        className="small text-justify"
        dangerouslySetInnerHTML={{ __html: tldrHtml }}
      />
    </div>
  );
}
