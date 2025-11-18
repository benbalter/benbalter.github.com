import { getBooks, type Book } from '@/lib/data';

interface BooksListProps {
  booksPerRow?: number;
  amazonAffiliatesTag?: string;
}

export default function BooksList({ 
  booksPerRow = 3, 
  amazonAffiliatesTag = 'benbalter-20' 
}: BooksListProps) {
  const booksData = getBooks();
  
  return (
    <>
      {Object.entries(booksData).map(([category, books]) => {
        const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
        const columnWidth = 12 / booksPerRow;
        
        // Group books into rows
        const rows: Book[][] = [];
        for (let i = 0; i < books.length; i += booksPerRow) {
          rows.push(books.slice(i, i + booksPerRow));
        }
        
        return (
          <div key={category}>
            <h3 id={categorySlug} className="book-group">
              {category}
            </h3>
            
            {rows.map((row, rowIndex) => (
              <div className="row pt-2" key={`${category}-row-${rowIndex}`}>
                {row.map((book) => (
                  <div key={book.asin} className={`col-md-${columnWidth} text-center`}>
                    <a href={`https://www.amazon.com/gp/product/${book.asin}/?tag=${amazonAffiliatesTag}`}>
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
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
