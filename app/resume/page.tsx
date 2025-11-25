import { getResumeData } from '@/lib/resume';
import { getPageBySlug } from '@/lib/pages';
import { markdownToHtml } from '@/lib/markdown';
import type { Metadata } from 'next';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import PageTitle from '@/app/components/PageTitle';

const PAGE_PATH = '/resume/';

/**
 * Helper to get resume page data for SEO
 * Consolidates data retrieval to avoid duplicate calls
 */
function getResumePageData() {
  const resumeData = getResumeData();
  return {
    slug: 'resume',
    title: resumeData.title,
    description: resumeData.description,
    content: '',
    // Include full resume data for component rendering
    ...resumeData,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const pageData = getResumePageData();
  return getPageMetadata(pageData, PAGE_PATH);
}

export default async function ResumePage() {
  const pageData = getResumePageData();
  
  // Get the resume page content from markdown
  const page = getPageBySlug('resume');
  
  // Render the markdown content with Liquid processing and collections
  // This enables Jekyll-like experience with {% for position in site.resume_positions %}
  const contentHtml = page ? await markdownToHtml(
    page.content,
    {
      // Pass frontmatter data for page.degrees, page.certifications, etc.
      ...pageData,
      path: 'content/pages/resume.md',
    },
    { loadCollections: true },
  ) : '';
  
  const webPageJsonLd = getWebPageJsonLd(pageData, PAGE_PATH);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(pageData, PAGE_PATH);
  
  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />
      
      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />
      
      <div className="page page-resume">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <PageTitle title={pageData.title || 'Resume'} />
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>
        </div>
      </div>
    </>
  );
}
