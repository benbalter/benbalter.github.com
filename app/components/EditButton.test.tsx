import { render, screen } from '@testing-library/react';
import EditButton from './EditButton';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('EditButton', () => {
  const mockProps = {
    editUrl: 'https://github.com/benbalter/benbalter.github.com/edit/main/_posts/2023-01-01-test.md',
    postSlug: '2023-01-01-test',
  };

  it('should render edit button', () => {
    render(<EditButton {...mockProps} />);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should render help text', () => {
    render(<EditButton {...mockProps} />);
    
    expect(screen.getByText(/This page is open source/)).toBeInTheDocument();
    expect(screen.getByText(/Please help improve it/)).toBeInTheDocument();
  });

  it('should have correct link href', () => {
    render(<EditButton {...mockProps} />);
    
    const link = screen.getByText('Edit').closest('a');
    expect(link).toHaveAttribute('href', mockProps.editUrl);
  });

  it('should have correct title attribute', () => {
    render(<EditButton {...mockProps} />);
    
    const link = screen.getByText('Edit').closest('a');
    expect(link).toHaveAttribute('title', `Help improve article ${mockProps.postSlug}.md`);
  });

  it('should have button styling classes', () => {
    render(<EditButton {...mockProps} />);
    
    const link = screen.getByText('Edit').closest('a');
    expect(link).toHaveClass('btn', 'btn-outline-primary', 'btn-lg', 'btn-sm');
  });

  it('should render in a column layout', () => {
    const { container } = render(<EditButton {...mockProps} />);
    
    const column = container.querySelector('.col-lg-2');
    expect(column).toBeInTheDocument();
  });
});
