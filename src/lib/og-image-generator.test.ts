/**
 * Tests for Open Graph image generator utilities and configuration
 */

import { describe, it, expect } from 'vitest';
import { defaultOGConfig } from './og-config';
import { truncateDescription } from './og-image-generator';

describe('truncateDescription', () => {
  it('should return text unchanged if under max length', () => {
    const text = 'Short description';
    expect(truncateDescription(text, 150)).toBe('Short description');
  });
  
  it('should truncate text at word boundary and add ellipsis', () => {
    const text = 'This is a longer description that needs to be truncated at a reasonable point';
    const result = truncateDescription(text, 50);
    expect(result).toBe('This is a longer description that needs to be…');
    expect(result.length).toBeLessThanOrEqual(51); // 50 + ellipsis
  });
  
  it('should remove markdown links and keep link text', () => {
    const text = 'Check out [this link](https://example.com) for more info';
    expect(truncateDescription(text, 150)).toBe('Check out this link for more info');
  });
  
  it('should remove bold markdown formatting', () => {
    const text = 'This has **bold** text';
    expect(truncateDescription(text, 150)).toBe('This has bold text');
  });
  
  it('should remove italic markdown formatting', () => {
    const text = 'This has *italic* and _also italic_ text';
    expect(truncateDescription(text, 150)).toBe('This has italic and also italic text');
  });
  
  it('should remove strikethrough markdown formatting', () => {
    const text = 'This has ~strikethrough~ text';
    expect(truncateDescription(text, 150)).toBe('This has strikethrough text');
  });
  
  it('should remove inline code markdown formatting', () => {
    const text = 'This has `code` in it';
    expect(truncateDescription(text, 150)).toBe('This has code in it');
  });
  
  it('should handle multiple markdown links', () => {
    const text = '[First](url1), [second](url2), and [third](url3) links';
    expect(truncateDescription(text, 150)).toBe('First, second, and third links');
  });
  
  it('should trim whitespace', () => {
    const text = '  Text with spaces  ';
    expect(truncateDescription(text, 150)).toBe('Text with spaces');
  });
  
  it('should handle empty string', () => {
    expect(truncateDescription('', 150)).toBe('');
  });
  
  it('should handle text exactly at max length', () => {
    const text = 'A'.repeat(150);
    expect(truncateDescription(text, 150)).toBe(text);
  });
  
  it('should use default max length of 150', () => {
    const longText = 'Word '.repeat(50); // 250 chars
    const result = truncateDescription(longText);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(151); // 150 + ellipsis
  });
});

describe('OG image layout configuration', () => {
  it('should have proper padding and accent width', () => {
    expect(defaultOGConfig.padding).toBe(60);
    expect(defaultOGConfig.accent.width).toBe(8);
  });
  
  it('should have domain configured with proper styling', () => {
    expect(defaultOGConfig.domain.text).toBe('ben.balter.com');
    expect(defaultOGConfig.domain.color).toBe('#337ab7');
    expect(defaultOGConfig.domain.fontSize).toBe(20);
  });
  
  it('should have logo path within allowed directories', () => {
    // Logo path should start with 'assets' (allowed directory)
    expect(defaultOGConfig.logo.path).toMatch(/^\.\/assets\//);
  });
  
  it('should have reasonable title max width after accounting for logo, accent, and gap', () => {
    // Title max width should leave room for logo, accent, and gap
    // Formula: width - (padding + accent.width + 20) - padding - logo.size - LOGO_TITLE_GAP (40)
    const contentPaddingLeft = defaultOGConfig.padding + defaultOGConfig.accent.width + 20;
    const logoTitleGap = 40;
    const titleMaxWidth = defaultOGConfig.width - 
      contentPaddingLeft - 
      defaultOGConfig.padding - 
      defaultOGConfig.logo.size - 
      logoTitleGap;
    
    // Should be at least 600px for readable titles
    expect(titleMaxWidth).toBeGreaterThan(600);
    // And less than total width minus logo
    expect(titleMaxWidth).toBeLessThan(defaultOGConfig.width - defaultOGConfig.logo.size);
  });
  
  it('should have reasonable description max width', () => {
    // Description max width should leave room for content
    const contentPaddingLeft = defaultOGConfig.padding + defaultOGConfig.accent.width + 20;
    const descriptionMaxWidth = defaultOGConfig.width - contentPaddingLeft - defaultOGConfig.padding - 40;
    
    // Should be at least 700px for readable descriptions
    expect(descriptionMaxWidth).toBeGreaterThan(700);
  });
});

describe('OG image security configuration', () => {
  it('should have logo path that does not contain traversal characters', () => {
    expect(defaultOGConfig.logo.path).not.toContain('..');
    expect(defaultOGConfig.logo.path).not.toMatch(/[<>:"|?*]/); // No invalid path chars
  });
  
  it('should have logo path starting with allowed directory', () => {
    const allowedDirs = ['assets'];
    const logoPath = defaultOGConfig.logo.path.replace(/^\.\//, '');
    const startsWithAllowed = allowedDirs.some(dir => logoPath.startsWith(dir + '/'));
    expect(startsWithAllowed).toBe(true);
  });
});

describe('OG image dimensions', () => {
  it('should have standard OG image dimensions', () => {
    expect(defaultOGConfig.width).toBe(1200);
    expect(defaultOGConfig.height).toBe(600);
  });
  
  it('should have 2:1 aspect ratio', () => {
    const aspectRatio = defaultOGConfig.width / defaultOGConfig.height;
    expect(aspectRatio).toBe(2);
  });
});

describe('OG image accent bar', () => {
  it('should use primary brand color', () => {
    expect(defaultOGConfig.accent.color).toBe('#337ab7');
  });
  
  it('should have accent bar width', () => {
    expect(defaultOGConfig.accent.width).toBe(8);
  });
  
  it('should have gradient colors', () => {
    expect(defaultOGConfig.accent.gradientFrom).toBe('#337ab7');
    expect(defaultOGConfig.accent.gradientTo).toBe('#2a6493');
  });
});

describe('OG image logo styling', () => {
  it('should have circular logo with border', () => {
    expect(defaultOGConfig.logo.borderRadius).toBe(70);
    expect(defaultOGConfig.logo.borderWidth).toBe(4);
    expect(defaultOGConfig.logo.borderColor).toBe('#FFFFFF');
  });
  
  it('should have logo size that fits within layout', () => {
    expect(defaultOGConfig.logo.size).toBe(140);
    expect(defaultOGConfig.logo.size).toBeLessThan(defaultOGConfig.height / 2);
  });
  
  it('should have borderRadius greater than borderWidth for safe calculation', () => {
    expect(defaultOGConfig.logo.borderRadius).toBeGreaterThan(defaultOGConfig.logo.borderWidth);
  });
});
