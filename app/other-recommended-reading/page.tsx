import { getBooks } from '@/lib/data';
import { getAmazonAffiliatesTag } from '@/lib/config';
import type { Metadata } from 'next';
import { getPageBySlug } from '@/lib/pages';
import { getPageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('other-recommended-reading');
  
  if (!page) {
    return {
      title: 'Other recommended reading',
      description: 'Books that have influenced my career, management style, and professional development',
    };
  }
  
  return getPageMetadata(page, '/other-recommended-reading/');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function OtherRecommendedReadingPage() {
  const booksData = getBooks();
  const affiliatesTag = getAmazonAffiliatesTag();
  const page = getPageBySlug('other-recommended-reading');
  const booksPerRow = 3;

  // Convert the description with proper link styling
  const description = page?.description || '';

  return (
    <div className="page page-other-recommended-reading">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <h1 className="display-4 text-primary">Other recommended reading</h1>
          
          <div className="lead mb-2">
            <p>
              Here are some of the books that have had a significant influence on my career, 
              management style, and professional development that I often recommend to others 
              interested in{' '}
              <a className="link-secondary" href="#it-management-and-leadership">IT management and leadership</a>, {' '}
              <a className="link-secondary" href="#career-and-corporate-life">career and corporate life</a>, {' '}
              <a className="link-secondary" href="#open-source">open source</a>, {' '}
              <a className="link-secondary" href="#startups-and-innovation">startups and innovation</a>, {' '}
              <a className="link-secondary" href="#information-security">information security</a>, {' '}
              <a className="link-secondary" href="#product-management">product management</a>, {' '}
              <a className="link-secondary" href="#marketing">marketing</a>, {' '}
              <a className="link-secondary" href="#technology-policy">technology policy</a>, {' '}
              <a className="link-secondary" href="#government-and-organizing">government and organizing</a>, and{' '}
              <a className="link-secondary" href="#everything-else">everything else</a>.
            </p>
          </div>

          {Object.entries(booksData).map(([category, books]) => {
            // Group books into rows
            const rows: typeof books[] = [];
            for (let i = 0; i < books.length; i += booksPerRow) {
              rows.push(books.slice(i, i + booksPerRow));
            }

            return (
              <div key={category}>
                <h3 id={slugify(category)} className="book-group">
                  {category}
                </h3>

                {rows.map((rowBooks, rowIndex) => (
                  <div key={rowIndex} className="row pt-2">
                    {rowBooks.map((book) => (
                      <div key={book.asin} className={`col-md-${12 / booksPerRow} text-center`}>
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
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
