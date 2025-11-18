import { render, screen } from '@testing-library/react';
import Callout from './Callout';

describe('Callout', () => {
  it('renders children content', () => {
    render(<Callout>Test content</Callout>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('has correct Bootstrap classes', () => {
    const { container } = render(<Callout>Test</Callout>);
    const alert = container.querySelector('.alert');
    expect(alert).toHaveClass('alert-primary', 'text-center');
  });

  it('has correct ARIA role', () => {
    const { container } = render(<Callout>Test</Callout>);
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it('renders HTML children', () => {
    render(
      <Callout>
        <strong>Bold text</strong> and <a href="/test">a link</a>
      </Callout>
    );
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('a link')).toBeInTheDocument();
  });
});
