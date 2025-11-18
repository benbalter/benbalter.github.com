import { getAllResumePositions, type Degree, type Certification } from '@/lib/resume';
import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';

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
  
  const positions = await getAllResumePositions();
  const degrees = page.degrees as Degree[] || [];
  const certifications = page.certifications as Certification[] || [];
  
  // Group positions by employer to match Jekyll behavior
  const groupedPositions: { employer: string; positions: typeof positions }[] = [];
  let currentEmployer = '';
  
  positions.forEach((position) => {
    if (position.employer !== currentEmployer) {
      currentEmployer = position.employer;
      groupedPositions.push({
        employer: position.employer,
        positions: [position],
      });
    } else {
      const lastGroup = groupedPositions[groupedPositions.length - 1];
      if (lastGroup) {
        lastGroup.positions.push(position);
      }
    }
  });
  
  return (
    <div className="page page-resume">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          {page.title && <h1 className="display-4 text-primary">{page.title}</h1>}
          
          <h2>Experience</h2>
          
          {groupedPositions.map((group) => (
            <div key={group.employer}>
              <h3>{group.employer}</h3>
              
              {group.positions.map((position) => (
                <div key={position.slug}>
                  <div className="row">
                    <div className="col">
                      <h4>{position.title}</h4>
                    </div>
                    <div className="col-md-4 text-end">
                      {new Date(position.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                      &mdash;
                      {position.end_date
                        ? new Date(position.end_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                          })
                        : 'Present'}
                    </div>
                  </div>
                  
                  {position.contentHtml && (
                    <div dangerouslySetInnerHTML={{ __html: position.contentHtml }} />
                  )}
                </div>
              ))}
            </div>
          ))}
          
          <h2>Education</h2>
          
          {degrees.map((degree, index) => (
            <div key={index}>
              <h3>
                <span className="h5">{degree.school}</span>
              </h3>
              
              <div className="row">
                <div className="col">
                  {degree.degree}
                </div>
                <div className="col-md-4 text-end">
                  {new Date(degree.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>
              </div>
            </div>
          ))}
          
          <h2>Certifications</h2>
          
          {certifications.map((certification, index) => (
            <div key={index}>
              <h3>
                <span className="h5">{certification.authority}</span>
              </h3>
              
              {certification.url ? (
                <a href={certification.url}>{certification.name}</a>
              ) : (
                <span>{certification.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
