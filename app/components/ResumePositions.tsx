import { getResumePositions } from '@/lib/resume';
import { markdownToHtml } from '@/lib/markdown';

export default async function ResumePositions() {
  const positions = getResumePositions();

  const positionElements = await Promise.all(
    positions.map(async (position, index) => {
      // Determine if we should show the employer heading
      const showEmployer = index === 0 || position.employer !== positions[index - 1]?.employer;
      const contentHtml = await markdownToHtml(position.content);
      
      const startDate = new Date(position.start_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      const endDate = position.end_date 
        ? new Date(position.end_date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          })
        : 'Present';

      return (
        <div key={position.slug}>
          {showEmployer && (
            <h3>{position.employer}</h3>
          )}
          
          <div className="row">
            <div className="col">
              <h4>{position.title}</h4>
            </div>
            <div className="col-md-4 text-end">
              {startDate}&mdash;{endDate}
            </div>
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      );
    })
  );

  return <>{positionElements}</>;
}
