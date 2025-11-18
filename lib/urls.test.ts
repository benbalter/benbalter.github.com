import { getAllSiteUrls } from './urls';
import * as posts from './posts';
import { getAllPages } from './pages';

// Mock the dependencies
jest.mock('./posts', () => ({
  getAllPosts: jest.fn(),
  getPostUrlParts: jest.fn((post) => {
    const parts = post.slug.split('-');
    const year = parts[0] || '';
    const month = parts[1] || '';
    const day = parts[2] || '';
    const slug = parts.slice(3).join('-');
    const url = `/${encodeURIComponent(year)}/${encodeURIComponent(month)}/${encodeURIComponent(day)}/${encodeURIComponent(slug)}/`;
    return { year, month, day, slug, url };
  }),
}));
jest.mock('./pages');

describe('getAllSiteUrls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all site URLs including posts, pages, and static paths', () => {
    const mockPosts = [
      { slug: '2022-06-30-helpful-404s-for-jekyll-and-github-pages', title: 'Test Post 1', date: '2022-06-30', content: '' },
      { slug: '2022-06-01-another-post', title: 'Test Post 2', date: '2022-06-01', content: '' }
    ];

    const mockPages = [
      { slug: 'about', title: 'About', content: '' },
      { slug: 'contact', title: 'Contact', content: '' },
      { slug: 'index', title: 'Home', content: '' }, // Should be excluded
      { slug: '404', title: 'Not Found', content: '' } // Should be excluded
    ];

    (posts.getAllPosts as jest.Mock).mockReturnValue(mockPosts);
    (getAllPages as jest.Mock).mockReturnValue(mockPages);

    const urls = getAllSiteUrls();

    // Should include post URLs
    expect(urls).toContain('/2022/06/30/helpful-404s-for-jekyll-and-github-pages/');
    expect(urls).toContain('/2022/06/01/another-post/');

    // Should include page URLs (but not index and 404)
    expect(urls).toContain('/about/');
    expect(urls).toContain('/contact/');
    expect(urls).not.toContain('/index/');
    expect(urls).not.toContain('/404/');

    // Should include home path
    expect(urls).toContain('/');
  });

  it('should handle empty posts and pages', () => {
    (posts.getAllPosts as jest.Mock).mockReturnValue([]);
    (getAllPages as jest.Mock).mockReturnValue([]);

    const urls = getAllSiteUrls();

    // Should still include home page
    expect(urls).toContain('/');
    expect(urls.length).toBe(1);
  });

  it('should not include duplicate URLs', () => {
    const mockPages = [
      { slug: 'about', title: 'About', content: '' },
      { slug: 'about', title: 'About', content: '' } // Duplicate
    ];

    (posts.getAllPosts as jest.Mock).mockReturnValue([]);
    (getAllPages as jest.Mock).mockReturnValue(mockPages);

    const urls = getAllSiteUrls();

    // /about/ should appear only once due to Set deduplication
    const aboutCount = urls.filter(url => url === '/about/').length;
    expect(aboutCount).toBe(1);
  });
});
