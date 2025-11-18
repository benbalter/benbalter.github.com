import { render, screen } from '@testing-library/react';
import PostHeader from './PostHeader';

describe('PostHeader', () => {
  it('should render the post title', () => {
    render(<PostHeader title="Test Post Title" />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Test Post Title');
  });

  it('should render as h1 element', () => {
    render(<PostHeader title="Test Post" />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.tagName).toBe('H1');
  });

  it('should apply PageTitle classes', () => {
    render(<PostHeader title="Test Post" />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('display-4', 'text-primary');
  });

  it('should handle long titles', () => {
    const longTitle = 'This is a very long post title that might wrap to multiple lines in the browser';
    render(<PostHeader title={longTitle} />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(longTitle);
  });
});
