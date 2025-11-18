import { render, screen } from '@testing-library/react';
import EditButton from './EditButton';

describe('EditButton', () => {
  const mockEditUrl = 'https://github.com/user/repo/edit/main/_posts/2024-01-01-test.md';
  const mockPostSlug = '2024-01-01-test';

  it('should render the edit button', () => {
    render(<EditButton editUrl={mockEditUrl} postSlug={mockPostSlug} />);
    
    expect(screen.getByRole('link', { name: 'Edit' })).toBeInTheDocument();
  });

  it('should have correct link href', () => {
    render(<EditButton editUrl={mockEditUrl} postSlug={mockPostSlug} />);
    
    const link = screen.getByRole('link', { name: 'Edit' });
    expect(link).toHaveAttribute('href', mockEditUrl);
  });

  it('should display help text', () => {
    render(<EditButton editUrl={mockEditUrl} postSlug={mockPostSlug} />);
    
    expect(screen.getByText('This page is open source. Please help improve it.')).toBeInTheDocument();
  });

  it('should have descriptive title attribute', () => {
    render(<EditButton editUrl={mockEditUrl} postSlug={mockPostSlug} />);
    
    const link = screen.getByRole('link', { name: 'Edit' });
    expect(link).toHaveAttribute('title', `Help improve article ${mockPostSlug}.md`);
  });

  it('should apply Bootstrap button classes', () => {
    render(<EditButton editUrl={mockEditUrl} postSlug={mockPostSlug} />);
    
    const button = screen.getByRole('link', { name: 'Edit' });
    expect(button).toHaveClass('btn');
    expect(button).toHaveClass('btn-outline-primary');
    // Note: Component has both btn-lg and btn-sm classes (contradictory but matches actual implementation)
    expect(button).toHaveClass('btn-lg');
    expect(button).toHaveClass('btn-sm');
  });

  it('should render in column layout', () => {
    const { container } = render(<EditButton editUrl={mockEditUrl} postSlug={mockPostSlug} />);
    
    const column = container.querySelector('.col-lg-2');
    expect(column).toBeInTheDocument();
    expect(column).toHaveClass('text-center');
    expect(column).toHaveClass('pb-3');
  });
});
