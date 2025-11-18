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

interface EducationSectionProps {
  degrees: Degree[];
}

interface CertificationsSectionProps {
  certifications: Certification[];
}

export function EducationSection({ degrees }: EducationSectionProps) {
  return (
    <>
      {degrees.map((degree, index) => {
        const formattedDate = new Date(degree.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });

        return (
          <div key={index}>
            <h3>
              <span className="h5">{degree.school}</span>
            </h3>
            
            <div className="row">
              <div className="col">
                {degree.degree}
              </div>
              <div className="col-md-4 text-end">
                {formattedDate}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <>
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
    </>
  );
}
