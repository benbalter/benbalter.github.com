/**
 * Tests for post URL generation utilities
 */

import { describe, it, expect } from 'vitest';
import { getPostUrl, getPostUrlOrNull } from './post-urls';

describe('getPostUrl', () => {
  it('should generate correct URL from valid slug', () => {
    const slug = '2024-01-15-my-blog-post';
    const url = getPostUrl(slug);
    
    expect(url).toBe('/2024/01/15/my-blog-post/');
  });

  it('should handle different dates correctly', () => {
    const testCases = [
      { slug: '2023-12-31-year-end-post', expected: '/2023/12/31/year-end-post/' },
      { slug: '2024-01-01-new-year-post', expected: '/2024/01/01/new-year-post/' },
      { slug: '2024-06-15-mid-year-post', expected: '/2024/06/15/mid-year-post/' },
    ];

    testCases.forEach(({ slug, expected }) => {
      expect(getPostUrl(slug)).toBe(expected);
    });
  });

  it('should handle slugs with hyphens', () => {
    const slug = '2024-03-20-this-is-a-long-slug-with-many-words';
    const url = getPostUrl(slug);
    
    expect(url).toBe('/2024/03/20/this-is-a-long-slug-with-many-words/');
  });

  it('should handle slugs with single word titles', () => {
    const slug = '2024-05-10-introduction';
    const url = getPostUrl(slug);
    
    expect(url).toBe('/2024/05/10/introduction/');
  });

  it('should handle slugs with numbers in title', () => {
    const slug = '2024-07-04-7-tips-for-success';
    const url = getPostUrl(slug);
    
    expect(url).toBe('/2024/07/04/7-tips-for-success/');
  });

  it('should fallback to /posts/ for invalid slug format', () => {
    const invalidSlug = 'invalid-slug-format';
    const url = getPostUrl(invalidSlug);
    
    expect(url).toBe('/posts/invalid-slug-format/');
  });

  it('should fallback for slug without proper date format', () => {
    const invalidSlug = '2024-01-my-post';
    const url = getPostUrl(invalidSlug);
    
    expect(url).toBe('/posts/2024-01-my-post/');
  });

  it('should fallback for slug with incomplete date', () => {
    const invalidSlug = '2024-my-post';
    const url = getPostUrl(invalidSlug);
    
    expect(url).toBe('/posts/2024-my-post/');
  });

  it('should handle real-world blog post slugs', () => {
    const testCases = [
      { slug: '2023-03-02-github-for-non-technical-roles', expected: '/2023/03/02/github-for-non-technical-roles/' },
      { slug: '2014-11-06-rules-of-communicating-at-github', expected: '/2014/11/06/rules-of-communicating-at-github/' },
      { slug: '2016-09-13-seven-habits-of-highly-effective-githubbers', expected: '/2016/09/13/seven-habits-of-highly-effective-githubbers/' },
    ];

    testCases.forEach(({ slug, expected }) => {
      expect(getPostUrl(slug)).toBe(expected);
    });
  });
});

describe('getPostUrlOrNull', () => {
  it('should return URL for valid slug format', () => {
    const slug = '2024-01-15-my-blog-post';
    const url = getPostUrlOrNull(slug);
    
    expect(url).toBe('/2024/01/15/my-blog-post/');
  });

  it('should return null for invalid slug format', () => {
    const invalidSlug = 'invalid-slug-format';
    const url = getPostUrlOrNull(invalidSlug);
    
    expect(url).toBeNull();
  });

  it('should return null for slug without proper date format', () => {
    const invalidSlug = '2024-01-my-post';
    const url = getPostUrlOrNull(invalidSlug);
    
    expect(url).toBeNull();
  });

  it('should return null for slug with incomplete date', () => {
    const invalidSlug = '2024-my-post';
    const url = getPostUrlOrNull(invalidSlug);
    
    expect(url).toBeNull();
  });

  it('should return null for empty string', () => {
    const url = getPostUrlOrNull('');
    
    expect(url).toBeNull();
  });

  it('should handle valid dates correctly', () => {
    const testCases = [
      { slug: '2023-12-31-year-end', expected: '/2023/12/31/year-end/' },
      { slug: '2024-01-01-new-year', expected: '/2024/01/01/new-year/' },
      { slug: '2024-06-15-summer', expected: '/2024/06/15/summer/' },
    ];

    testCases.forEach(({ slug, expected }) => {
      expect(getPostUrlOrNull(slug)).toBe(expected);
    });
  });

  it('should differentiate between getPostUrl and getPostUrlOrNull behavior', () => {
    const invalidSlug = 'no-date-prefix';
    
    // getPostUrl returns fallback
    expect(getPostUrl(invalidSlug)).toBe('/posts/no-date-prefix/');
    
    // getPostUrlOrNull returns null
    expect(getPostUrlOrNull(invalidSlug)).toBeNull();
  });

  it('should return URL for slugs with long titles', () => {
    const slug = '2024-03-20-this-is-a-very-long-blog-post-title-with-many-words';
    const url = getPostUrlOrNull(slug);
    
    expect(url).toBe('/2024/03/20/this-is-a-very-long-blog-post-title-with-many-words/');
  });

  it('should return null for malformed date components', () => {
    const testCases = [
      '24-01-01-short-year', // Short year (doesn't match \d{4})
      '2024-1-1-no-zero-padding', // No zero padding (doesn't match \d{2})
    ];

    // Note: The regex only checks format (\d{4}-\d{2}-\d{2}-), not validity
    // So '2024-13-01' and '2024-01-32' would actually match the regex
    testCases.forEach(slug => {
      expect(getPostUrlOrNull(slug)).toBeNull();
    });
  });
});
