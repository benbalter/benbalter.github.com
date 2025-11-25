import { getResumeData } from '@/lib/resume';
import type { Metadata } from 'next';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import ResumeExperience from '@/app/components/ResumeExperience';
import ResumeEducation from '@/app/components/ResumeEducation';
import ResumeCertifications from '@/app/components/ResumeCertifications';

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
            <h1 className="display-4 text-primary">{pageData.title}</h1>
            
            <ResumeExperience positions={pageData.positions} />
            <ResumeEducation degrees={pageData.degrees} />
            <ResumeCertifications certifications={pageData.certifications} />
          </div>
        </div>
      </div>
    </>
  );
}
