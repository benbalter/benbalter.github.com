import { render, screen } from '@testing-library/react';
import ReadingTime from './ReadingTime';

describe('ReadingTime', () => {
  it('should render reading time for short content', () => {
    const shortContent = 'This is a short paragraph with just a few words.';
    render(<ReadingTime content={shortContent} />);
    
    const element = screen.getByText(/min read/i);
    expect(element).toBeInTheDocument();
  });

  it('should render reading time for long content', () => {
    const longContent = 'Lorem ipsum dolor sit amet. '.repeat(200);
    render(<ReadingTime content={longContent} />);
    
    const element = screen.getByText(/min read/i);
    expect(element).toBeInTheDocument();
  });

  it('should include clock icon', () => {
    const content = 'Test content for reading time calculation.';
    const { container } = render(<ReadingTime content={content} />);
    
    const icon = container.querySelector('i.fa-clock');
    expect(icon).toBeInTheDocument();
  });

  it('should have proper CSS classes', () => {
    const content = 'Test content';
    const { container } = render(<ReadingTime content={content} />);
    
    const div = container.querySelector('div.mb-2.text-muted.small');
    expect(div).toBeInTheDocument();
  });
});
