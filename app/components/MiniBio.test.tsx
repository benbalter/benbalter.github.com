import { render, screen } from '@testing-library/react';
import MiniBio from './MiniBio';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, width, height }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      width={width}
      height={height}
    />
  ),
}));

describe('MiniBio', () => {
  const mockProps = {
    authorName: 'John Doe',
    githubHandle: 'johndoe',
    bioText: 'This is a test bio about the author.',
  };

  it('should render the author avatar', () => {
    render(<MiniBio {...mockProps} />);
    
    const avatar = screen.getByRole('img', { name: mockProps.authorName });
    expect(avatar).toBeInTheDocument();
  });

  it('should use correct GitHub avatar URL', () => {
    render(<MiniBio {...mockProps} />);
    
    const avatar = screen.getByRole('img', { name: mockProps.authorName });
    expect(avatar).toHaveAttribute('src', `https://github.com/${mockProps.githubHandle}.png?size=100`);
  });

  it('should render bio text', () => {
    render(<MiniBio {...mockProps} />);
    
    expect(screen.getByText(mockProps.bioText)).toBeInTheDocument();
  });

  it('should render "More about the author" link', () => {
    render(<MiniBio {...mockProps} />);
    
    const link = screen.getByRole('link', { name: /More about the author/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('should apply custom className', () => {
    const { container } = render(<MiniBio {...mockProps} className="custom-class" />);
    
    const miniBio = container.querySelector('.mini-bio');
    expect(miniBio).toHaveClass('custom-class');
  });

  it('should not apply className when not provided', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const miniBio = container.querySelector('.mini-bio');
    expect(miniBio).toHaveClass('mini-bio');
    expect(miniBio?.className).toBe('mini-bio ');
  });

  it('should set correct avatar dimensions', () => {
    render(<MiniBio {...mockProps} />);
    
    const avatar = screen.getByRole('img', { name: mockProps.authorName });
    expect(avatar).toHaveAttribute('width', '100');
    expect(avatar).toHaveAttribute('height', '100');
  });

  it('should apply avatar styling classes', () => {
    render(<MiniBio {...mockProps} />);
    
    const avatar = screen.getByRole('img', { name: mockProps.authorName });
    expect(avatar).toHaveClass('avatar');
    expect(avatar).toHaveClass('img-fluid');
    expect(avatar).toHaveClass('rounded');
  });

  it('should render with float-start layout', () => {
    const { container } = render(<MiniBio {...mockProps} />);
    
    const avatarContainer = container.querySelector('.float-start');
    expect(avatarContainer).toBeInTheDocument();
    expect(avatarContainer).toHaveClass('pt-1');
    expect(avatarContainer).toHaveClass('pe-3');
  });
});
