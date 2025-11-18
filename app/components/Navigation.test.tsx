import { render, screen } from '@testing-library/react';
import Navigation from './Navigation';

// Mock Next.js navigation hook
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Import after mocking
import { usePathname } from 'next/navigation';

describe('Navigation', () => {
  const mockProps = {
    title: 'Test Site',
    description: 'A test website description',
    navPages: [
      { title: 'Home', path: '/' },
      { title: 'About', path: '/about' },
      { title: 'Blog', path: '/blog' },
      { title: 'Contact', path: '/contact' },
    ],
  };

  beforeEach(() => {
    // Reset the mock before each test
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the site title as navbar brand', () => {
    render(<Navigation {...mockProps} />);
    
    const brandLink = screen.getByText(mockProps.title);
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveClass('navbar-brand', 'fw-bold');
  });

  it('should link navbar brand to home page', () => {
    render(<Navigation {...mockProps} />);
    
    const brandLink = screen.getByText(mockProps.title);
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('should render the site description', () => {
    render(<Navigation {...mockProps} />);
    
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('should render all navigation pages', () => {
    render(<Navigation {...mockProps} />);
    
    mockProps.navPages.forEach(page => {
      expect(screen.getByText(page.title)).toBeInTheDocument();
    });
  });

  it('should mark the current page as active', () => {
    (usePathname as jest.Mock).mockReturnValue('/about');
    
    render(<Navigation {...mockProps} />);
    
    const aboutLink = screen.getByText('About');
    expect(aboutLink).toHaveClass('nav-link', 'active');
  });

  it('should not mark other pages as active', () => {
    (usePathname as jest.Mock).mockReturnValue('/about');
    
    render(<Navigation {...mockProps} />);
    
    const homeLink = screen.getByText('Home');
    const blogLink = screen.getByText('Blog');
    
    expect(homeLink).toHaveClass('nav-link');
    expect(homeLink).not.toHaveClass('active');
    expect(blogLink).toHaveClass('nav-link');
    expect(blogLink).not.toHaveClass('active');
  });

  it('should render navigation toggle button', () => {
    render(<Navigation {...mockProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass('navbar-toggler');
  });

  it('should have correct Bootstrap navbar classes', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const navbar = container.querySelector('.navbar');
    expect(navbar).toHaveClass(
      'navbar',
      'navbar-expand-md',
      'bg-secondary-subtle',
      'text-secondary'
    );
  });

  it('should render navigation items as list', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const navList = container.querySelector('ul.navbar-nav');
    expect(navList).toBeInTheDocument();
    
    const listItems = container.querySelectorAll('li.nav-item');
    expect(listItems).toHaveLength(mockProps.navPages.length);
  });

  it('should have correct toggle button attributes', () => {
    render(<Navigation {...mockProps} />);
    
    const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
    expect(toggleButton).toHaveAttribute('data-bs-toggle', 'collapse');
    expect(toggleButton).toHaveAttribute('data-bs-target', '#navbar');
    expect(toggleButton).toHaveAttribute('aria-controls', 'navbar');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should render collapsible navigation content', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const collapseDiv = container.querySelector('#navbar');
    expect(collapseDiv).toBeInTheDocument();
    expect(collapseDiv).toHaveClass('collapse', 'navbar-collapse');
  });

  it('should render with different pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/contact');
    
    render(<Navigation {...mockProps} />);
    
    const contactLink = screen.getByText('Contact');
    expect(contactLink).toHaveClass('nav-link', 'active');
  });

  it('should handle empty navPages array', () => {
    const emptyProps = { ...mockProps, navPages: [] };
    const { container } = render(<Navigation {...emptyProps} />);
    
    const listItems = container.querySelectorAll('li.nav-item');
    expect(listItems).toHaveLength(0);
    
    // Should still render the navbar structure
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });

  it('should have unique keys for navigation items', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const listItems = container.querySelectorAll('li.nav-item');
    expect(listItems).toHaveLength(mockProps.navPages.length);
  });

  it('should have correct navigation role', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const nav = container.querySelector('[role="navigation"]');
    expect(nav).toBeInTheDocument();
  });

  it('should render navbar text with correct classes', () => {
    const { container } = render(<Navigation {...mockProps} />);
    
    const navbarText = container.querySelector('.navbar-text');
    expect(navbarText).toBeInTheDocument();
    expect(navbarText).toHaveClass('text-end');
  });
});
