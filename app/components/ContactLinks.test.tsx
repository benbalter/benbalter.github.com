import { render, screen } from '@testing-library/react';
import ContactLinks from './ContactLinks';

// Mock the config module
jest.mock('@/lib/config', () => ({
  getContactLinks: jest.fn(() => [
    {
      name: 'Email',
      url: 'mailto:ben@balter.com',
      icon: 'fa-solid fa-envelope',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/benbalter',
      icon: 'fa-brands fa-github',
    },
  ]),
  getPgpKey: jest.fn(() => '07C6 73FB F30E 01C0 C342 7AB8 DBB6 7C24 6AD3 56C4'),
}));

describe('ContactLinks', () => {
  it('renders contact links with correct URLs', () => {
    render(<ContactLinks />);
    
    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:ben@balter.com');
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/benbalter');
  });

  it('applies correct accessibility attributes', () => {
    render(<ContactLinks />);
    
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      if (link.getAttribute('href') !== '/key.asc') {
        expect(link).toHaveAttribute('rel', 'me noopener');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('data-proofer-ignore', 'true');
      }
    });
  });

  it('renders FontAwesome icons with correct classes', () => {
    const { container } = render(<ContactLinks />);
    
    const emailIcon = container.querySelector('.fa-solid.fa-envelope');
    expect(emailIcon).toBeInTheDocument();
    expect(emailIcon).toHaveClass('fa-2x');
    
    const githubIcon = container.querySelector('.fa-brands.fa-github');
    expect(githubIcon).toBeInTheDocument();
    expect(githubIcon).toHaveClass('fa-2x');
  });

  it('renders PGP key link when available', () => {
    render(<ContactLinks />);
    
    const pgpLink = screen.getByRole('link', { name: /PGP:/i });
    expect(pgpLink).toHaveAttribute('href', '/key.asc');
    expect(pgpLink).toHaveTextContent('07C6 73FB F30E 01C0 C342 7AB8 DBB6 7C24 6AD3 56C4');
  });

  it('renders with text-center class for centering', () => {
    const { container } = render(<ContactLinks />);
    
    const wrapper = container.querySelector('.text-center');
    expect(wrapper).toBeInTheDocument();
  });

  it('uses Bootstrap grid classes for responsive layout', () => {
    const { container } = render(<ContactLinks />);
    
    const row = container.querySelector('.row.justify-content-center');
    expect(row).toBeInTheDocument();
    
    const cols = container.querySelectorAll('.col-sm');
    expect(cols.length).toBeGreaterThan(0);
  });
});
