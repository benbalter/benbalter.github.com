import { getPageBySlug } from '@/lib/pages';
import { getContactLinks, getPgpKey, getSiteConfig } from '@/lib/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import Link from 'next/link';
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
  
  const config = getSiteConfig();
  const contactLinks = getContactLinks();
  const pgpKey = getPgpKey();
  
  const webPageJsonLd = getWebPageJsonLd(page, PAGE_PATH);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(page, PAGE_PATH);
  
  // Get email and handle from config
  const email = config.email || 'ben@balter.com';
  const handle = config.handle || 'benbalter';
  
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
            
            {/* Render intro text directly instead of using MarkdownContent with Jekyll includes */}
            <p className="text-center">
              Looking to get in touch? Email{' '}
              <Link href={`mailto:${email}`}>{email}</Link>{' '}
              or I&apos;m <code>@{handle}</code> most places:
            </p>
            
            {/* Use the ContactLinks React component instead of Jekyll include */}
            <ContactLinks contactLinks={contactLinks} pgpKey={pgpKey} />
          </div>
        </div>
      </div>
    </>
  );
}
