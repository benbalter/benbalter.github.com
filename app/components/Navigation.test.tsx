import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

describe('Navigation', () => {
  const mockNavPages = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Resume', path: '/resume' },
  ];

  const mockProps = {
    title: 'Test Site',
    description: 'A test site description',
    navPages: mockNavPages,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the site title', () => {
    render(<Navigation {...mockProps} />);
    
    const titleLink = screen.getByRole('link', { name: mockProps.title });
    expect(titleLink).toBeInTheDocument();
  });

  it('should link title to home page', () => {
    render(<Navigation {...mockProps} />);
    
    const titleLink = screen.getByRole('link', { name: mockProps.title });
    expect(titleLink).toHaveAttribute('href', '/');
  });

  it('should render site description', () => {
    render(<Navigation {...mockProps} />);
    
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('should render all navigation pages', () => {
    render(<Navigation {...mockProps} />);
    
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    render(<Navigation {...mockProps} />);
    
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).toHaveAttribute('href', '/about');
    
    const resumeLink = screen.getByRole('link', { name: 'Resume' });
    expect(resumeLink).toHaveAttribute('href', '/resume');
  });

  it('should mark active page', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/about');
    
    render(<Navigation {...mockProps} />);
    
    const aboutLink = screen.getByRole('link', { name: 'About' });
    expect(aboutLink).toHaveClass('active');
  });

  it('should not mark inactive pages as active', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/about');
    
    render(<Navigation {...mockProps} />);
    
    const resumeLink = screen.getByRole('link', { name: 'Resume' });
    expect(resumeLink).not.toHaveClass('active');
  });

  it('should render mobile menu toggle button', () => {
    render(<Navigation {...mockProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should apply Bootstrap navbar classes', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const navbar = container.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveClass('navbar-expand-md');
    expect(navbar).toHaveClass('bg-secondary-subtle');
  });

  it('should apply brand styling', () => {
    render(<Navigation {...mockProps} />);
    
    const titleLink = screen.getByRole('link', { name: mockProps.title });
    expect(titleLink).toHaveClass('navbar-brand');
    expect(titleLink).toHaveClass('fw-bold');
  });

  it('should have collapsible navigation', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const collapse = container.querySelector('#navbar');
    expect(collapse).toBeInTheDocument();
    expect(collapse).toHaveClass('collapse');
    expect(collapse).toHaveClass('navbar-collapse');
  });

  it('should render with navigation role', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const nav = container.querySelector('[role="navigation"]');
    expect(nav).toBeInTheDocument();
  });

  it('should render empty pages array', () => {
    render(<Navigation {...mockProps} navPages={[]} />);
    
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });
});
