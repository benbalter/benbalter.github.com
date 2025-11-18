import { render, screen } from '@testing-library/react';
import PageTitle from './PageTitle';

describe('PageTitle', () => {
  it('renders the title', () => {
    render(<PageTitle title="Test Page" />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Page');
  });

  it('applies default classes', () => {
    render(<PageTitle title="Test" />);
    const heading = screen.getByRole('heading', { level: 1 });
    
    expect(heading).toHaveClass('display-4', 'text-primary');
  });

  it('applies custom className', () => {
    render(<PageTitle title="Test" className="mb-4" />);
    const heading = screen.getByRole('heading', { level: 1 });
    
    expect(heading).toHaveClass('display-4', 'text-primary', 'mb-4');
  });

  it('renders as h1 element', () => {
    render(<PageTitle title="Test" />);
    const heading = screen.getByRole('heading', { level: 1 });
    
    expect(heading.tagName).toBe('H1');
  });
});
