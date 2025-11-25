import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import MarkdownContent from '@/app/components/MarkdownContent';
import PageLayout from '@/app/components/PageLayout';

const PAGE_PATH = '/talks/';

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('talks');
  
  if (!page) {
    return {};
  }
  
  return getPageMetadata(page, PAGE_PATH);
}

export default async function TalksPage() {
  const page = getPageBySlug('talks');
  
  if (!page) {
    notFound();
  }
  
  return (
    <PageLayout page={page} path={PAGE_PATH}>
      <MarkdownContent markdown={page.content} />
    </PageLayout>
  );
}
