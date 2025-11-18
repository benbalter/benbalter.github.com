import { render, screen } from '@testing-library/react';
import GitHubCultureCallout from './GitHubCultureCallout';

describe('GitHubCultureCallout', () => {
  it('renders the callout with correct text', () => {
    render(<GitHubCultureCallout />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('alert alert-primary text-center');
    
    expect(screen.getByText(/Interested in learning more about how GitHub works/i)).toBeInTheDocument();
  });

  it('contains a link to the GitHub culture post', () => {
    render(<GitHubCultureCallout />);
    
    const link = screen.getByRole('link', { name: /Check out these popular posts on GitHub's culture and communication patterns/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/2021/02/01/what-to-read-before-starting-or-interviewing-at-github');
    expect(link).toHaveClass('alert-link');
  });
});
