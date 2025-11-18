import { getBooks } from '@/lib/data';
import { getAmazonAffiliatesTag } from '@/lib/config';
import type { Metadata } from 'next';
import { getPageBySlug } from '@/lib/pages';
import { getPageMetadata } from '@/lib/seo';
import BookCategory from '@/app/components/BookCategory';

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

export default function OtherRecommendedReadingPage() {
  const booksData = getBooks();
  const affiliatesTag = getAmazonAffiliatesTag();
  const booksPerRow = 3;

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

          {Object.entries(booksData).map(([category, books]) => (
            <BookCategory
              key={category}
              category={category}
              books={books}
              affiliatesTag={affiliatesTag}
              booksPerRow={booksPerRow}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
