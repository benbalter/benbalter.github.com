import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock Next.js usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Navigation', () => {
  const mockProps = {
    title: 'Ben Balter',
    description: 'A developer and open source advocate',
    navPages: [
      { title: 'About', path: '/about' },
      { title: 'Resume', path: '/resume' },
      { title: 'Talks', path: '/talks' },
    ],
  };

  beforeEach(() => {
    // Reset the mock before each test
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/');
  });

  it('should render site title', () => {
    render(<Navigation {...mockProps} />);
    
    expect(screen.getByText('Ben Balter')).toBeInTheDocument();
  });

  it('should render description', () => {
    render(<Navigation {...mockProps} />);
    
    expect(screen.getByText('A developer and open source advocate')).toBeInTheDocument();
  });

  it('should render all navigation pages', () => {
    render(<Navigation {...mockProps} />);
    
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Talks')).toBeInTheDocument();
  });

  it('should have correct links for navigation pages', () => {
    render(<Navigation {...mockProps} />);
    
    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveAttribute('href', '/about');
    
    const resumeLink = screen.getByText('Resume').closest('a');
    expect(resumeLink).toHaveAttribute('href', '/resume');
  });

  it('should mark current page as active', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/about');
    
    render(<Navigation {...mockProps} />);
    
    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveClass('nav-link', 'active');
  });

  it('should not mark non-current pages as active', () => {
    const { usePathname } = require('next/navigation');
    usePathname.mockReturnValue('/about');
    
    render(<Navigation {...mockProps} />);
    
    const resumeLink = screen.getByText('Resume').closest('a');
    expect(resumeLink).toHaveClass('nav-link');
    expect(resumeLink).not.toHaveClass('active');
  });

  it('should have navbar toggler button', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const toggler = container.querySelector('.navbar-toggler');
    expect(toggler).toBeInTheDocument();
    expect(toggler).toHaveAttribute('data-bs-toggle', 'collapse');
    expect(toggler).toHaveAttribute('data-bs-target', '#navbar');
  });

  it('should have proper aria attributes on toggler', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const toggler = container.querySelector('.navbar-toggler');
    expect(toggler).toHaveAttribute('aria-controls', 'navbar');
    expect(toggler).toHaveAttribute('aria-expanded', 'false');
    expect(toggler).toHaveAttribute('aria-label', 'Toggle navigation');
  });

  it('should link site title to home page', () => {
    render(<Navigation {...mockProps} />);
    
    const titleLink = screen.getByText('Ben Balter').closest('a');
    expect(titleLink).toHaveAttribute('href', '/');
    expect(titleLink).toHaveClass('navbar-brand');
  });

  it('should have navigation role', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const nav = container.querySelector('[role="navigation"]');
    expect(nav).toBeInTheDocument();
  });
});
