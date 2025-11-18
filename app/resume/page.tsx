import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import ResumePositions from '@/app/components/ResumePositions';
import { EducationSection, CertificationsSection } from '@/app/components/ResumeEducation';

interface Degree {
  school: string;
  degree: string;
  date: string;
}

interface Certification {
  authority: string;
  name: string;
  url?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('resume');
  
  if (!page) {
    return {};
  }
  
  return getPageMetadata(page, '/resume/');
}

export default async function ResumePage() {
  const page = getPageBySlug('resume');
  
  if (!page) {
    notFound();
  }
  
  const degrees = page.degrees as Degree[] || [];
  const certifications = page.certifications as Certification[] || [];
  
  return (
    <div className="page page-resume">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <h1 className="display-4 text-primary">{page.title}</h1>
          
          <h2>Experience</h2>
          <ResumePositions />
          
          <h2>Education</h2>
          <EducationSection degrees={degrees} />
          
          <h2>Certifications</h2>
          <CertificationsSection certifications={certifications} />
        </div>
      </div>
    </div>
  );
}
