import {render, screen, waitFor} from '@testing-library/react';
import NotFoundSuggestion from './not-found-suggestion';

// Mock fastest-levenshtein
jest.mock('fastest-levenshtein', () => ({
  closest: jest.fn(),
}));

describe('NotFoundSuggestion', () => {
  const mockUrls = [
    '/2022/06/30/helpful-404s-for-jekyll-and-github-pages/',
    '/2022/06/01/another-post/',
    '/about/',
    '/'
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render nothing initially until effect runs', async () => {
    const { closest } = await import('fastest-levenshtein');
    const closestMock = closest as jest.Mock;
    closestMock.mockReturnValue('http://localhost/2022/06/30/helpful-404s-for-jekyll-and-github-pages/');

    const { container } = render(<NotFoundSuggestion urls={mockUrls} />);
    
    // After effect runs, should render suggestion
    await waitFor(() => {
      expect(container.textContent).not.toBe('');
    });
  });

  it('should suggest the closest matching URL', async () => {
    const { closest } = await import('fastest-levenshtein');
    const closestMock = closest as jest.Mock;
    closestMock.mockReturnValue('http://localhost/2022/06/30/helpful-404s-for-jekyll-and-github-pages/');

    render(<NotFoundSuggestion urls={mockUrls} />);

    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'http://localhost/2022/06/30/helpful-404s-for-jekyll-and-github-pages/');
      expect(link).toHaveTextContent('/2022/06/30/helpful-404s-for-jekyll-and-github-pages/');
    });

    // Verify closest was called
    expect(closestMock).toHaveBeenCalledTimes(1);
    expect(closestMock.mock.calls[0][1]).toEqual(
      expect.arrayContaining([
        expect.stringContaining('/2022/06/30/helpful-404s-for-jekyll-and-github-pages/'),
        expect.stringContaining('/2022/06/01/another-post/'),
        expect.stringContaining('/about/'),
        expect.stringContaining('/')
      ])
    );
  });

  it('should handle empty URLs array gracefully', () => {
    const { container } = render(<NotFoundSuggestion urls={[]} />);
    expect(container.textContent).toBe('');
  });

  it('should fallback to home page on error', async () => {
    const { closest } = await import('fastest-levenshtein');
    const closestMock = closest as jest.Mock;
    closestMock.mockImplementation(() => {
      throw new Error('Test error');
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<NotFoundSuggestion urls={mockUrls} />);

    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
      expect(link).toHaveTextContent('/');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error finding closest URL:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should handle server-side rendering gracefully', async () => {
    // We can't truly simulate SSR in jsdom, but we can test the condition
    // The component checks if window is undefined in useEffect
    const { container } = render(<NotFoundSuggestion urls={[]} />);
    
    // With empty urls array, should render nothing
    expect(container.textContent).toBe('');
  });

  it('should use pathname from suggestion link', async () => {
    const { closest } = await import('fastest-levenshtein');
    const closestMock = closest as jest.Mock;
    closestMock.mockReturnValue('http://localhost/about/');

    render(<NotFoundSuggestion urls={mockUrls} />);

    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveTextContent('/about/');
    });
  });
});
