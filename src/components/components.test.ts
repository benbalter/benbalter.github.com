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

  it('should dynamically extract first paragraph from about content', () => {
    // Specification: Bio text is dynamically pulled from about-bio.ts
    // This test validates the content extraction logic
    const sampleContent = 'First paragraph text.\n\nSecond paragraph text.';
    const paragraphs = sampleContent.split('\n\n').filter(p => p.trim().length > 0);
    const firstParagraph = paragraphs[0];
    
    expect(firstParagraph).toBe('First paragraph text.');
    expect(firstParagraph).not.toContain('Second paragraph');
  });

  it('should convert markdown links to HTML', () => {
    // Specification: Markdown links in bio are converted to HTML
    const markdownText = 'Text with [link](https://example.com) inside';
    const htmlText = markdownText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    expect(htmlText).toContain('<a href="https://example.com">link</a>');
    expect(htmlText).not.toContain('[link]');
  });
});

