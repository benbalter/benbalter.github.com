import { render, screen } from '@testing-library/react';
import ArchivedWarning from './ArchivedWarning';

describe('ArchivedWarning', () => {
  it('should render the warning alert', () => {
    render(<ArchivedWarning />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('should have warning alert class', () => {
    render(<ArchivedWarning />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert', 'alert-warning');
  });

  it('should display the warning message', () => {
    render(<ArchivedWarning />);
    
    expect(screen.getByText(/Heads up!/i)).toBeInTheDocument();
    expect(screen.getByText(/This post is archived and here for historical purposes/i)).toBeInTheDocument();
  });

  it('should have strong tag for the heading', () => {
    const { container } = render(<ArchivedWarning />);
    
    const strong = container.querySelector('strong');
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent('❗ Heads up!');
  });
});
