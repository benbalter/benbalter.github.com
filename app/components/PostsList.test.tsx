import { render, screen } from '@testing-library/react';
import PostsList from './PostsList';
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

describe('PostsList', () => {
  const mockPosts: Post[] = [
    {
      slug: 'first-post',
      title: 'First Test Post',
      date: '2024-01-15',
      description: 'First test post description',
      content: 'Content here',
    },
    {
      slug: 'second-post',
      title: 'Second Test Post',
      date: '2024-02-20',
      description: 'Second test post description',
      content: 'More content',
    },
    {
      slug: 'third-post',
      title: 'Third Test Post',
      date: '2023-12-10',
      description: 'Third test post description',
      content: 'Even more content',
    },
  ];

  it('should render all posts', () => {
    render(<PostsList posts={mockPosts} />);
    
    expect(screen.getByText('First Test Post')).toBeInTheDocument();
    expect(screen.getByText('Second Test Post')).toBeInTheDocument();
    expect(screen.getByText('Third Test Post')).toBeInTheDocument();
  });

  it('should render post links with correct href', () => {
    render(<PostsList posts={mockPosts} />);
    
    const firstPostLink = screen.getByText('First Test Post').closest('a');
    expect(firstPostLink).toHaveAttribute('href', '/2024/01/15/first-post/');
  });

  it('should format dates correctly', () => {
    render(<PostsList posts={mockPosts} />);
    
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('February 20, 2024')).toBeInTheDocument();
    expect(screen.getByText('December 10, 2023')).toBeInTheDocument();
  });

  it('should render posts in rows', () => {
    const { container } = render(<PostsList posts={mockPosts} />);
    
    const rows = container.querySelectorAll('.row');
    expect(rows).toHaveLength(mockPosts.length);
  });

  it('should have correct column layout', () => {
    const { container } = render(<PostsList posts={mockPosts} />);
    
    const titleColumns = container.querySelectorAll('.col-sm-9');
    const dateColumns = container.querySelectorAll('.col-sm-3');
    
    expect(titleColumns).toHaveLength(mockPosts.length);
    expect(dateColumns).toHaveLength(mockPosts.length);
  });

  it('should render with empty posts array', () => {
    const { container } = render(<PostsList posts={[]} />);
    
    const rows = container.querySelectorAll('.row');
    expect(rows).toHaveLength(0);
  });

  it('should render dates in small text', () => {
    const { container } = render(<PostsList posts={mockPosts} />);
    
    const dateElements = container.querySelectorAll('.col-sm-3 small');
    expect(dateElements).toHaveLength(mockPosts.length);
  });

  it('should have text-muted class on date column', () => {
    const { container } = render(<PostsList posts={mockPosts} />);
    
    const dateColumn = container.querySelector('.col-sm-3');
    expect(dateColumn).toHaveClass('text-muted', 'text-md-end');
  });
});
