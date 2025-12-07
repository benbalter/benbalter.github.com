import MarkdownContent from './MarkdownContent';
import type { ResumePosition as ResumePositionType } from '@/lib/resume';

interface ResumePositionProps {
  position: ResumePositionType;
}

export default async function ResumePosition({ position }: ResumePositionProps) {
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
      <MarkdownContent markdown={position.content} />
    </div>
  );
}
