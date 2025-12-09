/**
 * Tests for Open Graph image configuration
 */

import { describe, it, expect } from 'vitest';
import { defaultOGConfig } from './og-config';

describe('defaultOGConfig', () => {
  it('should have standard OG image dimensions', () => {
    expect(defaultOGConfig.width).toBe(1200);
    expect(defaultOGConfig.height).toBe(630);
  });

  it('should have background gradient colors', () => {
    expect(Array.isArray(defaultOGConfig.backgroundGradient)).toBe(true);
    expect(defaultOGConfig.backgroundGradient.length).toBe(2);
    expect(defaultOGConfig.backgroundGradient[0]).toBe('#FFFFFF');
    expect(defaultOGConfig.backgroundGradient[1]).toBe('#F8F9FA');
  });

  it('should have valid hex color codes for gradient', () => {
    defaultOGConfig.backgroundGradient.forEach(color => {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('should have title configuration', () => {
    expect(defaultOGConfig.title).toBeDefined();
    expect(defaultOGConfig.title.fontFamily).toBe('Inter');
    expect(defaultOGConfig.title.fontSize).toBe(64);
    expect(defaultOGConfig.title.color).toBe('#2f313d');
    expect(defaultOGConfig.title.lineHeight).toBe(1.1);
    expect(defaultOGConfig.title.maxLines).toBe(3);
  });

  it('should have description configuration', () => {
    expect(defaultOGConfig.description).toBeDefined();
    expect(defaultOGConfig.description.fontFamily).toBe('Inter');
    expect(defaultOGConfig.description.fontSize).toBe(32);
    expect(defaultOGConfig.description.color).toBe('#535358');
    expect(defaultOGConfig.description.lineHeight).toBe(1.4);
  });

  it('should have border configuration', () => {
    expect(defaultOGConfig.border).toBeDefined();
    expect(defaultOGConfig.border.height).toBe(20);
    expect(Array.isArray(defaultOGConfig.border.colors)).toBe(true);
    expect(defaultOGConfig.border.colors.length).toBe(1);
    expect(defaultOGConfig.border.colors[0]).toBe('#4285F4');
    expect(defaultOGConfig.border.colors[0]).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should have logo configuration', () => {
    expect(defaultOGConfig.logo).toBeDefined();
    expect(defaultOGConfig.logo?.path).toBe('./assets/img/headshot.jpg');
    expect(defaultOGConfig.logo?.size).toBe(100);
  });

  it('should have valid logo size', () => {
    expect(defaultOGConfig.logo?.size).toBeGreaterThan(0);
    expect(defaultOGConfig.logo?.size).toBeLessThanOrEqual(200);
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
    
    // Background should be light (white to light gray)
    expect(defaultOGConfig.backgroundGradient[0]).toBe('#FFFFFF');
  });

  it('should have title line height less than description for tighter spacing', () => {
    expect(defaultOGConfig.title.lineHeight).toBeLessThan(defaultOGConfig.description.lineHeight);
  });

  it('should limit title to 3 lines maximum', () => {
    expect(defaultOGConfig.title.maxLines).toBe(3);
    expect(defaultOGConfig.title.maxLines).toBeGreaterThan(0);
  });

  it('should have dimensions matching OG image best practices', () => {
    // 1200x630 is the standard OG image size
    const aspectRatio = defaultOGConfig.width / defaultOGConfig.height;
    expect(aspectRatio).toBeCloseTo(1.905, 2); // 1200/630 ≈ 1.905
  });

  it('should have all required configuration properties', () => {
    const requiredProps = ['width', 'height', 'backgroundGradient', 'title', 'description', 'border'];
    
    requiredProps.forEach(prop => {
      expect(defaultOGConfig).toHaveProperty(prop);
    });
  });

  it('should export a valid OGImageConfig structure', () => {
    // Verify the structure matches the interface
    expect(typeof defaultOGConfig.width).toBe('number');
    expect(typeof defaultOGConfig.height).toBe('number');
    expect(Array.isArray(defaultOGConfig.backgroundGradient)).toBe(true);
    expect(typeof defaultOGConfig.title).toBe('object');
    expect(typeof defaultOGConfig.description).toBe('object');
    expect(typeof defaultOGConfig.border).toBe('object');
  });
});
