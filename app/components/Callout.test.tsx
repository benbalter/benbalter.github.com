import { render, screen } from '@testing-library/react';
import Callout from './Callout';

describe('Callout', () => {
  it('renders children content', () => {
    render(<Callout>Test callout content</Callout>);
    
    expect(screen.getByText('Test callout content')).toBeInTheDocument();
  });

  it('renders with alert role for accessibility', () => {
    render(<Callout>Alert content</Callout>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('applies correct Bootstrap classes', () => {
    render(<Callout>Styled content</Callout>);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert', 'alert-primary', 'text-center');
  });

  it('renders complex children including JSX elements', () => {
    render(
      <Callout>
        <strong>Bold text</strong> and <a href="/link">a link</a>
      </Callout>
    );
    
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'a link' })).toBeInTheDocument();
  });
});
