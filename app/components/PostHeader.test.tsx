import { render, screen } from '@testing-library/react';
import PostHeader from './PostHeader';

describe('PostHeader', () => {
  it('should render the title', () => {
    render(<PostHeader title="Test Post Title" />);
    
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('should render with correct heading level', () => {
    render(<PostHeader title="My Post" />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('My Post');
  });

  it('should apply correct CSS classes', () => {
    render(<PostHeader title="Styled Post" />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('display-4');
    expect(heading).toHaveClass('text-primary');
  });

  it('should handle empty title', () => {
    render(<PostHeader title="" />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('');
  });

  it('should handle special characters in title', () => {
    const title = 'Special & "Characters" <Test>';
    render(<PostHeader title={title} />);
    
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('should handle long titles', () => {
    const longTitle = 'A'.repeat(200);
    render(<PostHeader title={longTitle} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });
});
