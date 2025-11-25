import { render, screen } from '@testing-library/react';
import ContactLinks from './ContactLinks';

describe('ContactLinks', () => {
  const mockContactLinks = [
    { name: 'Email', url: 'mailto:test@example.com', icon: 'fa-solid fa-envelope' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/test', icon: 'fa-brands fa-linkedin' },
    { name: 'GitHub', url: 'https://github.com/test', icon: 'fa-brands fa-github' },
  ];

  it('should render all contact links', () => {
    render(<ContactLinks contactLinks={mockContactLinks} />);
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('should render links with correct href', () => {
    render(<ContactLinks contactLinks={mockContactLinks} />);
    
    const emailLink = screen.getByText('Email').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
    
    const linkedInLink = screen.getByText('LinkedIn').closest('a');
    expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/in/test');
  });

  it('should render PGP key when provided', () => {
    render(<ContactLinks contactLinks={mockContactLinks} pgpKey="ABCD 1234 5678 EFGH" />);
    
    expect(screen.getByText('ABCD 1234 5678 EFGH')).toBeInTheDocument();
    expect(screen.getByText('PGP:')).toBeInTheDocument();
  });

  it('should not render PGP section when pgpKey is undefined', () => {
    render(<ContactLinks contactLinks={mockContactLinks} />);
    
    expect(screen.queryByText('PGP:')).not.toBeInTheDocument();
  });

  it('should render with empty contact links', () => {
    const { container } = render(<ContactLinks contactLinks={[]} />);
    
    // Should render the container but without any links
    expect(container.querySelector('.text-center')).toBeInTheDocument();
  });

  it('should have noopener rel attribute for security', () => {
    render(<ContactLinks contactLinks={mockContactLinks} />);
    
    const link = screen.getByText('Email').closest('a');
    expect(link).toHaveAttribute('rel', 'me noopener');
  });

  it('should open links in new tab', () => {
    render(<ContactLinks contactLinks={mockContactLinks} />);
    
    const link = screen.getByText('Email').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
