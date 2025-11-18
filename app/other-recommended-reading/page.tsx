import { getPageBySlug } from '@/lib/pages';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import BooksList from '@/app/components/BooksList';

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('other-recommended-reading');
  
  if (!page) {
    return {};
  }
  
  return getPageMetadata(page, '/other-recommended-reading/');
}

export default async function OtherRecommendedReadingPage() {
  const page = getPageBySlug('other-recommended-reading');
  
  if (!page) {
    notFound();
  }
  
  const booksPerRow = page.books_per_row || 3;
  
  // Convert description with markdown and add link classes
  const descriptionHtml = await markdownToHtml(page.description || '');
  const styledDescription = descriptionHtml.replace(
    /a href=/g,
    'a class="link-secondary" href='
  );
  
  return (
    <div className="page page-other-recommended-reading">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <h1 className="display-4 text-primary">{page.title}</h1>
          
          <div className="lead mb-2" dangerouslySetInnerHTML={{ __html: styledDescription }} />
          
          <BooksList booksPerRow={booksPerRow} />
        </div>
      </div>
    </div>
  );
}
