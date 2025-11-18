import { render, screen } from '@testing-library/react';
import PostMetadata from './PostMetadata';

describe('PostMetadata', () => {
  const mockProps = {
    publishDate: 'January 15, 2024',
    revisionHistoryUrl: 'https://github.com/benbalter/benbalter.github.com/commits/main/_posts/2024-01-15-test-post.md',
  };

  it('should render the publish date', () => {
    render(<PostMetadata {...mockProps} />);
    
    expect(screen.getByText(/Originally published/i)).toBeInTheDocument();
    expect(screen.getByText(/January 15, 2024/i)).toBeInTheDocument();
  });

  it('should render the revision history link', () => {
    render(<PostMetadata {...mockProps} />);
    
    const link = screen.getByRole('link', { name: /view revision history/i });
    expect(link).toBeInTheDocument();
  });

  it('should have correct link href', () => {
    render(<PostMetadata {...mockProps} />);
    
    const link = screen.getByRole('link', { name: /view revision history/i });
    expect(link).toHaveAttribute('href', mockProps.revisionHistoryUrl);
  });

  it('should open link in new tab', () => {
    render(<PostMetadata {...mockProps} />);
    
    const link = screen.getByRole('link', { name: /view revision history/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('should have metadata styling classes', () => {
    const { container } = render(<PostMetadata {...mockProps} />);
    
    const metadataDiv = container.firstChild;
    expect(metadataDiv).toHaveClass('mb-2', 'text-muted', 'small');
  });

  it('should have secondary link style', () => {
    render(<PostMetadata {...mockProps} />);
    
    const link = screen.getByRole('link', { name: /view revision history/i });
    expect(link).toHaveClass('link-secondary');
  });
});
