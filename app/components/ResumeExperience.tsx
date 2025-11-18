import type { ResumePosition } from '@/lib/resume';
import ResumePositionComponent from './ResumePosition';

interface ResumeExperienceProps {
  positions: ResumePosition[];
}

export default function ResumeExperience({ positions }: ResumeExperienceProps) {
  // Group positions by employer and maintain insertion order
  const employers: string[] = [];
  const positionsByEmployer: Record<string, ResumePosition[]> = {};
  
  positions.forEach((position) => {
    if (!positionsByEmployer[position.employer]) {
      positionsByEmployer[position.employer] = [];
      employers.push(position.employer);
    }
    positionsByEmployer[position.employer]!.push(position);
  });
  
  return (
    <>
      <h2>Experience</h2>
      {employers.map((employer) => (
        <div key={employer}>
          <h3>{employer}</h3>
          {positionsByEmployer[employer]!.map((position) => (
            <ResumePositionComponent 
              key={`${position.employer}-${position.title}-${position.start_date}`}
              position={position}
            />
          ))}
        </div>
      ))}
    </>
  );
}
