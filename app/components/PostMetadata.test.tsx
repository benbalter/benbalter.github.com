import { render, screen } from '@testing-library/react';
import PostMetadata from './PostMetadata';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('PostMetadata', () => {
  const mockProps = {
    publishDate: 'January 1, 2023',
    revisionHistoryUrl: 'https://github.com/benbalter/benbalter.github.com/commits/main/_posts/2023-01-01-test.md',
  };

  it('should render publish date', () => {
    render(<PostMetadata {...mockProps} />);
    
    expect(screen.getByText(/Originally published January 1, 2023/)).toBeInTheDocument();
  });

  it('should render revision history link', () => {
    render(<PostMetadata {...mockProps} />);
    
    const link = screen.getByText('View revision history');
    expect(link).toBeInTheDocument();
  });

  it('should have correct revision history link href', () => {
    render(<PostMetadata {...mockProps} />);
    
    const link = screen.getByText('View revision history').closest('a');
    expect(link).toHaveAttribute('href', mockProps.revisionHistoryUrl);
  });

  it('should open revision history in new tab', () => {
    render(<PostMetadata {...mockProps} />);
    
    const link = screen.getByText('View revision history').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('should have proper styling classes', () => {
    const { container } = render(<PostMetadata {...mockProps} />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('mb-2', 'text-muted', 'small');
  });

  it('should have secondary link styling', () => {
    render(<PostMetadata {...mockProps} />);
    
    const link = screen.getByText('View revision history').closest('a');
    expect(link).toHaveClass('link-secondary');
  });

  it('should render with different date format', () => {
    render(<PostMetadata {...mockProps} publishDate="December 25, 2022" />);
    
    expect(screen.getByText(/Originally published December 25, 2022/)).toBeInTheDocument();
  });
});
