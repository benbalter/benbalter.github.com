import { render, screen } from '@testing-library/react';
import RecentPostsList from './RecentPostsList';
import type { Post } from '@/lib/posts';

// Mock the getPostUrlParts function
jest.mock('@/lib/posts', () => ({
  ...jest.requireActual('@/lib/posts'),
  getPostUrlParts: jest.fn((post: Post) => ({
    url: `/2024/01/15/${post.slug}/`,
    year: '2024',
    month: '01',
    day: '15',
  })),
}));

describe('RecentPostsList', () => {
  const mockPosts: Post[] = [
    {
      slug: 'recent-post-1',
      title: 'Recent Post One',
      date: '2024-03-01',
      description: 'Recent post one description',
      content: 'Content here',
    },
    {
      slug: 'recent-post-2',
      title: 'Recent Post Two',
      date: '2024-02-28',
      description: 'Recent post two description',
      content: 'More content',
    },
    {
      slug: 'recent-post-3',
      title: 'Recent Post Three',
      date: '2024-02-15',
      description: 'Recent post three description',
      content: 'Even more content',
    },
  ];

  it('should render default title', () => {
    render(<RecentPostsList posts={mockPosts} />);
    
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Recent posts');
  });

  it('should render custom title', () => {
    render(<RecentPostsList posts={mockPosts} title="Latest Articles" />);
    
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Latest Articles');
  });

  it('should render all posts', () => {
    render(<RecentPostsList posts={mockPosts} />);
    
    expect(screen.getByText('Recent Post One')).toBeInTheDocument();
    expect(screen.getByText('Recent Post Two')).toBeInTheDocument();
    expect(screen.getByText('Recent Post Three')).toBeInTheDocument();
  });

  it('should render posts as list items', () => {
    const { container } = render(<RecentPostsList posts={mockPosts} />);
    
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(mockPosts.length);
  });

  it('should render post links with correct href', () => {
    render(<RecentPostsList posts={mockPosts} />);
    
    const firstPostLink = screen.getByText('Recent Post One').closest('a');
    expect(firstPostLink).toHaveAttribute('href', '/2024/01/15/recent-post-1/');
  });

  it('should have border-top class on heading', () => {
    render(<RecentPostsList posts={mockPosts} />);
    
    const heading = screen.getByRole('heading', { level: 4 });
    expect(heading).toHaveClass('border-top', 'pt-3');
  });

  it('should render with empty posts array', () => {
    const { container } = render(<RecentPostsList posts={[]} />);
    
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(0);
    
    // Should still render the heading
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  it('should render unordered list', () => {
    const { container } = render(<RecentPostsList posts={mockPosts} />);
    
    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
  });

  it('should have correct structure', () => {
    const { container } = render(<RecentPostsList posts={mockPosts} />);
    
    const heading = screen.getByRole('heading', { level: 4 });
    const ul = container.querySelector('ul');
    
    expect(heading).toBeInTheDocument();
    expect(ul).toBeInTheDocument();
  });
});
