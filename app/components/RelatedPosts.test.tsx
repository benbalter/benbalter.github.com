import { render, screen } from '@testing-library/react';
import RelatedPosts from './RelatedPosts';

// Mock the posts module
jest.mock('@/lib/posts', () => ({
  getPostUrlParts: jest.fn((post) => ({
    url: `/2024/01/01/${post.slug}/`,
  })),
}));

describe('RelatedPosts', () => {
  const mockRelatedPosts = [
    { slug: 'first-post', title: 'First Related Post', date: '2024-01-01', content: 'Content' },
    { slug: 'second-post', title: 'Second Related Post', date: '2024-01-02', content: 'Content' },
    { slug: 'third-post', title: 'Third Related Post', date: '2024-01-03', content: 'Content' },
  ];

  it('should render related posts heading', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByText(/If you enjoyed this post/)).toBeInTheDocument();
  });

  it('should render all related posts', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    expect(screen.getByRole('link', { name: 'First Related Post' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Second Related Post' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Third Related Post' })).toBeInTheDocument();
  });

  it('should render posts in a list', () => {
    const { container } = render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
    
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(3);
  });

  it('should have correct links', () => {
    render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const firstLink = screen.getByRole('link', { name: 'First Related Post' });
    expect(firstLink).toHaveAttribute('href', '/2024/01/01/first-post');
  });

  it('should render nothing when no related posts', () => {
    const { container } = render(<RelatedPosts relatedPosts={[]} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when relatedPosts is null', () => {
    const { container } = render(<RelatedPosts relatedPosts={null as any} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should apply border-top styling', () => {
    const { container } = render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const section = container.firstChild;
    expect(section).toHaveClass('border-top');
    expect(section).toHaveClass('pt-3');
  });

  it('should render heading with correct styles', () => {
    const { container } = render(<RelatedPosts relatedPosts={mockRelatedPosts} />);
    
    const heading = container.querySelector('h2');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('h6');
  });

  it('should render single related post', () => {
    const singlePost = [mockRelatedPosts[0]];
    render(<RelatedPosts relatedPosts={singlePost} />);
    
    expect(screen.getByRole('link', { name: 'First Related Post' })).toBeInTheDocument();
    
    const { container } = render(<RelatedPosts relatedPosts={singlePost} />);
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(1);
  });
});
