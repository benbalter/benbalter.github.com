import { JsonLdScript } from 'next-seo';
import { getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import type { Page } from '@/lib/pages';
import PageTitle from './PageTitle';

export interface PageLayoutProps {
  /** The page data from getPageBySlug */
  page: Page;
  /** The URL path for this page (e.g., '/about/') */
  path: string;
  /** CSS class name suffix for the page container (e.g., 'about' for 'page-about') */
  pageClassName?: string;
  /** Whether to show the page title (default: true) */
  showTitle?: boolean;
  /** Additional JSON-LD data to include (e.g., PersonJsonLd for about page) */
  additionalJsonLd?: Array<{ data: object; scriptKey: string }>;
  /** Children to render inside the page layout */
  children: React.ReactNode;
}

/**
 * Shared layout component for static pages.
 * Provides consistent structure with JSON-LD, Bootstrap grid, and page title.
 * Reduces duplication across contact, talks, about, and other page components.
 */
export default function PageLayout({
  page,
  path,
  pageClassName,
  showTitle = true,
  additionalJsonLd = [],
  children,
}: PageLayoutProps) {
  const webPageJsonLd = getWebPageJsonLd(page, path);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(page, path);
  
  // Use slug as default class name if not provided
  const cssClass = pageClassName || page.slug;
  
  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />
      
      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />
      
      {/* Additional JSON-LD (e.g., Person schema for about page) */}
      {additionalJsonLd.map(({ data, scriptKey }) => (
        <JsonLdScript key={scriptKey} data={data} scriptKey={scriptKey} />
      ))}
      
      <div className={`page page-${cssClass}`}>
        <div className="row">
          <div className="col-md-10 offset-md-1">
            {showTitle && page.title && <PageTitle title={page.title} />}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
