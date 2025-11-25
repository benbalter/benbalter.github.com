import { getBooks } from '@/lib/data';
import { getAmazonAffiliatesTag } from '@/lib/config';
import type { Metadata } from 'next';
import { getPageBySlug } from '@/lib/pages';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import BookCategory from '@/app/components/BookCategory';

const PAGE_PATH = '/other-recommended-reading/';
const DEFAULT_PAGE = {
  slug: 'other-recommended-reading',
  title: 'Other recommended reading',
  description: 'Books that have influenced my career, management style, and professional development',
  content: '',
};

/**
 * Helper to get page data with fallback
 * Consolidates page data retrieval to avoid duplicate calls
 */
function getOtherRecommendedReadingPageData() {
  return getPageBySlug('other-recommended-reading') || DEFAULT_PAGE;
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = getOtherRecommendedReadingPageData();
  return getPageMetadata(pageData, PAGE_PATH);
}

export default function OtherRecommendedReadingPage() {
  const booksData = getBooks();
  const affiliatesTag = getAmazonAffiliatesTag();
  const booksPerRow = 3;
  
  // Get page data for JSON-LD (uses cached helper)
  const pageData = getOtherRecommendedReadingPageData();
  const webPageJsonLd = getWebPageJsonLd(pageData, PAGE_PATH);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(pageData, PAGE_PATH);

  // Category links for the introduction
  const categoryLinks = [
    { text: 'IT management and leadership', href: '#it-management-and-leadership' },
    { text: 'career and corporate life', href: '#career-and-corporate-life' },
    { text: 'open source', href: '#open-source' },
    { text: 'startups and innovation', href: '#startups-and-innovation' },
    { text: 'information security', href: '#information-security' },
    { text: 'product management', href: '#product-management' },
    { text: 'marketing', href: '#marketing' },
    { text: 'technology policy', href: '#technology-policy' },
    { text: 'government and organizing', href: '#government-and-organizing' },
    { text: 'everything else', href: '#everything-else' },
  ];

  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />
      
      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />
      
      <div className="page page-other-recommended-reading">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h1 className="display-4 text-primary">Other recommended reading</h1>
            
            <div className="lead mb-2">
              <p>
                Here are some of the books that have had a significant influence on my career, 
                management style, and professional development that I often recommend to others 
                interested in{' '}
                {categoryLinks.map((link, index) => (
                  <span key={link.href}>
                    <a className="link-secondary" href={link.href}>{link.text}</a>
                    {index < categoryLinks.length - 1 && (index === categoryLinks.length - 2 ? ', and ' : ', ')}
                  </span>
                ))}.
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
    </>
  );
}
