import type { Certification } from '@/lib/resume';

interface ResumeCertificationsProps {
  certifications: Certification[];
}

export default function ResumeCertifications({ certifications }: ResumeCertificationsProps) {
  return (
    <>
      <h2>Certifications</h2>
      {certifications.map((certification) => (
        <div key={`${certification.authority}-${certification.name}`}>
          <h3><span className="h5">{certification.authority}</span></h3>
          {certification.url ? (
            <a href={certification.url}>{certification.name}</a>
          ) : (
            <p>{certification.name}</p>
          )}
        </div>
      ))}
    </>
  );
}
