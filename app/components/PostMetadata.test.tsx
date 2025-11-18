import { render, screen } from '@testing-library/react';
import PostMetadata from './PostMetadata';

describe('PostMetadata', () => {
  const mockPublishDate = 'January 1, 2024';
  const mockRevisionUrl = 'https://github.com/user/repo/commits/main/_posts/2024-01-01-test.md';

  it('should render the publish date', () => {
    render(<PostMetadata publishDate={mockPublishDate} revisionHistoryUrl={mockRevisionUrl} />);
    
    expect(screen.getByText(/Originally published/)).toBeInTheDocument();
    expect(screen.getByText(/January 1, 2024/)).toBeInTheDocument();
  });

  it('should render the revision history link', () => {
    render(<PostMetadata publishDate={mockPublishDate} revisionHistoryUrl={mockRevisionUrl} />);
    
    const link = screen.getByRole('link', { name: 'View revision history' });
    expect(link).toBeInTheDocument();
  });

  it('should have correct link href', () => {
    render(<PostMetadata publishDate={mockPublishDate} revisionHistoryUrl={mockRevisionUrl} />);
    
    const link = screen.getByRole('link', { name: 'View revision history' });
    expect(link).toHaveAttribute('href', mockRevisionUrl);
  });

  it('should open link in new tab', () => {
    render(<PostMetadata publishDate={mockPublishDate} revisionHistoryUrl={mockRevisionUrl} />);
    
    const link = screen.getByRole('link', { name: 'View revision history' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
  });

  it('should apply text styling classes', () => {
    const { container } = render(<PostMetadata publishDate={mockPublishDate} revisionHistoryUrl={mockRevisionUrl} />);
    
    const metadata = container.firstChild;
    expect(metadata).toHaveClass('mb-2');
    expect(metadata).toHaveClass('text-muted');
    expect(metadata).toHaveClass('small');
  });

  it('should apply link styling', () => {
    render(<PostMetadata publishDate={mockPublishDate} revisionHistoryUrl={mockRevisionUrl} />);
    
    const link = screen.getByRole('link', { name: 'View revision history' });
    expect(link).toHaveClass('link-secondary');
  });
});
