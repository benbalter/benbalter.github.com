import { render } from '@testing-library/react';
import GitHubAvatar from './GitHubAvatar';

// Mock the Octokit module
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    return <img {...props} />;
  },
}));

describe('GitHubAvatar', () => {
  it('should render with username', () => {
    const { container } = render(<GitHubAvatar username="benbalter" />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://avatars.githubusercontent.com/benbalter?s=40');
  });

  it('should render with custom size', () => {
    const { container } = render(<GitHubAvatar username="octocat" size={80} />);
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://avatars.githubusercontent.com/octocat?s=80');
    expect(img).toHaveAttribute('width', '80');
    expect(img).toHaveAttribute('height', '80');
  });

  it('should render with custom className', () => {
    const { container } = render(<GitHubAvatar username="benbalter" className="custom-class" />);
    
    const img = container.querySelector('img');
    expect(img).toHaveClass('custom-class');
  });

  it('should have default alt text', () => {
    const { container } = render(<GitHubAvatar username="benbalter" />);
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', "benbalter's avatar");
  });

  it('should use custom alt text when provided', () => {
    const { container } = render(<GitHubAvatar username="benbalter" alt="Custom alt text" />);
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', 'Custom alt text');
  });

  it('should use default size of 40 when not specified', () => {
    const { container } = render(<GitHubAvatar username="benbalter" />);
    
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('width', '40');
    expect(img).toHaveAttribute('height', '40');
  });
});
