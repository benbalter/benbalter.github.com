import { getResumeData } from '@/lib/resume';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
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
  
  return (
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
  );
}
