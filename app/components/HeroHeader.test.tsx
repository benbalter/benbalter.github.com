import { render, screen } from '@testing-library/react';
import HeroHeader from './HeroHeader';

describe('HeroHeader', () => {
  it('renders with default props', () => {
    const { container } = render(<HeroHeader imageUrl="/test.jpg" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('hero-unit', 'rounded-top', 'position-relative', 'mb-3');
  });

  it('renders Next.js Image component with correct src', () => {
    render(<HeroHeader imageUrl="/test.jpg" />);
    const image = screen.getByRole('img');
    
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test.jpg'));
  });

  it('sets custom dimensions', () => {
    render(<HeroHeader imageUrl="/test.jpg" width={1200} height={450} />);
    const image = screen.getByRole('img');
    
    expect(image).toHaveAttribute('width', '1200');
    expect(image).toHaveAttribute('height', '450');
  });

  it('uses default dimensions when not specified', () => {
    render(<HeroHeader imageUrl="/test.jpg" />);
    const image = screen.getByRole('img');
    
    expect(image).toHaveAttribute('width', '1000');
    expect(image).toHaveAttribute('height', '379');
  });

  it('has priority loading enabled', () => {
    render(<HeroHeader imageUrl="/test.jpg" />);
    const image = screen.getByRole('img');
    
    // Next.js Image with priority doesn't have loading="lazy"
    expect(image).not.toHaveAttribute('loading', 'lazy');
  });

  it('includes proper alt text', () => {
    render(<HeroHeader imageUrl="/test.jpg" alt="Test header" />);
    const image = screen.getByRole('img');
    
    expect(image).toHaveAttribute('alt', 'Test header');
  });

  it('uses default alt text when not specified', () => {
    render(<HeroHeader imageUrl="/test.jpg" />);
    const image = screen.getByRole('img');
    
    expect(image).toHaveAttribute('alt', 'Header image');
  });
});
