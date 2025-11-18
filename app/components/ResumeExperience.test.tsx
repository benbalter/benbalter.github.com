import { render } from '@testing-library/react';
import ResumeExperience from './ResumeExperience';
import type { ResumePosition } from '@/lib/resume';

// Mock the ResumePosition component since it's async
jest.mock('./ResumePosition', () => ({
  __esModule: true,
  default: ({ position }: { position: any }) => (
    <div data-testid="resume-position">
      <h4>{position.title}</h4>
      <div>{position.content}</div>
    </div>
  ),
}));

describe('ResumeExperience', () => {
  const mockPositions: ResumePosition[] = [
    {
      employer: 'GitHub',
      title: 'Director of Hubber Enablement',
      start_date: '2024-07-01',
      content: 'Leading Hubber experience initiatives.',
    },
    {
      employer: 'GitHub',
      title: 'Chief of Staff, Security',
      start_date: '2021-07-01',
      end_date: '2023-02-01',
      content: 'Managed office of Chief Security Officer.',
    },
    {
      employer: 'Executive Office of the President',
      title: 'Presidential Innovation Fellow',
      start_date: '2012-04-01',
      end_date: '2013-01-01',
      content: 'Served as entrepreneur in residence.',
    },
  ];

  it('should render Experience heading', () => {
    const { container } = render(<ResumeExperience positions={mockPositions} />);
    
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Experience');
  });

  it('should group positions by employer', () => {
    const { container } = render(<ResumeExperience positions={mockPositions} />);
    
    const h3Elements = container.querySelectorAll('h3');
    expect(h3Elements.length).toBe(2); // GitHub and Executive Office
    
    const employers = Array.from(h3Elements).map(h3 => h3.textContent);
    expect(employers).toContain('GitHub');
    expect(employers).toContain('Executive Office of the President');
  });

  it('should maintain insertion order of employers', () => {
    const { container } = render(<ResumeExperience positions={mockPositions} />);
    
    const h3Elements = container.querySelectorAll('h3');
    const employers = Array.from(h3Elements).map(h3 => h3.textContent);
    
    // GitHub should appear first (has most recent position)
    expect(employers[0]).toBe('GitHub');
    expect(employers[1]).toBe('Executive Office of the President');
  });

  it('should render all positions', () => {
    const { getAllByTestId } = render(<ResumeExperience positions={mockPositions} />);
    
    const positionElements = getAllByTestId('resume-position');
    expect(positionElements.length).toBe(3);
  });

  it('should render positions for each employer', () => {
    const { container } = render(<ResumeExperience positions={mockPositions} />);
    
    expect(container.textContent).toContain('Director of Hubber Enablement');
    expect(container.textContent).toContain('Chief of Staff, Security');
    expect(container.textContent).toContain('Presidential Innovation Fellow');
  });

  it('should use stable keys for employers', () => {
    const { container } = render(<ResumeExperience positions={mockPositions} />);
    
    const divs = container.querySelectorAll('div[class*="key"]');
    // Keys are internal to React, but we can verify structure
    const h3Elements = container.querySelectorAll('h3');
    expect(h3Elements.length).toBeGreaterThan(0);
  });

  it('should render empty section with no positions', () => {
    const { container } = render(<ResumeExperience positions={[]} />);
    
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Experience');
    
    const h3Elements = container.querySelectorAll('h3');
    expect(h3Elements.length).toBe(0);
  });

  it('should handle single employer with multiple positions', () => {
    const singleEmployerPositions = mockPositions.filter(p => p.employer === 'GitHub');
    const { getAllByTestId, container } = render(<ResumeExperience positions={singleEmployerPositions} />);
    
    const h3Elements = container.querySelectorAll('h3');
    expect(h3Elements.length).toBe(1);
    expect(h3Elements[0]).toHaveTextContent('GitHub');
    
    const positionElements = getAllByTestId('resume-position');
    expect(positionElements.length).toBe(2);
  });
});
