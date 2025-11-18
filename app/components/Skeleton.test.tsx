import { render, screen } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<Skeleton />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('placeholder-glow');
  });

  it('renders with custom width and height', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveStyle({ width: '50%', height: '2rem' });
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="mb-3" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveClass('placeholder-glow', 'mb-3');
  });

  it('has proper styling for loading state', () => {
    const { container } = render(<Skeleton />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveStyle({ 
      backgroundColor: '#e9ecef',
      borderRadius: '0.25rem'
    });
  });
});
