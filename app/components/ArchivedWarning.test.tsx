import { render, screen } from '@testing-library/react';
import ArchivedWarning from './ArchivedWarning';

describe('ArchivedWarning', () => {
  it('should render the warning message', () => {
    render(<ArchivedWarning />);
    
    expect(screen.getByText(/Heads up!/)).toBeInTheDocument();
    expect(screen.getByText(/archived and here for historical purposes/)).toBeInTheDocument();
  });

  it('should have alert role', () => {
    render(<ArchivedWarning />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('should apply Bootstrap alert classes', () => {
    const { container } = render(<ArchivedWarning />);
    
    const alert = container.querySelector('.alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('alert-warning');
  });

  it('should display strong emphasis on warning title', () => {
    render(<ArchivedWarning />);
    
    const strong = screen.getByText(/Heads up!/);
    expect(strong.tagName).toBe('STRONG');
  });

  it('should include warning emoji', () => {
    render(<ArchivedWarning />);
    
    expect(screen.getByText(/❗/)).toBeInTheDocument();
  });

  it('should warn about accuracy and views', () => {
    render(<ArchivedWarning />);
    
    expect(screen.getByText(/may no longer be accurate or reflect my views/)).toBeInTheDocument();
  });
});
