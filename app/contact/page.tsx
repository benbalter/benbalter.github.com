import { getPageBySlug } from '@/lib/pages';
import { getContactLinks, getPgpKey } from '@/lib/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import MarkdownContent from '@/app/components/MarkdownContent';
import PageTitle from '@/app/components/PageTitle';
import ContactLinks from '@/app/components/ContactLinks';

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
  
  const contactLinks = getContactLinks();
  const pgpKey = getPgpKey();
  
  const webPageJsonLd = getWebPageJsonLd(page, PAGE_PATH);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(page, PAGE_PATH);
  
  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />
      
      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />
      
      <div className="page page-contact">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            {page.title && <PageTitle title={page.title} />}
            
            <MarkdownContent markdown={page.content} />
            
            <ContactLinks contactLinks={contactLinks} pgpKey={pgpKey} />
          </div>
        </div>
      </div>
    </>
  );
}
