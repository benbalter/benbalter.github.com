import { render, screen } from '@testing-library/react';
import FossAtScale from './FossAtScale';

describe('FossAtScale', () => {
  it('renders with the nth parameter', () => {
    render(<FossAtScale nth="first" />);
    
    expect(screen.getByText(/This is the first post in/i)).toBeInTheDocument();
  });

  it('renders different nth values correctly', () => {
    const { rerender } = render(<FossAtScale nth="second" />);
    expect(screen.getByText(/This is the second post in/i)).toBeInTheDocument();
    
    rerender(<FossAtScale nth="third" />);
    expect(screen.getByText(/This is the third post in/i)).toBeInTheDocument();
    
    rerender(<FossAtScale nth="fourth and final" />);
    expect(screen.getByText(/This is the fourth and final post in/i)).toBeInTheDocument();
  });

  it('contains a link to the series intro post', () => {
    render(<FossAtScale nth="first" />);
    
    const link = screen.getByRole('link', { name: 'a series' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/2021/06/15/managing-open-source-communities-at-scale');
    expect(link).toHaveClass('alert-link');
  });

  it('renders within a Callout component (has alert role)', () => {
    render(<FossAtScale nth="first" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('alert', 'alert-primary', 'text-center');
  });
});
