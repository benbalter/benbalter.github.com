import { render, screen } from '@testing-library/react';
import PostsList from './PostsList';
import type { Post } from '@/lib/posts';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock getPostUrlParts
jest.mock('@/lib/posts', () => ({
  getPostUrlParts: jest.fn((post: Post) => ({
    url: `/2023/01/01/${post.slug}`,
    year: '2023',
    month: '01',
    day: '01',
  })),
}));

describe('PostsList', () => {
  const mockPosts: Post[] = [
    {
      slug: 'first-post',
      date: '2023-01-01',
      title: 'First Post',
      content: 'Content here',
    },
    {
      slug: 'second-post',
      date: '2023-02-15',
      title: 'Second Post',
      content: 'More content',
    },
    {
      slug: 'third-post',
      date: '2023-03-30',
      title: 'Third Post',
      content: 'Even more content',
    },
  ];

  beforeEach(() => {
    // Reset mock before each test
    const { getPostUrlParts } = require('@/lib/posts');
    getPostUrlParts.mockImplementation((post: Post) => {
      const date = new Date(post.date);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return {
        url: `/${year}/${month}/${day}/${post.slug}`,
        year: String(year),
        month,
        day,
      };
    });
  });

  it('should render all posts', () => {
    render(<PostsList posts={mockPosts} />);
    
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
    expect(screen.getByText('Third Post')).toBeInTheDocument();
  });

  it('should render post links with correct href', () => {
    render(<PostsList posts={mockPosts} />);
    
    const firstLink = screen.getByText('First Post').closest('a');
    expect(firstLink).toHaveAttribute('href', '/2023/01/01/first-post');
    
    const secondLink = screen.getByText('Second Post').closest('a');
    expect(secondLink).toHaveAttribute('href', '/2023/02/15/second-post');
  });

  it('should render formatted dates', () => {
    render(<PostsList posts={mockPosts} />);
    
    // Note: Dates are parsed as UTC and displayed in local timezone,
    // which may shift them by a day depending on the timezone
    expect(screen.getByText(/January 1, 2023|December 31, 2022/)).toBeInTheDocument();
    expect(screen.getByText(/February 15, 2023|February 14, 2023/)).toBeInTheDocument();
    expect(screen.getByText(/March 30, 2023|March 29, 2023/)).toBeInTheDocument();
  });

  it('should render with empty posts array', () => {
    const { container } = render(<PostsList posts={[]} />);
    
    // Should render without errors
    expect(container).toBeInTheDocument();
  });

  it('should render posts in row layout', () => {
    const { container } = render(<PostsList posts={mockPosts} />);
    
    const rows = container.querySelectorAll('.row');
    expect(rows.length).toBe(mockPosts.length);
  });

  it('should have proper column structure', () => {
    const { container } = render(<PostsList posts={mockPosts} />);
    
    const titleColumn = container.querySelector('.col-sm-9');
    expect(titleColumn).toBeInTheDocument();
    
    const dateColumn = container.querySelector('.col-sm-3');
    expect(dateColumn).toBeInTheDocument();
  });

  it('should render dates with small styling', () => {
    const { container } = render(<PostsList posts={mockPosts} />);
    
    const smallElements = container.querySelectorAll('small');
    expect(smallElements.length).toBeGreaterThan(0);
  });

  it('should handle single post', () => {
    const singlePost = [mockPosts[0]];
    render(<PostsList posts={singlePost} />);
    
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.queryByText('Second Post')).not.toBeInTheDocument();
  });
});
