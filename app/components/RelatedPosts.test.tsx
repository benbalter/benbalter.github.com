import { render, screen } from '@testing-library/react';
import RelatedPosts from './RelatedPosts';
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

describe('RelatedPosts', () => {
  const mockRelatedPosts: Post[] = [
    {
      slug: 'related-post-1',
      title: 'Related Post One',
      date: '2024-01-10',
      description: 'Related post one description',
      content: 'Content here',
    },
    {
      slug: 'related-post-2',
      title: 'Related Post Two',
      date: '2024-01-05',
      description: 'Related post two description',
      content: 'More content',
    },
  ];

  it('should render related posts when provided', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByText('Related Post One')).toBeInTheDocument();
    expect(screen.getByText('Related Post Two')).toBeInTheDocument();
  });

  it('should render the heading', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByText(/If you enjoyed this post, you might also enjoy:/i)).toBeInTheDocument();
  });

  it('should render as h2 with h6 size', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('h6');
  });

  it('should render posts as list items', () => {
    const { container } = render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(mockRelatedPosts.length);
  });

  it('should render post links with correct href', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const firstPostLink = screen.getByText('Related Post One').closest('a');
    expect(firstPostLink).toHaveAttribute('href', '/2024/01/15/related-post-1/');
  });

  it('should not render when relatedPosts is empty array', () => {
    const { container } = render(<RelatedPosts relatedPosts={[]} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should not render when relatedPosts is null', () => {
    const { container } = render(<RelatedPosts relatedPosts={null as any} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should not render when relatedPosts is undefined', () => {
    const { container } = render(<RelatedPosts relatedPosts={undefined as any} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should have border-top styling', () => {
    const { container } = render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const wrapper = container.querySelector('.border-top');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('pt-3');
  });

  it('should render unordered list', () => {
    const { container } = render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
  });

  it('should use post slug as key', () => {
    const { container } = render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    // React doesn't expose keys directly, but we can verify the posts are rendered
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(mockRelatedPosts.length);
  });
});
