import { getPageBySlug, getAllPageSlugs } from '@/lib/pages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import MarkdownContent from '@/app/components/MarkdownContent';
import PageTitle from '@/app/components/PageTitle';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Disable dynamic params - only allow statically generated paths
// This ensures 404 for any unknown slugs at build time (SSG best practice)
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  
  if (!page) {
    return {};
  }
  
  // Use centralized SEO metadata from lib/seo.ts
  return getPageMetadata(page, `/${slug}/`);
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  
  if (!page) {
    notFound();
  }
  
  const path = `/${slug}/`;
  const webPageJsonLd = getWebPageJsonLd(page, path);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(page, path);
  
  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />
      
      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />
      
      <div className={`page page-${slug}`}>
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
