/**
 * Tests for Open Graph image generator utilities and configuration
 */

import { describe, it, expect } from 'vitest';
import { defaultOGConfig } from './og-config';

describe('OG image layout configuration', () => {
  it('should use correct border height for paddingBottom calculation', () => {
    // Verify the config values that affect layout
    expect(defaultOGConfig.padding).toBe(80);
    expect(defaultOGConfig.border.height).toBe(20);
    
    // The paddingBottom should be padding - border.height
    // This test documents the expected relationship
    const expectedPaddingBottom = defaultOGConfig.padding - defaultOGConfig.border.height;
    expect(expectedPaddingBottom).toBe(60);
  });
  
  it('should have domain configured for bottom-right display', () => {
    expect(defaultOGConfig.domain).toBe('ben.balter.com');
  });
  
  it('should have logo path within allowed directories', () => {
    // Logo path should start with 'assets' (allowed directory)
    expect(defaultOGConfig.logo.path).toMatch(/^\.\/assets\//);
  });
  
  it('should have reasonable title max width after accounting for logo and gap', () => {
    // Title max width should leave room for logo and gap
    // Formula: width - padding*2 - logo.size - LOGO_TITLE_GAP (40)
    const logoTitleGap = 40;
    const titleMaxWidth = defaultOGConfig.width - 
      defaultOGConfig.padding * 2 - 
      defaultOGConfig.logo.size - 
      logoTitleGap;
    
    // Should be at least 700px for readable titles
    expect(titleMaxWidth).toBeGreaterThan(700);
    // And less than total width minus logo
    expect(titleMaxWidth).toBeLessThan(defaultOGConfig.width - defaultOGConfig.logo.size);
  });
  
  it('should have reasonable description max width after accounting for domain', () => {
    // Description max width should leave room for domain
    // Formula: width - padding*2 - DOMAIN_WIDTH_RESERVED (200)
    const domainWidthReserved = 200;
    const descriptionMaxWidth = defaultOGConfig.width - 
      defaultOGConfig.padding * 2 - 
      domainWidthReserved;
    
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
  it('should match Jekyll dimensions exactly', () => {
    expect(defaultOGConfig.width).toBe(1200);
    expect(defaultOGConfig.height).toBe(600);
  });
  
  it('should have 2:1 aspect ratio', () => {
    const aspectRatio = defaultOGConfig.width / defaultOGConfig.height;
    expect(aspectRatio).toBe(2);
  });
});

describe('OG image border', () => {
  it('should use Google blue from Jekyll config', () => {
    expect(defaultOGConfig.border.color).toBe('#4285F4');
  });
  
  it('should have border height matching Jekyll config', () => {
    expect(defaultOGConfig.border.height).toBe(20);
  });
});

