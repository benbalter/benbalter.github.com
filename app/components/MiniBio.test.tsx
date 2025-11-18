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

describe('MiniBio', () => {
  const mockProps = {
    authorName: 'Ben Balter',
    githubHandle: 'benbalter',
    bioText: 'Senior Director at GitHub. Passionate about open source and government.',
  };

  it('should render author avatar', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', `https://github.com/${mockProps.githubHandle}.png?size=100`);
  });

  it('should have correct avatar alt text', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', mockProps.authorName);
  });

  it('should render bio text', () => {
    render(<MiniBio {...mockProps} />);
    
    expect(screen.getByText(mockProps.bioText, { exact: false })).toBeInTheDocument();
  });

  it('should render "More about" link', () => {
    render(<MiniBio {...mockProps} />);
    
    const link = screen.getByRole('link', { name: /more about the author/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('should have avatar styling classes', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const img = container.querySelector('img');
    expect(img).toHaveClass('avatar', 'img-fluid', 'rounded');
  });

  it('should have correct avatar dimensions', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });

  it('should apply custom className', () => {
    const { container } = render(<MiniBio {...mockProps} className="custom-class" />);
    
    const miniBio = container.querySelector('.mini-bio');
    expect(miniBio).toHaveClass('custom-class');
  });

  it('should have float layout for avatar', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const floatContainer = container.querySelector('.float-start');
    expect(floatContainer).toBeInTheDocument();
    expect(floatContainer?.querySelector('img')).toBeInTheDocument();
  });
});
