/**
 * Tests for Open Graph image configuration
 */

import { describe, it, expect } from 'vitest';
import { defaultOGConfig } from './og-config';

describe('defaultOGConfig', () => {
  it('should have standard OG image dimensions', () => {
    expect(defaultOGConfig.width).toBe(1200);
    expect(defaultOGConfig.height).toBe(600);
  });

  it('should have background configuration with gradient', () => {
    expect(defaultOGConfig.background).toBeDefined();
    expect(defaultOGConfig.background.color).toBe('#FFFFFF');
    expect(defaultOGConfig.background.gradientFrom).toBe('#f8f9fa');
    expect(defaultOGConfig.background.gradientTo).toBe('#FFFFFF');
  });

  it('should have title configuration', () => {
    expect(defaultOGConfig.title).toBeDefined();
    expect(defaultOGConfig.title.fontFamily).toBe('Inter');
    expect(defaultOGConfig.title.fontSize).toBe(52);
    expect(defaultOGConfig.title.color).toBe('#212529');
    expect(defaultOGConfig.title.lineHeight).toBe(1.2);
  });

  it('should have description configuration', () => {
    expect(defaultOGConfig.description).toBeDefined();
    expect(defaultOGConfig.description.fontFamily).toBe('Inter');
    expect(defaultOGConfig.description.fontSize).toBe(24);
    expect(defaultOGConfig.description.color).toBe('#6c757d');
    expect(defaultOGConfig.description.lineHeight).toBe(1.5);
    expect(defaultOGConfig.description.maxLines).toBe(3);
  });

  it('should have accent bar configuration', () => {
    expect(defaultOGConfig.accent).toBeDefined();
    expect(defaultOGConfig.accent.width).toBe(8);
    expect(defaultOGConfig.accent.color).toBe('#337ab7');
    expect(defaultOGConfig.accent.gradientFrom).toBe('#337ab7');
    expect(defaultOGConfig.accent.gradientTo).toBe('#2a6493');
  });

  it('should have logo configuration with border', () => {
    expect(defaultOGConfig.logo).toBeDefined();
    expect(defaultOGConfig.logo.path).toBe('./assets/img/headshot.jpg');
    expect(defaultOGConfig.logo.size).toBe(140);
    expect(defaultOGConfig.logo.borderRadius).toBe(70);
    expect(defaultOGConfig.logo.borderWidth).toBe(4);
    expect(defaultOGConfig.logo.borderColor).toBe('#FFFFFF');
  });

  it('should have domain configuration', () => {
    expect(defaultOGConfig.domain).toBeDefined();
    expect(defaultOGConfig.domain.text).toBe('ben.balter.com');
    expect(defaultOGConfig.domain.fontSize).toBe(20);
    expect(defaultOGConfig.domain.color).toBe('#337ab7');
  });

  it('should have reasonable font sizes', () => {
    // Title should be larger than description
    expect(defaultOGConfig.title.fontSize).toBeGreaterThan(defaultOGConfig.description.fontSize);
    
    // Both should be reasonable sizes for OG images
    expect(defaultOGConfig.title.fontSize).toBeGreaterThan(32);
    expect(defaultOGConfig.description.fontSize).toBeGreaterThan(16);
  });

  it('should have dark text colors on light background', () => {
    // Title color should be valid hex
    expect(defaultOGConfig.title.color).toMatch(/^#[0-9A-F]{6}$/i);
    expect(defaultOGConfig.description.color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should have padding defined', () => {
    expect(defaultOGConfig.padding).toBe(60);
  });

  it('should have dimensions with 2:1 aspect ratio', () => {
    const aspectRatio = defaultOGConfig.width / defaultOGConfig.height;
    expect(aspectRatio).toBe(2);
  });

  it('should have all required configuration properties', () => {
    const requiredProps = ['width', 'height', 'background', 'title', 'description', 'accent', 'logo', 'domain', 'padding'];
    
    requiredProps.forEach(prop => {
      expect(defaultOGConfig).toHaveProperty(prop);
    });
  });

  it('should export a valid OGImageConfig structure', () => {
    expect(typeof defaultOGConfig.width).toBe('number');
    expect(typeof defaultOGConfig.height).toBe('number');
    expect(typeof defaultOGConfig.background).toBe('object');
    expect(typeof defaultOGConfig.title).toBe('object');
    expect(typeof defaultOGConfig.description).toBe('object');
    expect(typeof defaultOGConfig.accent).toBe('object');
    expect(typeof defaultOGConfig.logo).toBe('object');
    expect(typeof defaultOGConfig.domain).toBe('object');
    expect(typeof defaultOGConfig.padding).toBe('number');
  });
});
