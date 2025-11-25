import { getResumeData } from '@/lib/resume';
import type { Metadata } from 'next';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import ResumeExperience from '@/app/components/ResumeExperience';
import ResumeEducation from '@/app/components/ResumeEducation';
import ResumeCertifications from '@/app/components/ResumeCertifications';

export async function generateMetadata(): Promise<Metadata> {
  const resumeData = getResumeData();
  
  // Use centralized SEO metadata from lib/seo.ts
  return getPageMetadata({
    slug: 'resume',
    title: resumeData.title,
    description: resumeData.description,
    content: '', // Not used for metadata generation
  }, '/resume/');
}

export default async function ResumePage() {
  const resumeData = getResumeData();
  
  const page = {
    slug: 'resume',
    title: resumeData.title,
    description: resumeData.description,
    content: '',
  };
  const path = '/resume/';
  const webPageJsonLd = getWebPageJsonLd(page, path);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(page, path);
  
  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />
      
      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />
      
      <div className="page page-resume">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h1 className="display-4 text-primary">{resumeData.title}</h1>
            
            <ResumeExperience positions={resumeData.positions} />
            <ResumeEducation degrees={resumeData.degrees} />
            <ResumeCertifications certifications={resumeData.certifications} />
          </div>
        </div>
      </div>
    </>
  );
}
