import { getBooks } from '@/lib/data';
import { getAmazonAffiliateTag } from '@/lib/config';
import { markdownToHtml } from '@/lib/markdown';
import BookGroup from '@/app/components/BookGroup';
import type { Metadata } from 'next';

const BOOKS_PER_ROW = 3;

const pageDescription = `Here are some of the books that have had a significant influence on my career, management style, and professional development that I often recommend to others interested in [IT management and leadership](#it-management-and-leadership), [career and corporate life](#career-and-corporate-life), [open source](#open-source), [startups and innovation](#startups-and-innovation), [information security](#information-security), [product management](#product-management), [marketing](#marketing), [technology policy](#technology-policy), [government and organizing](#government-and-organizing), and [everything else](#everything-else).`;

export const metadata: Metadata = {
  title: 'Other recommended reading',
  description: pageDescription.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'), // Strip markdown links for meta description
};

export default async function OtherRecommendedReadingPage() {
  const booksData = getBooks();
  const amazonTag = getAmazonAffiliateTag();
  
  // Process description to convert markdown links to HTML with proper class
  const descriptionHtml = await markdownToHtml(pageDescription);
  const descriptionWithClasses = descriptionHtml.replace(
    /<a href=/g,
    '<a class="link-secondary" href='
  );

  return (
    <div className="page page-other-recommended-reading">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <h1 className="display-4 text-primary">Other recommended reading</h1>
          
          <div 
            className="lead mb-2"
            dangerouslySetInnerHTML={{ __html: descriptionWithClasses }}
          />

          {Object.entries(booksData).map(([groupName, books]) => (
            <BookGroup
              key={groupName}
              groupName={groupName}
              books={books}
              amazonTag={amazonTag}
              booksPerRow={BOOKS_PER_ROW}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
