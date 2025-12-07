import type { Metadata } from 'next';
import { JsonLdScript } from 'next-seo';
import { getContactLinks, getPgpKey } from '@/lib/config';
import { getWebPageJsonLd, getPageBreadcrumbJsonLd, getPageMetadata } from '@/lib/seo';
import ContactLinks from '@/app/components/ContactLinks';
import PageTitle from '@/app/components/PageTitle';

const PAGE_PATH = '/contact/';
const PAGE_SLUG = 'contact';

// Page metadata for the contact page
// Content is provided by MDX file, but we need a placeholder for type compatibility
const pageData = {
  slug: PAGE_SLUG,
  title: 'Contact',
  description: 'Contact Ben Balter via email or social media',
  permalink: PAGE_PATH,
  content: '', // Content is rendered by MDX
};

export const metadata: Metadata = getPageMetadata(pageData, PAGE_PATH);

/**
 * Contact page layout with MDX content support.
 * Provides the page structure and contact links around MDX content.
 */
export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactLinks = getContactLinks();
  const pgpKey = getPgpKey();

  // JSON-LD structured data
  const webPageJsonLd = getWebPageJsonLd(pageData, PAGE_PATH);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(pageData, PAGE_PATH);

  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />

      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />

      <div className={`page page-${PAGE_SLUG}`}>
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <PageTitle title={pageData.title} />

            {/* MDX content rendered here */}
            {children}

            <ContactLinks contactLinks={contactLinks} pgpKey={pgpKey} />
          </div>
        </div>
      </div>
    </>
  );
}
