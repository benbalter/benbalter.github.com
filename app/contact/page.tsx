import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import MarkdownContent from '@/app/components/MarkdownContent';
import PageLayout from '@/app/components/PageLayout';

const PAGE_PATH = '/contact/';

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('contact');
  
  if (!page) {
    return {};
  }
  
  return getPageMetadata(page, PAGE_PATH);
}

export default async function ContactPage() {
  const page = getPageBySlug('contact');
  
  if (!page) {
    notFound();
  }
  
  return (
    <PageLayout page={page} path={PAGE_PATH}>
      {/* Contact links are rendered via the {% include contact-links.html %} in contact.md */}
      <MarkdownContent markdown={page.content} />
    </PageLayout>
  );
}
