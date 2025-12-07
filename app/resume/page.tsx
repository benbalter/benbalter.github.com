import { getResumeData } from '@/lib/resume';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import PageLayout from '@/app/components/PageLayout';
import ResumePosition from '@/app/components/ResumePosition';

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
  const resumeData = getResumeData();
  
  // Group positions by employer for display
  const sortedPositions = [...resumeData.positions].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
  
  // Group positions by employer while maintaining sort order
  let previousEmployer = '';
  const positionsWithEmployerBreaks = sortedPositions.map(position => ({
    ...position,
    showEmployer: position.employer !== previousEmployer,
    _employer: (previousEmployer = position.employer),
  }));
  
  return (
    <PageLayout page={pageData} path={PAGE_PATH}>
      <h2>Experience</h2>
      
      {positionsWithEmployerBreaks.map((position, index) => (
        <div key={`${position.employer}-${position.title}-${index}`}>
          {position.showEmployer && (
            <h3>{position.employer}</h3>
          )}
          <ResumePosition position={position} />
        </div>
      ))}
      
      <h2>Education</h2>
      
      {resumeData.degrees.map((degree, index) => (
        <div key={`${degree.school}-${index}`}>
          <h3><span className="h5">{degree.school}</span></h3>
          <div className="row">
            <div className="col">
              {degree.degree}
            </div>
            <div className="col-md-4 text-end">
              {new Date(degree.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
      ))}
      
      <h2>Certifications</h2>
      
      {resumeData.certifications.map((certification, index) => (
        <div key={`${certification.authority}-${index}`}>
          <h3><span className="h5">{certification.authority}</span></h3>
          {certification.url ? (
            <a href={certification.url}>{certification.name}</a>
          ) : (
            certification.name
          )}
        </div>
      ))}
    </PageLayout>
  );
}
