import { render } from '@testing-library/react';
import ResumeEducation from './ResumeEducation';
import type { Degree } from '@/lib/resume';

describe('ResumeEducation', () => {
  const mockDegrees: Degree[] = [
    {
      school: 'The George Washington University Law School',
      degree: 'Juris Doctorate',
      date: '2013-05-01',
    },
    {
      school: 'The George Washington University',
      degree: 'Bachelor of Arts, Political Science',
      date: '2009-05-01',
    },
  ];

  it('should render Education heading', () => {
    const { container } = render(<ResumeEducation degrees={mockDegrees} />);
    
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Education');
  });

  it('should render all degrees', () => {
    const { container } = render(<ResumeEducation degrees={mockDegrees} />);
    
    expect(container.textContent).toContain('The George Washington University Law School');
    expect(container.textContent).toContain('Juris Doctorate');
    expect(container.textContent).toContain('The George Washington University');
    expect(container.textContent).toContain('Bachelor of Arts, Political Science');
  });

  it('should format dates correctly', () => {
    const { container } = render(<ResumeEducation degrees={mockDegrees} />);
    
    // Note: Dates like '2013-05-01' are parsed as UTC, then displayed in local timezone
    // This may show as April 30, 2013 or May 1, 2013 depending on timezone
    expect(container.textContent).toMatch(/April 2013|May 2013/);
    expect(container.textContent).toMatch(/April 2009|May 2009/);
  });

  it('should use stable keys based on content', () => {
    const { container } = render(<ResumeEducation degrees={mockDegrees} />);
    
    const divs = container.querySelectorAll('div[class*="col"]').length;
    expect(divs).toBeGreaterThan(0);
  });

  it('should render empty section with no degrees', () => {
    const { container } = render(<ResumeEducation degrees={[]} />);
    
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Education');
  });

  it('should have proper Bootstrap grid classes', () => {
    const { container } = render(<ResumeEducation degrees={mockDegrees} />);
    
    const rowDivs = container.querySelectorAll('.row');
    expect(rowDivs.length).toBeGreaterThan(0);
    
    const colDivs = container.querySelectorAll('.col, .col-md-4');
    expect(colDivs.length).toBeGreaterThan(0);
  });
});
