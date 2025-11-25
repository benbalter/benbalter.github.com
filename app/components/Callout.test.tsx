import { render, screen } from '@testing-library/react';
import Callout from './Callout';

describe('Callout', () => {
  it('should render children content', () => {
    render(<Callout>Test callout content</Callout>);
    
    expect(screen.getByText('Test callout content')).toBeInTheDocument();
  });

  it('should have alert role for accessibility', () => {
    render(<Callout>Test content</Callout>);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<Callout>Test content</Callout>);
    
    const callout = container.firstChild;
    expect(callout).toHaveClass('alert');
    expect(callout).toHaveClass('alert-primary');
    expect(callout).toHaveClass('text-center');
  });

  it('should render complex children', () => {
    render(
      <Callout>
        <strong>Bold text</strong> and <a href="/test">a link</a>
      </Callout>
    );
    
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('a link')).toBeInTheDocument();
  });
});
