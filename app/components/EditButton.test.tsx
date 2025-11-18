import { render, screen } from '@testing-library/react';
import EditButton from './EditButton';

describe('EditButton', () => {
  const mockProps = {
    editUrl: 'https://github.com/benbalter/benbalter.github.com/edit/main/_posts/2024-01-01-test-post.md',
    postSlug: '2024-01-01-test-post',
  };

  it('should render the edit button', () => {
    render(<EditButton {...mockProps} />);
    
    const button = screen.getByRole('link', { name: /edit/i });
    expect(button).toBeInTheDocument();
  });

  it('should have correct link href', () => {
    render(<EditButton {...mockProps} />);
    
    const button = screen.getByRole('link', { name: /edit/i });
    expect(button).toHaveAttribute('href', mockProps.editUrl);
  });

  it('should have correct title attribute', () => {
    render(<EditButton {...mockProps} />);
    
    const button = screen.getByRole('link', { name: /edit/i });
    expect(button).toHaveAttribute('title', `Help improve article ${mockProps.postSlug}.md`);
  });

  it('should have Bootstrap button classes', () => {
    render(<EditButton {...mockProps} />);
    
    const button = screen.getByRole('link', { name: /edit/i });
    // Note: Component currently has both btn-lg and btn-sm which are conflicting classes
    // Testing actual behavior - both classes are present in the component
    expect(button).toHaveClass('btn', 'btn-outline-primary', 'btn-lg', 'btn-sm');
  });

  it('should display help text', () => {
    render(<EditButton {...mockProps} />);
    
    expect(screen.getByText(/This page is open source/i)).toBeInTheDocument();
    expect(screen.getByText(/Please help improve it/i)).toBeInTheDocument();
  });

  it('should render in a column layout', () => {
    const { container } = render(<EditButton {...mockProps} />);
    
    const column = container.querySelector('.col-lg-2');
    expect(column).toBeInTheDocument();
    expect(column).toHaveClass('text-center', 'pb-3');
  });
});
