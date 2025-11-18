import type { Degree } from '@/lib/resume';

interface ResumeEducationProps {
  degrees: Degree[];
}

export default function ResumeEducation({ degrees }: ResumeEducationProps) {
  return (
    <>
      <h2>Education</h2>
      {degrees.map((degree) => {
        const date = new Date(degree.date);
        return (
          <div key={`${degree.school}-${degree.degree}`}>
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
    </>
  );
}
