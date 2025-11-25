import { render, screen } from '@testing-library/react';
import FOSSAtScaleCallout from './FOSSAtScaleCallout';

describe('FOSSAtScaleCallout', () => {
  it('should render with nth position', () => {
    render(<FOSSAtScaleCallout nth="first" />);
    
    expect(screen.getByText(/This is the first post in/)).toBeInTheDocument();
  });

  it('should render link to series', () => {
    render(<FOSSAtScaleCallout nth="second" />);
    
    const link = screen.getByRole('link', { name: 'a series' });
    expect(link).toHaveAttribute('href', '/2021/06/15/managing-open-source-communities-at-scale');
  });

  it('should have alert role for accessibility', () => {
    render(<FOSSAtScaleCallout nth="third" />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render different nth values', () => {
    const { rerender } = render(<FOSSAtScaleCallout nth="first" />);
    expect(screen.getByText(/first post/)).toBeInTheDocument();
    
    rerender(<FOSSAtScaleCallout nth="fourth and final" />);
    expect(screen.getByText(/fourth and final post/)).toBeInTheDocument();
  });

  it('should have alert-link class on link', () => {
    render(<FOSSAtScaleCallout nth="first" />);
    
    const link = screen.getByRole('link', { name: 'a series' });
    expect(link).toHaveClass('alert-link');
  });
});
