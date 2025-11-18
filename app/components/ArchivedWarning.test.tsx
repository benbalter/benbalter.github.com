import { render, screen } from '@testing-library/react';
import ArchivedWarning from './ArchivedWarning';

describe('ArchivedWarning', () => {
  it('should render the warning message', () => {
    render(<ArchivedWarning />);
    
    expect(screen.getByText(/Heads up!/)).toBeInTheDocument();
    expect(screen.getByText(/This post is archived and here for historical purposes/)).toBeInTheDocument();
  });

  it('should have alert role', () => {
    const { container } = render(<ArchivedWarning />);
    
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });

  it('should have warning styling', () => {
    const { container } = render(<ArchivedWarning />);
    
    const alert = container.querySelector('.alert-warning');
    expect(alert).toBeInTheDocument();
  });

  it('should contain expected text content', () => {
    render(<ArchivedWarning />);
    
    expect(screen.getByText(/may no longer be accurate or reflect my views/)).toBeInTheDocument();
    expect(screen.getByText(/Proceed at your own risk/)).toBeInTheDocument();
  });
});
