import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import MarkdownContent from '@/app/components/MarkdownContent';
import PageTitle from '@/app/components/PageTitle';

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
  
  const webPageJsonLd = getWebPageJsonLd(page, PAGE_PATH);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(page, PAGE_PATH);
  
  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />
      
      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />
      
      <div className="page page-talks">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            {page.title && <PageTitle title={page.title} />}
            
            <MarkdownContent markdown={page.content} />
          </div>
        </div>
      </div>
    </>
  );
}
