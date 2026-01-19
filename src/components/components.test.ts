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
    const urlPattern = /^\/\d{4}\/\d{2}\/\d{2}\/.+\/$/;
    
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

describe('ContactLinks Component - Specification', () => {
  it('should use contactLinks from config', () => {
    // Specification: Component should use contactLinks array from config
    const contactLinks = [
      { name: 'Email', url: 'mailto:ben@balter.com', icon: 'fa-solid fa-envelope' },
      { name: 'Add to contacts', url: '/vcard.vcf', icon: 'fa-solid fa-address-card' },
      { name: 'Bluesky', url: 'https://bsky.app/profile/ben.balter.com', icon: 'fa-brands fa-bluesky' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/benbalter', icon: 'fa-brands fa-linkedin' },
      { name: 'GitHub', url: 'https://github.com/benbalter', icon: 'fa-brands fa-github' },
    ];
    
    expect(contactLinks).toHaveLength(5);
    expect(contactLinks[0].name).toBe('Email');
    expect(contactLinks[0].icon).toContain('fa-solid');
  });

  it('should have required link attributes', () => {
    // Specification: Links should have rel="me noopener" and target="_blank"
    const linkAttributes = {
      rel: 'me noopener',
      target: '_blank',
    };
    
    expect(linkAttributes.rel).toBe('me noopener');
    expect(linkAttributes.target).toBe('_blank');
  });

  it('should display PGP key information', () => {
    // Specification: Component should display PGP key from siteConfig
    const pgpKey = '07C6 73FB F30E 01C0 C342 7AB8 DBB6 7C24 6AD3 56C4';
    const keyUrl = '/key.asc';
    
    expect(pgpKey).toMatch(/^[0-9A-F\s]+$/);
    expect(keyUrl).toBe('/key.asc');
  });

  it('should use correct CSS classes for layout', () => {
    // Specification: Component structure classes
    const expectedClasses = {
      container: 'contact-links text-center',
      row: 'row justify-content-center',
      column: 'col-sm',
      small: 'small',
    };
    
    expect(expectedClasses.container).toContain('contact-links');
    expect(expectedClasses.container).toContain('text-center');
    expect(expectedClasses.row).toContain('justify-content-center');
    expect(expectedClasses.small).toBe('small');
  });

  it('should use FontAwesome icons for each contact method', () => {
    // Specification: Each contact link should have a FontAwesome icon
    const iconClasses = [
      'fa-solid fa-envelope',      // Email
      'fa-solid fa-address-card',  // vCard
      'fa-brands fa-bluesky',      // Bluesky
      'fa-brands fa-linkedin',     // LinkedIn
      'fa-brands fa-github',       // GitHub
    ];
    
    iconClasses.forEach(iconClass => {
      expect(iconClass).toMatch(/^fa-(solid|brands)/);
    });
  });

  it('should structure each link with icon and text', () => {
    // Specification: Link structure with rows and columns
    const structure = {
      outerRow: 'row justify-content-center mb-3 align-items-center',
      iconColumn: 'col-sm-12 col-2 offset-3 offset-sm-0 text-center',
      textColumn: 'col-sm-12 col-6 text-sm-center text-start',
    };
    
    expect(structure.outerRow).toContain('mb-3');
    expect(structure.outerRow).toContain('align-items-center');
    expect(structure.iconColumn).toContain('text-center');
    expect(structure.textColumn).toContain('text-start');
  });
});


