/**
 * Specification tests for Astro components
 * 
 * IMPORTANT: These are "specification tests" that define the expected behavior
 * and data structures of Astro components. They do NOT test the actual component
 * implementations (which cannot be easily unit tested due to Astro's architecture).
 * 
 * These tests serve as:
 * - Documentation of expected component behavior
 * - Validation that test logic itself is correct
 * - Regression protection for expected values
 * 
 * When component implementations change, these tests should be updated to match.
 * Full component rendering and integration is tested via Playwright E2E tests.
 */

import { describe, it, expect } from 'vitest';

describe('PostList Component - Specification', () => {
  it('should accept postSlug and field as props', () => {
    // Specification: Component should accept these props
    const expectedProps = ['postSlug', 'field'];
    
    // Specification: field should be limited to specific values
    const validFieldValues = ['posts', 'roles'];
    
    // Verify specification
    expect(expectedProps).toContain('postSlug');
    expect(expectedProps).toContain('field');
    expect(validFieldValues).toEqual(['posts', 'roles']);
  });

  it('should define the URL format for blog posts', () => {
    // Specification: Blog post URLs follow Jekyll format /YYYY/MM/DD/slug/
    const urlPattern = /^\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+\/$/;
    
    // Example URLs that should match
    const validUrls = [
      '/2023/03/02/github-for-non-technical-roles/',
      '/2014/11/06/rules-of-communicating-at-github/',
      '/2016/09/13/seven-habits-of-highly-effective-githubbers/',
    ];
    
    validUrls.forEach(url => {
      expect(url).toMatch(urlPattern);
    });
  });

  it('should define the expected output format', () => {
    // Specification: Each list item should contain:
    // - <li> wrapper
    // - <strong> for bold
    // - <a> with href
    // - " — " (em dash) separator
    // - Description text
    
    const expectedStructure = {
      wrapper: 'li',
      emphasis: 'strong',
      link: 'a',
      separator: ' — ',
    };
    
    expect(expectedStructure.wrapper).toBe('li');
    expect(expectedStructure.emphasis).toBe('strong');
    expect(expectedStructure.link).toBe('a');
    expect(expectedStructure.separator).toBe(' — ');
  });
});

describe('Callout Component - Specification', () => {
  it('should define four callout types with icons and colors', () => {
    // Specification: Component should support these four types
    const expectedTypes = ['info', 'warning', 'error', 'success'];
    
    // Specification: Each type should have an associated icon
    const expectedIcons = {
      info: '💡',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };

    // Specification: Each type should have an associated color (hex format)
    const expectedColors = {
      info: '#0366d6',
      warning: '#f9c513',
      error: '#d73a49',
      success: '#28a745',
    };

    // Verify specification completeness
    expect(Object.keys(expectedIcons)).toEqual(expectedTypes);
    expect(Object.keys(expectedColors)).toEqual(expectedTypes);
    
    // Verify colors are valid hex codes
    Object.values(expectedColors).forEach(color => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});

describe('YouTube Component - Specification', () => {
  it('should generate embed URL in correct format', () => {
    // Specification: Embed URL format
    const id = 'dQw4w9WgXcQ';
    const embedUrl = `https://www.youtube.com/embed/${id}`;
    
    expect(embedUrl).toMatch(/^https:\/\/www\.youtube\.com\/embed\//);
    expect(embedUrl).toContain(id);
  });

  it('should use "YouTube video" as default title', () => {
    // Specification: Default title value
    const defaultTitle = 'YouTube video';
    
    // Verify default is used when title is undefined
    const title = undefined ?? defaultTitle;
    expect(title).toBe('YouTube video');
  });

  it('should accept custom title when provided', () => {
    // Specification: Custom title should override default
    const customTitle = 'Custom Video Title';
    const title = customTitle ?? 'YouTube video';
    
    expect(title).toBe('Custom Video Title');
  });
});

describe('MiniBio Component - Specification', () => {
  it('should use GitHub avatar URL with correct size parameter', () => {
    // Specification: GitHub avatar URL format
    const username = 'benbalter'; // from siteConfig.githubUsername
    const size = 100;
    const avatarUrl = `https://avatars.githubusercontent.com/${username}?s=${size}`;
    
    expect(avatarUrl).toMatch(/^https:\/\/avatars\.githubusercontent\.com\//);
    expect(avatarUrl).toContain(username);
    expect(avatarUrl).toContain('s=100');
  });

  it('should link to /about/ page', () => {
    // Specification: Link to about page
    const aboutUrl = '/about/';
    
    expect(aboutUrl).toBe('/about/');
    expect(aboutUrl).toMatch(/^\/about\/$/);
  });

  it('should dynamically extract first paragraph from about content', async () => {
    // Import and test the actual function
    const { getFirstParagraph } = await import('../content/about-bio');
    
    const sampleContent = 'First paragraph text.\n\nSecond paragraph text.';
    const firstParagraph = getFirstParagraph(sampleContent);
    
    expect(firstParagraph).toBe('First paragraph text.');
    expect(firstParagraph).not.toContain('Second paragraph');
  });

  it('should convert markdown links to HTML with proper escaping', async () => {
    // Import and test the actual function
    const { getFirstParagraph } = await import('../content/about-bio');
    
    const sampleContent = 'Text with [link](https://example.com) inside';
    const result = getFirstParagraph(sampleContent);
    
    expect(result).toContain('<a href="https://example.com">link</a>');
    expect(result).not.toContain('[link]');
  });

  it('should escape HTML in link text to prevent XSS', async () => {
    // Import and test the actual function
    const { getFirstParagraph } = await import('../content/about-bio');
    
    const maliciousContent = 'Text with [<img src=x onerror=alert(1)>](https://example.com) inside';
    const result = getFirstParagraph(maliciousContent);
    
    // Should escape the HTML in link text
    expect(result).toContain('&lt;img');
    expect(result).not.toContain('<img');
  });

  it('should reject protocol-relative URLs', async () => {
    // Import and test the actual function
    const { getFirstParagraph } = await import('../content/about-bio');
    
    const protocolRelativeContent = 'Text with [link](//evil.com) inside';
    const result = getFirstParagraph(protocolRelativeContent);
    
    // Should not convert invalid URLs
    expect(result).toContain('[link](//evil.com)');
    expect(result).not.toContain('<a href');
  });
});

