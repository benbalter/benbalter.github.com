import { getPageBySlug } from '@/lib/pages';
import { getContactLinks, getPgpKey, getSiteConfig } from '@/lib/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd, getPersonJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownContent from '@/app/components/MarkdownContent';
import PageTitle from '@/app/components/PageTitle';
import ContactLinks from '@/app/components/ContactLinks';

const PAGE_PATH = '/about/';

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('about');
  
  if (!page) {
    return {};
  }
  
  return getPageMetadata(page, PAGE_PATH);
}

export default async function AboutPage() {
  const page = getPageBySlug('about');
  
  if (!page) {
    notFound();
  }
  
  const config = getSiteConfig();
  const contactLinks = getContactLinks();
  const pgpKey = getPgpKey();
  
  const webPageJsonLd = getWebPageJsonLd(page, PAGE_PATH);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(page, PAGE_PATH);
  const personJsonLd = getPersonJsonLd();
  
  // Link to raw headshot image - use branch from config
  const headshotUrl = `https://github.com/${config.repository}/raw/${config.branch}/assets/img/headshot.jpg`;
  
  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />
      
      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />
      
      {/* Person structured data for about page */}
      <JsonLdScript data={personJsonLd} scriptKey="person-schema" />
      
      <div className="page page-about">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            {page.title && <PageTitle title={page.title} />}
            
            {/* Headshot image floated to the right */}
            <div className="float-end ms-3 mb-2 w-25">
              <Link href={headshotUrl}>
                <Image
                  src={`https://github.com/${config.handle}.png?size=250`}
                  alt={config.author.name}
                  className="avatar img-fluid rounded"
                  width={250}
                  height={250}
                />
              </Link>
            </div>
            
            <MarkdownContent markdown={page.content} />
            
            <ContactLinks contactLinks={contactLinks} pgpKey={pgpKey} />
          </div>
        </div>
      </div>
    </>
  );
}
