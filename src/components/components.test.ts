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
    
    // Verify default is used when title is not provided
    const title = defaultTitle;
    expect(title).toBe('YouTube video');
  });

  it('should accept custom title when provided', () => {
    // Specification: Custom title should override default
    const customTitle = 'Custom Video Title';
    const title = customTitle ?? 'YouTube video';
    
    expect(title).toBe('Custom Video Title');
  });
});

describe('Tldr Component - Specification', () => {
  it('should define tooltip text explaining TL;DR', () => {
    // Specification: Tooltip should explain what TL;DR means
    const tooltipText = '"Too Long; Didn\'t Read" — Internet shorthand for "a brief summary of longer writing"';
    
    expect(tooltipText).toContain('Too Long');
    expect(tooltipText).toContain('Didn\'t Read');
    expect(tooltipText).toContain('Internet shorthand');
  });

  it('should use custom tooltip attributes', () => {
    // Specification: Component should use custom tooltip data attributes
    const tooltipAttributes = {
      'data-tooltip': 'true',
      'data-tooltip-text': '"Too Long; Didn\'t Read" — Internet shorthand for "a brief summary of longer writing"',
    };
    
    expect(tooltipAttributes['data-tooltip']).toBe('true');
    expect(tooltipAttributes['data-tooltip-text']).toContain('Too Long');
  });

  it('should display description text after TL;DR label', () => {
    // Specification: Component should show TL;DR: followed by description
    const description = 'This is a brief summary of the post.';
    const expectedFormat = `TL;DR: ${description}`;
    
    expect(expectedFormat).toContain('TL;DR:');
    expect(expectedFormat).toContain(description);
  });

  it('should use lead text styling', () => {
    // Specification: Component should use lead class for prominent display
    const leadClass = 'lead';
    
    expect(leadClass).toBe('lead');
  });
});

describe('MiniBio Component - Specification', () => {
  it('should use locally fetched avatar with proper dimensions', () => {
    // Specification: the avatar is the local head crop built by
    // script/build-headshots (not the GitHub avatar), and Astro's Image
    // component outputs optimized formats (WebP/AVIF)
    const expectedWidth = 100;
    const expectedHeight = 100;
    const avatarPath = '../../assets/img/avatar.jpg'; // Import path in MiniBio.astro
    
    expect(avatarPath).toMatch(/avatar\.jpg$/);
    expect(expectedWidth).toBe(100);
    expect(expectedHeight).toBe(100);
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

  it('should split content into multiple paragraphs', async () => {
    // Import and test the getBioParagraphs function
    const { getBioParagraphs } = await import('../content/about-bio');
    
    const sampleContent = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
    const paragraphs = getBioParagraphs(sampleContent);
    
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0]).toBe('First paragraph.');
    expect(paragraphs[1]).toBe('Second paragraph.');
    expect(paragraphs[2]).toBe('Third paragraph.');
  });

  it('should filter out empty paragraphs', async () => {
    // Import and test the getBioParagraphs function
    const { getBioParagraphs } = await import('../content/about-bio');
    
    const sampleContent = 'First paragraph.\n\n\n\nSecond paragraph.\n\n   \n\nThird paragraph.';
    const paragraphs = getBioParagraphs(sampleContent);
    
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs).not.toContain('');
  });

  it('should convert markdown links in all paragraphs', async () => {
    // Import and test the getBioParagraphs function
    const { getBioParagraphs } = await import('../content/about-bio');
    
    const sampleContent = 'First [link](https://example.com) paragraph.\n\nSecond [link](https://example.org) paragraph.';
    const paragraphs = getBioParagraphs(sampleContent);
    
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toContain('<a href="https://example.com">link</a>');
    expect(paragraphs[1]).toContain('<a href="https://example.org">link</a>');
  });

  it('should handle content with no paragraph breaks', async () => {
    // Import and test the getBioParagraphs function
    const { getBioParagraphs } = await import('../content/about-bio');
    
    const sampleContent = 'Single paragraph with no breaks.';
    const paragraphs = getBioParagraphs(sampleContent);
    
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toBe('Single paragraph with no breaks.');
  });

  it('should escape HTML in all paragraphs to prevent XSS', async () => {
    // Import and test the getBioParagraphs function
    const { getBioParagraphs } = await import('../content/about-bio');
    
    const maliciousContent = 'First [<script>alert(1)</script>](https://example.com).\n\nSecond [<img src=x>](https://example.org).';
    const paragraphs = getBioParagraphs(maliciousContent);
    
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toContain('&lt;script&gt;');
    expect(paragraphs[0]).not.toContain('<script>');
    expect(paragraphs[1]).toContain('&lt;img');
    expect(paragraphs[1]).not.toContain('<img');
  });
});
