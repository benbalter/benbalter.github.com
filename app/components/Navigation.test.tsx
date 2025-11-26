import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock Next.js Script component
jest.mock('next/script', () => {
  return ({ id, strategy, children, ...props }: any) => {
    return <script id={id} data-strategy={strategy} {...props}>{children}</script>;
  };
});

describe('Navigation', () => {
  const mockProps = {
    title: 'Ben Balter',
    description: 'A developer and open source advocate',
    navPages: [
      { title: 'About', path: '/about/' },
      { title: 'Resume', path: '/resume/' },
      { title: 'Talks', path: '/talks/' },
    ],
  };

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
    expect(aboutLink).toHaveAttribute('href', '/about/');
    
    const resumeLink = screen.getByText('Resume').closest('a');
    expect(resumeLink).toHaveAttribute('href', '/resume/');
  });

  it('should have data-nav-path attributes for active link detection', () => {
    render(<Navigation {...mockProps} />);
    
    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveAttribute('data-nav-path', '/about/');
    
    const resumeLink = screen.getByText('Resume').closest('a');
    expect(resumeLink).toHaveAttribute('data-nav-path', '/resume/');
    
    const talksLink = screen.getByText('Talks').closest('a');
    expect(talksLink).toHaveAttribute('data-nav-path', '/talks/');
    expect(aboutLink).toHaveAttribute('data-nav-path', '/about');
    
    const resumeLink = screen.getByText('Resume').closest('a');
    expect(resumeLink).toHaveAttribute('data-nav-path', '/resume');
    
    const talksLink = screen.getByText('Talks').closest('a');
    expect(talksLink).toHaveAttribute('data-nav-path', '/talks');
  });

  it('should render Next.js Script component for client-side active link detection', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('id', 'nav-active-script');
    expect(script).toHaveAttribute('data-strategy', 'afterInteractive');
    expect(script?.innerHTML).toContain('window.location.pathname');
    expect(script?.innerHTML).toContain('data-nav-path');
    expect(script?.innerHTML).toContain('classList.add');
  });

  it('should not have active class on server render (added client-side)', () => {
    render(<Navigation {...mockProps} />);
    
    const resumeLink = screen.getByText('Resume').closest('a');
    expect(resumeLink).toHaveClass('nav-link');
    expect(resumeLink).not.toHaveClass('active');
    
    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveClass('nav-link');
    expect(aboutLink).not.toHaveClass('active');
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
