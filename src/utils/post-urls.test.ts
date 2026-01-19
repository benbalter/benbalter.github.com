/**
 * Tests for post URL generation utilities
 */

import { describe, it, expect } from 'vitest';
import { getPostUrl, getPostUrlOrNull, getDateFromSlug, formatPostDate, formatResumeDate } from './post-urls';

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

describe('getDateFromSlug', () => {
  it('should parse date from valid slug', () => {
    const slug = '2024-03-15-my-post';
    const date = getDateFromSlug(slug);
    
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(2); // 0-indexed, so March is 2
    expect(date.getDate()).toBe(15);
  });

  it('should handle different dates correctly', () => {
    const testCases = [
      { slug: '2023-01-01-new-year', year: 2023, month: 0, day: 1 },
      { slug: '2024-12-31-year-end', year: 2024, month: 11, day: 31 },
      { slug: '2024-06-15-mid-year', year: 2024, month: 5, day: 15 },
    ];

    testCases.forEach(({ slug, year, month, day }) => {
      const date = getDateFromSlug(slug);
      expect(date.getFullYear()).toBe(year);
      expect(date.getMonth()).toBe(month);
      expect(date.getDate()).toBe(day);
    });
  });

  it('should return current date for invalid slug', () => {
    const slug = 'invalid-slug';
    const date = getDateFromSlug(slug);
    const now = new Date();
    
    // Check it returns a valid date (should be close to current time)
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(now.getFullYear());
  });
});

describe('formatPostDate', () => {
  it('should format date as "Month Day, Year"', () => {
    const date = new Date(2024, 2, 15); // March 15, 2024
    const formatted = formatPostDate(date);
    
    expect(formatted).toBe('March 15, 2024');
  });

  it('should handle different months correctly', () => {
    const testCases = [
      { date: new Date(2024, 0, 1), expected: 'January 1, 2024' },
      { date: new Date(2024, 11, 31), expected: 'December 31, 2024' },
      { date: new Date(2023, 5, 15), expected: 'June 15, 2023' },
    ];

    testCases.forEach(({ date, expected }) => {
      expect(formatPostDate(date)).toBe(expected);
    });
  });
});

describe('formatResumeDate', () => {
  it('should format date as "Month Year"', () => {
    const formatted = formatResumeDate('2024-03-15');
    
    expect(formatted).toBe('March 2024');
  });

  it('should handle different dates correctly', () => {
    const testCases = [
      { dateString: '2023-01-01', expected: 'January 2023' },
      { dateString: '2024-12-31', expected: 'December 2024' },
      { dateString: '2024-06-15', expected: 'June 2024' },
    ];

    testCases.forEach(({ dateString, expected }) => {
      expect(formatResumeDate(dateString)).toBe(expected);
    });
  });

  it('should return null for invalid date strings', () => {
    const formatted = formatResumeDate('invalid-date');
    
    expect(formatted).toBeNull();
  });
});
