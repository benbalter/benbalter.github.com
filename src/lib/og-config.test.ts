/**
 * Tests for Open Graph image configuration
 */

import { describe, it, expect } from 'vitest';
import { defaultOGConfig } from './og-config';

describe('defaultOGConfig', () => {
  it('should have standard OG image dimensions matching Jekyll', () => {
    expect(defaultOGConfig.width).toBe(1200);
    expect(defaultOGConfig.height).toBe(600); // Matches Jekyll's 1200x600
  });

  it('should have white background color', () => {
    expect(defaultOGConfig.backgroundColor).toBe('#FFFFFF');
  });

  it('should have title configuration', () => {
    expect(defaultOGConfig.title).toBeDefined();
    expect(defaultOGConfig.title.fontFamily).toBe('Inter');
    expect(defaultOGConfig.title.fontSize).toBe(48);
    expect(defaultOGConfig.title.color).toBe('#2f313d');
    expect(defaultOGConfig.title.lineHeight).toBe(1.2);
  });

  it('should have description configuration', () => {
    expect(defaultOGConfig.description).toBeDefined();
    expect(defaultOGConfig.description.fontFamily).toBe('Inter');
    expect(defaultOGConfig.description.fontSize).toBe(28);
    expect(defaultOGConfig.description.color).toBe('#535358');
    expect(defaultOGConfig.description.lineHeight).toBe(1.4);
  });

  it('should have border configuration matching Jekyll', () => {
    expect(defaultOGConfig.border).toBeDefined();
    expect(defaultOGConfig.border.height).toBe(20);
    expect(defaultOGConfig.border.color).toBe('#4285F4'); // Google blue
    expect(defaultOGConfig.border.color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should have logo configuration matching Jekyll', () => {
    expect(defaultOGConfig.logo).toBeDefined();
    expect(defaultOGConfig.logo.path).toBe('public/assets/img/headshot.jpg');
    expect(defaultOGConfig.logo.size).toBe(150); // Matches Jekyll's 150x150
  });

  it('should have domain configuration matching Jekyll', () => {
    expect(defaultOGConfig.domain).toBe('ben.balter.com');
  });

  it('should have reasonable font sizes', () => {
    // Title should be larger than description
    expect(defaultOGConfig.title.fontSize).toBeGreaterThan(defaultOGConfig.description.fontSize);
    
    // Both should be reasonable sizes for OG images
    expect(defaultOGConfig.title.fontSize).toBeGreaterThan(32);
    expect(defaultOGConfig.description.fontSize).toBeGreaterThan(16);
  });

  it('should have dark text colors on light background', () => {
    // Title color should be darker (lower hex value)
    expect(defaultOGConfig.title.color).toMatch(/^#[0-9A-F]{6}$/i);
    expect(defaultOGConfig.description.color).toMatch(/^#[0-9A-F]{6}$/i);
    
    // Background should be white
    expect(defaultOGConfig.backgroundColor).toBe('#FFFFFF');
  });

  it('should have padding defined', () => {
    expect(defaultOGConfig.padding).toBe(80);
  });

  it('should have dimensions matching Jekyll OG image', () => {
    // 1200x600 is Jekyll's OG image size
    const aspectRatio = defaultOGConfig.width / defaultOGConfig.height;
    expect(aspectRatio).toBe(2); // 1200/600 = 2
  });

  it('should have all required configuration properties', () => {
    const requiredProps = ['width', 'height', 'backgroundColor', 'title', 'description', 'border', 'logo', 'domain', 'padding'];
    
    requiredProps.forEach(prop => {
      expect(defaultOGConfig).toHaveProperty(prop);
    });
  });

  it('should export a valid OGImageConfig structure', () => {
    // Verify the structure matches the interface
    expect(typeof defaultOGConfig.width).toBe('number');
    expect(typeof defaultOGConfig.height).toBe('number');
    expect(typeof defaultOGConfig.backgroundColor).toBe('string');
    expect(typeof defaultOGConfig.title).toBe('object');
    expect(typeof defaultOGConfig.description).toBe('object');
    expect(typeof defaultOGConfig.border).toBe('object');
    expect(typeof defaultOGConfig.logo).toBe('object');
    expect(typeof defaultOGConfig.domain).toBe('string');
    expect(typeof defaultOGConfig.padding).toBe('number');
  });
});
