import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  const mockFooterPages = [
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
    { title: 'Resume', path: '/resume' },
  ];

  it('should render all footer pages', () => {
    render(<Footer footerPages={mockFooterPages} />);
    
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('should render RSS feed icon', () => {
    const { container } = render(<Footer footerPages={mockFooterPages} />);
    
    const rssIcon = container.querySelector('svg[data-icon="rss"]');
    expect(rssIcon).toBeInTheDocument();
  });

  it('should have correct links', () => {
    render(<Footer footerPages={mockFooterPages} />);
    
    const aboutLink = screen.getByText('About').closest('a');
    expect(aboutLink).toHaveAttribute('href', '/about');
    
    const contactLink = screen.getByText('Contact').closest('a');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  it('should have RSS feed link', () => {
    render(<Footer footerPages={mockFooterPages} />);
    
    const feedLink = screen.getByRole('link', { name: 'Atom Feed' });
    expect(feedLink).toHaveAttribute('href', '/feed.xml');
  });

  it('should render with empty pages array', () => {
    const { container } = render(<Footer footerPages={[]} />);
    
    // Should still render the RSS feed
    const rssIcon = container.querySelector('svg[data-icon="rss"]');
    expect(rssIcon).toBeInTheDocument();
  });

  it('should have proper navigation structure', () => {
    const { container } = render(<Footer footerPages={mockFooterPages} />);
    
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    
    const ul = container.querySelector('ul.nav');
    expect(ul).toBeInTheDocument();
  });
});
