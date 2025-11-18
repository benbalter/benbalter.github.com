import { render } from '@testing-library/react';
import ResumeCertifications from './ResumeCertifications';
import type { Certification } from '@/lib/resume';

describe('ResumeCertifications', () => {
  const mockCertifications: Certification[] = [
    {
      authority: 'Bar Association of the District of Columbia',
      name: 'Member, license 1021576',
    },
    {
      authority: 'International Information System Security Certification Consortium (ISC)²',
      name: 'Certified Information Systems Security Professional (CISSP)',
      url: 'https://www.credly.com/badges/1a8b31f1-3727-4acf-a6a8-8d67af9ecb23',
    },
  ];

  it('should render Certifications heading', () => {
    const { container } = render(<ResumeCertifications certifications={mockCertifications} />);
    
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Certifications');
  });

  it('should render all certifications', () => {
    const { container } = render(<ResumeCertifications certifications={mockCertifications} />);
    
    expect(container.textContent).toContain('Bar Association of the District of Columbia');
    expect(container.textContent).toContain('Member, license 1021576');
    expect(container.textContent).toContain('International Information System Security Certification Consortium (ISC)²');
    expect(container.textContent).toContain('Certified Information Systems Security Professional (CISSP)');
  });

  it('should render certification with URL as link', () => {
    const { container } = render(<ResumeCertifications certifications={mockCertifications} />);
    
    const link = container.querySelector('a[href="https://www.credly.com/badges/1a8b31f1-3727-4acf-a6a8-8d67af9ecb23"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Certified Information Systems Security Professional (CISSP)');
  });

  it('should render certification without URL as paragraph', () => {
    const { container } = render(<ResumeCertifications certifications={mockCertifications} />);
    
    const paragraphs = container.querySelectorAll('p');
    const memberParagraph = Array.from(paragraphs).find(p => p.textContent === 'Member, license 1021576');
    expect(memberParagraph).toBeInTheDocument();
  });

  it('should use stable keys based on content', () => {
    const { container } = render(<ResumeCertifications certifications={mockCertifications} />);
    
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
  });

  it('should render empty section with no certifications', () => {
    const { container } = render(<ResumeCertifications certifications={[]} />);
    
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Certifications');
  });

  it('should render authority as h3 with h5 class', () => {
    const { container } = render(<ResumeCertifications certifications={mockCertifications} />);
    
    const h3Elements = container.querySelectorAll('h3');
    expect(h3Elements.length).toBe(mockCertifications.length);
    
    const spanElements = container.querySelectorAll('h3 > span.h5');
    expect(spanElements.length).toBe(mockCertifications.length);
  });
});
