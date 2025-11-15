import { getPageBySlug } from '@/lib/pages';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const PAGE_SLUG = 'other-recommended-reading';

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug(PAGE_SLUG);
  
  if (!page) {
    return {};
  }
  
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function OtherRecommendedReadingPage() {
  const page = getPageBySlug(PAGE_SLUG);
  
  if (!page) {
    notFound();
  }
  
  const contentHtml = await markdownToHtml(page.content);
  
  return (
    <div>
      {page.title && <h1>{page.title}</h1>}
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
