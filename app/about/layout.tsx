import type { Metadata } from 'next';
import { JsonLdScript } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';
import { getContactLinks, getPgpKey, getSiteConfig } from '@/lib/config';
import { getWebPageJsonLd, getPageBreadcrumbJsonLd, getPersonJsonLd, getPageMetadata } from '@/lib/seo';
import ContactLinks from '@/app/components/ContactLinks';
import PageTitle from '@/app/components/PageTitle';

const PAGE_PATH = '/about/';
const PAGE_SLUG = 'about';

// Page metadata for the about page
// Content is provided by MDX file, but we need a placeholder for type compatibility
const pageData = {
  slug: PAGE_SLUG,
  title: 'About',
  description: 'Ben Balter is an attorney, an open source developer, and a Senior Technical Program Manager at GitHub, the world\'s largest software development network.',
  permalink: PAGE_PATH,
  content: '', // Content is rendered by MDX
};

export const metadata: Metadata = getPageMetadata(pageData, PAGE_PATH);

/**
 * About page layout with MDX content support.
 * Provides the page structure, headshot, and contact links around MDX content.
 */
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getSiteConfig();
  const contactLinks = getContactLinks();
  const pgpKey = getPgpKey();

  // Link to raw headshot image - use branch from config
  const headshotUrl = `https://github.com/${config.repository}/raw/${config.branch}/assets/img/headshot.jpg`;

  // JSON-LD structured data
  const webPageJsonLd = getWebPageJsonLd(pageData, PAGE_PATH);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(pageData, PAGE_PATH);
  const personJsonLd = getPersonJsonLd();

  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />

      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />

      {/* Person JSON-LD for about page */}
      <JsonLdScript data={personJsonLd} scriptKey="person-schema" />

      <div className={`page page-${PAGE_SLUG}`}>
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <PageTitle title={pageData.title} />

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

            {/* MDX content rendered here */}
            {children}

            <ContactLinks contactLinks={contactLinks} pgpKey={pgpKey} />
          </div>
        </div>
      </div>
    </>
  );
}
