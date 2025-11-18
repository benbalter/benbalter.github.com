import { render, screen } from '@testing-library/react';
import HeroHeader from './HeroHeader';

describe('HeroHeader', () => {
  it('renders with default props', () => {
    const { container } = render(<HeroHeader imageUrl="/test.jpg" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('hero-unit', 'rounded-top', 'position-relative', 'mb-3');
  });

  it('sets background image from imageUrl prop', () => {
    const { container } = render(<HeroHeader imageUrl="/test.jpg" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveStyle({ backgroundImage: 'url(/test.jpg)' });
  });

  it('sets custom height', () => {
    const { container } = render(<HeroHeader imageUrl="/test.jpg" height="500px" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveStyle({ height: '500px' });
  });

  it('uses default height when not specified', () => {
    const { container } = render(<HeroHeader imageUrl="/test.jpg" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveStyle({ height: '400px' });
  });

  it('has proper background styling', () => {
    const { container } = render(<HeroHeader imageUrl="/test.jpg" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveStyle({
      backgroundSize: 'cover',
      backgroundPosition: 'top left'
    });
  });

  it('includes accessibility attributes', () => {
    const { container } = render(<HeroHeader imageUrl="/test.jpg" alt="Test header" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveAttribute('role', 'img');
    expect(element).toHaveAttribute('aria-label', 'Test header');
  });
});
