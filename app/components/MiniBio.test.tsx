import { render, screen } from '@testing-library/react';
import MiniBio from './MiniBio';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('MiniBio', () => {
  const mockProps = {
    authorName: 'Ben Balter',
    githubHandle: 'benbalter',
    bioText: 'Ben is a software developer and open source advocate.',
  };

  it('should render bio text', () => {
    render(<MiniBio {...mockProps} />);
    
    expect(screen.getByText(/Ben is a software developer/)).toBeInTheDocument();
  });

  it('should render avatar image', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://github.com/benbalter.png?size=100');
    expect(img).toHaveAttribute('alt', 'Ben Balter');
  });

  it('should render link to about page', () => {
    render(<MiniBio {...mockProps} />);
    
    const link = screen.getByText(/More about the author/);
    expect(link.closest('a')).toHaveAttribute('href', '/about/');
  });

  it('should have correct avatar dimensions', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });

  it('should apply custom className when provided', () => {
    const { container } = render(<MiniBio {...mockProps} className="custom-class" />);
    
    const miniBio = container.querySelector('.mini-bio');
    expect(miniBio).toHaveClass('mini-bio', 'custom-class');
  });

  it('should render without custom className', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const miniBio = container.querySelector('.mini-bio');
    expect(miniBio).toBeInTheDocument();
  });

  it('should have avatar with rounded class', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const img = container.querySelector('img');
    expect(img).toHaveClass('avatar', 'img-fluid', 'rounded');
  });
});
