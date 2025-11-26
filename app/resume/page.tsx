import { getResumeData } from '@/lib/resume';
import { getPageBySlug } from '@/lib/pages';
import { markdownToHtml } from '@/lib/markdown';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import PageLayout from '@/app/components/PageLayout';

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
      path: 'resume.md',
    },
    { loadCollections: true },
  ) : '<p>Resume content could not be loaded.</p>';
  
  return (
    <PageLayout page={pageData} path={PAGE_PATH}>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </PageLayout>
  );
}
