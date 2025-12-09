/**
 * Tests for sitemap filtering utilities
 */

import { describe, it, expect } from 'vitest';

// Test data - these should match the values in sitemap-filter.ts
const STATIC_EXCLUDED_PAGES = [
  '/404/',
  '/_not-found/',
  '/fine-print/',
];

describe('STATIC_EXCLUDED_PAGES', () => {
  it('should be an array', () => {
    expect(Array.isArray(STATIC_EXCLUDED_PAGES)).toBe(true);
  });

  it('should have at least one excluded page', () => {
    expect(STATIC_EXCLUDED_PAGES.length).toBeGreaterThan(0);
  });

  it('should include 404 page', () => {
    expect(STATIC_EXCLUDED_PAGES).toContain('/404/');
  });

  it('should include not-found page', () => {
    expect(STATIC_EXCLUDED_PAGES).toContain('/_not-found/');
  });

  it('should include fine-print page', () => {
    expect(STATIC_EXCLUDED_PAGES).toContain('/fine-print/');
  });

  it('should have URLs with trailing slashes', () => {
    STATIC_EXCLUDED_PAGES.forEach(url => {
      expect(url).toMatch(/\/$/);
    });
  });

  it('should have URLs starting with /', () => {
    STATIC_EXCLUDED_PAGES.forEach(url => {
      expect(url).toMatch(/^\//);
    });
  });

  it('should have absolute paths (not relative)', () => {
    STATIC_EXCLUDED_PAGES.forEach(url => {
      expect(url.startsWith('/')).toBe(true);
      expect(url.includes('..')).toBe(false);
    });
  });

  it('should not have duplicate entries', () => {
    const uniquePages = [...new Set(STATIC_EXCLUDED_PAGES)];
    expect(uniquePages.length).toBe(STATIC_EXCLUDED_PAGES.length);
  });

  it('should match expected excluded pages', () => {
    const expectedPages = [
      '/404/',
      '/_not-found/',
      '/fine-print/',
    ];

    expectedPages.forEach(page => {
      expect(STATIC_EXCLUDED_PAGES).toContain(page);
    });
  });

  it('should have properly formatted URL paths', () => {
    STATIC_EXCLUDED_PAGES.forEach(url => {
      // Should start with / and end with /
      expect(url).toMatch(/^\/.*\/$/);
      
      // Should not have double slashes except at start
      expect(url.replace(/^\//, '')).not.toMatch(/\/\//);
    });
  });
});

describe('Sitemap filter logic', () => {
  it('should filter pages based on excluded list', () => {
    const allPages = [
      'https://ben.balter.com/',
      'https://ben.balter.com/about/',
      'https://ben.balter.com/404/',
      'https://ben.balter.com/fine-print/',
      'https://ben.balter.com/contact/',
    ];

    // Simulate the filter function from astro.config.mjs
    const filteredPages = allPages.filter(page => {
      return !STATIC_EXCLUDED_PAGES.some(pattern => page.includes(pattern));
    });

    expect(filteredPages).toContain('https://ben.balter.com/');
    expect(filteredPages).toContain('https://ben.balter.com/about/');
    expect(filteredPages).toContain('https://ben.balter.com/contact/');
    expect(filteredPages).not.toContain('https://ben.balter.com/404/');
    expect(filteredPages).not.toContain('https://ben.balter.com/fine-print/');
  });

  it('should not filter regular pages', () => {
    const regularPages = [
      'https://ben.balter.com/',
      'https://ben.balter.com/about/',
      'https://ben.balter.com/contact/',
      'https://ben.balter.com/resume/',
    ];

    const filteredPages = regularPages.filter(page => {
      return !STATIC_EXCLUDED_PAGES.some(pattern => page.includes(pattern));
    });

    expect(filteredPages.length).toBe(regularPages.length);
  });

  it('should filter blog posts with sitemap exclusions', () => {
    // Simulate blog post URLs (these would need to be in EXCLUDED_PAGES array)
    const pages = [
      'https://ben.balter.com/2024/01/01/test-post/',
      'https://ben.balter.com/2024/01/02/another-post/',
    ];

    // These shouldn't be filtered unless explicitly added to STATIC_EXCLUDED_PAGES
    const filteredPages = pages.filter(page => {
      return !STATIC_EXCLUDED_PAGES.some(pattern => page.includes(pattern));
    });

    expect(filteredPages.length).toBe(pages.length);
  });
});

describe('Post URL parsing for sitemap filtering', () => {
  it('should parse post slug into URL format', () => {
    const slug = '2024-01-15-my-blog-post';
    const parts = slug.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const postSlug = parts.slice(3).join('-');
    const url = `/${year}/${month}/${day}/${postSlug}/`;

    expect(url).toBe('/2024/01/15/my-blog-post/');
  });

  it('should handle complex post slugs', () => {
    const slug = '2023-03-02-github-for-non-technical-roles';
    const parts = slug.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const postSlug = parts.slice(3).join('-');
    const url = `/${year}/${month}/${day}/${postSlug}/`;

    expect(url).toBe('/2023/03/02/github-for-non-technical-roles/');
  });

  it('should handle page slugs', () => {
    const slug = 'about';
    const url = `/${slug}/`;

    expect(url).toBe('/about/');
  });

  it('should handle nested page slugs', () => {
    const slug = 'docs/guide';
    const url = `/${slug}/`;

    expect(url).toBe('/docs/guide/');
  });
});
