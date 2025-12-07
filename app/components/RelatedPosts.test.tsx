import { render, screen } from '@testing-library/react';
import RelatedPosts from './RelatedPosts';
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
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return {
      url: `/${year}/${month}/${day}/${post.slug}`,
      year: String(year),
      month,
      day,
    };
  }),
}));

describe('RelatedPosts', () => {
  const mockRelatedPosts: Post[] = [
    {
      slug: 'related-post-1',
      date: '2023-06-01',
      title: 'Related Post 1',
      content: 'Related content 1',
    },
    {
      slug: 'related-post-2',
      date: '2023-05-15',
      title: 'Related Post 2',
      content: 'Related content 2',
    },
  ];

  it('should render related posts', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByText('Related Post 1')).toBeInTheDocument();
    expect(screen.getByText('Related Post 2')).toBeInTheDocument();
  });

  it('should render heading text', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByText(/If you enjoyed this post, you might also enjoy:/)).toBeInTheDocument();
  });

  it('should render post links with correct href', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const link1 = screen.getByText('Related Post 1').closest('a');
    expect(link1).toHaveAttribute('href', '/2023/06/01/related-post-1');
    
    const link2 = screen.getByText('Related Post 2').closest('a');
    expect(link2).toHaveAttribute('href', '/2023/05/15/related-post-2');
  });

  it('should render posts in a list', () => {
    const { container } = render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
    
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(mockRelatedPosts.length);
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

  it('should render heading as h6', () => {
    const { container } = render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const heading = container.querySelector('h2');
    expect(heading).toHaveClass('h6');
  });

  it('should handle single related post', () => {
    const singlePost = [mockRelatedPosts[0]];
    const { container } = render(<RelatedPosts relatedPosts={singlePost} />);
    
    expect(screen.getByText('Related Post 1')).toBeInTheDocument();
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(1);
  });
});
