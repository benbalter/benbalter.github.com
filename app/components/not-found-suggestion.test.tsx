import { render, screen } from '@testing-library/react';
import NotFoundSuggestion from './not-found-suggestion';

describe('NotFoundSuggestion', () => {
  const mockUrls = [
    '/2022/06/30/helpful-404s-for-jekyll-and-github-pages/',
    '/2022/06/01/another-post/',
    '/about/',
    '/'
  ];

  it('should render placeholder span with data-urls attribute', () => {
    render(<NotFoundSuggestion urls={mockUrls} />);
    
    const span = screen.getByText('...');
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute('id', 'not-found-suggestion');
    expect(span).toHaveAttribute('data-urls', JSON.stringify(mockUrls));
  });

  it('should render inline script for client-side suggestion calculation', () => {
    const { container } = render(<NotFoundSuggestion urls={mockUrls} />);
    
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
    expect(script?.innerHTML).toContain('levenshtein');
    expect(script?.innerHTML).toContain('closest');
    expect(script?.innerHTML).toContain('not-found-suggestion');
  });

  it('should include Levenshtein distance implementation in script', () => {
    const { container } = render(<NotFoundSuggestion urls={mockUrls} />);
    
    const script = container.querySelector('script');
    expect(script?.innerHTML).toContain('function levenshtein(a, b)');
    expect(script?.innerHTML).toContain('matrix');
  });

  it('should include fallback logic in script', () => {
    const { container } = render(<NotFoundSuggestion urls={mockUrls} />);
    
    const script = container.querySelector('script');
    expect(script?.innerHTML).toContain('fallbackLink');
    expect(script?.innerHTML).toContain("href = '/'");
  });

  it('should handle empty URLs array by encoding as empty JSON array', () => {
    render(<NotFoundSuggestion urls={[]} />);
    
    const span = screen.getByText('...');
    expect(span).toHaveAttribute('data-urls', '[]');
  });

  it('should properly JSON encode URLs with special characters', () => {
    const urlsWithSpecialChars = ['/path/with"quotes/', '/path/with<angle>/'];
    render(<NotFoundSuggestion urls={urlsWithSpecialChars} />);
    
    const span = screen.getByText('...');
    expect(span).toHaveAttribute('data-urls', JSON.stringify(urlsWithSpecialChars));
  });

  it('should use DOM manipulation instead of innerHTML for security', () => {
    const { container } = render(<NotFoundSuggestion urls={mockUrls} />);
    
    const script = container.querySelector('script');
    // Should use createElement and textContent instead of innerHTML
    expect(script?.innerHTML).toContain('createElement');
    expect(script?.innerHTML).toContain('textContent');
    expect(script?.innerHTML).toContain('appendChild');
    // Should NOT use innerHTML in the dynamic content areas
    expect(script?.innerHTML).not.toMatch(/el\.innerHTML\s*=/);
  });
});
