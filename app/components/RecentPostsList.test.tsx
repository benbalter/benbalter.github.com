import { render, screen } from '@testing-library/react';
import RecentPostsList from './RecentPostsList';
import type { Post } from '@/lib/posts';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock getPostUrlParts
jest.mock('@/lib/posts', () => ({
  getPostUrlParts: jest.fn((post: Post) => {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return {
      url: `/${year}/${month}/${day}/${post.slug}`,
      year: String(year),
      month,
      day,
    };
  }),
}));

describe('RecentPostsList', () => {
  const mockPosts: Post[] = [
    {
      slug: 'recent-post-1',
      date: '2023-12-01',
      title: 'Recent Post 1',
      content: 'Content 1',
    },
    {
      slug: 'recent-post-2',
      date: '2023-11-15',
      title: 'Recent Post 2',
      content: 'Content 2',
    },
    {
      slug: 'recent-post-3',
      date: '2023-10-30',
      title: 'Recent Post 3',
      content: 'Content 3',
    },
  ];

  it('should render default title', () => {
    render(<RecentPostsList posts={mockPosts} />);
    
    expect(screen.getByText('Recent posts')).toBeInTheDocument();
  });

  it('should render custom title', () => {
    render(<RecentPostsList posts={mockPosts} title="Latest Articles" />);
    
    expect(screen.getByText('Latest Articles')).toBeInTheDocument();
    expect(screen.queryByText('Recent posts')).not.toBeInTheDocument();
  });

  it('should render all posts', () => {
    render(<RecentPostsList posts={mockPosts} />);
    
    expect(screen.getByText('Recent Post 1')).toBeInTheDocument();
    expect(screen.getByText('Recent Post 2')).toBeInTheDocument();
    expect(screen.getByText('Recent Post 3')).toBeInTheDocument();
  });

  it('should render post links with correct href', () => {
    render(<RecentPostsList posts={mockPosts} />);
    
    const link1 = screen.getByText('Recent Post 1').closest('a');
    expect(link1).toHaveAttribute('href', '/2023/12/01/recent-post-1');
    
    const link2 = screen.getByText('Recent Post 2').closest('a');
    expect(link2).toHaveAttribute('href', '/2023/11/15/recent-post-2');
  });

  it('should render posts in a list', () => {
    const { container } = render(<RecentPostsList posts={mockPosts} />);
    
    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
    
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(mockPosts.length);
  });

  it('should have border-top on title', () => {
    const { container } = render(<RecentPostsList posts={mockPosts} />);
    
    const title = container.querySelector('h4');
    expect(title).toHaveClass('border-top', 'pt-3');
  });

  it('should render with empty posts array', () => {
    const { container } = render(<RecentPostsList posts={[]} />);
    
    expect(screen.getByText('Recent posts')).toBeInTheDocument();
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(0);
  });

  it('should handle single post', () => {
    const singlePost = [mockPosts[0]];
    const { container } = render(<RecentPostsList posts={singlePost} />);
    
    expect(screen.getByText('Recent Post 1')).toBeInTheDocument();
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(1);
  });
});
