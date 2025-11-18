import { getResumeData } from '@/lib/resume';
import { markdownToHtml } from '@/lib/markdown';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';

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

// Helper component for rendering a position (server component)
async function PositionItem({ position }: { position: any }) {
  const contentHtml = await markdownToHtml(position.content);
  const startDate = new Date(position.start_date);
  const endDate = position.end_date ? new Date(position.end_date) : null;
  
  return (
    <div>
      <div className="row">
        <div className="col">
          <h4>{position.title}</h4>
        </div>
        <div className="col-md-4 text-end">
          {startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          &mdash;
          {endDate ? endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Present'}
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}

export default async function ResumePage() {
  const resumeData = getResumeData();
  
  // Group positions by employer to avoid repeating employer names
  const positionsByEmployer: { [key: string]: typeof resumeData.positions } = {};
  resumeData.positions.forEach((position) => {
    if (!positionsByEmployer[position.employer]) {
      positionsByEmployer[position.employer] = [];
    }
    positionsByEmployer[position.employer]!.push(position);
  });
  
  // Get unique employers in order (maintain the order from sorted positions)
  const employers = Object.keys(positionsByEmployer);
  
  return (
    <div className="page page-resume">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <h1 className="display-4 text-primary">{resumeData.title}</h1>
          
          <h2>Experience</h2>
          {employers.map((employer) => (
            <div key={employer}>
              <h3>{employer}</h3>
              {positionsByEmployer[employer]!.map((position, index) => (
                <PositionItem 
                  key={`${employer}-${index}`}
                  position={position}
                />
              ))}
            </div>
          ))}
          
          <h2>Education</h2>
          {resumeData.degrees.map((degree, index) => {
            const date = new Date(degree.date);
            return (
              <div key={index}>
                <h3><span className="h5">{degree.school}</span></h3>
                <div className="row">
                  <div className="col">
                    {degree.degree}
                  </div>
                  <div className="col-md-4 text-end">
                    {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </div>
                </div>
              </div>
            );
          })}
          
          <h2>Certifications</h2>
          {resumeData.certifications.map((certification, index) => (
            <div key={index}>
              <h3><span className="h5">{certification.authority}</span></h3>
              {certification.url ? (
                <a href={certification.url}>{certification.name}</a>
              ) : (
                <p>{certification.name}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
