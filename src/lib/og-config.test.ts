/**
 * Tests for Open Graph image configuration
 *
 * Asserts the shape and invariants of the config (valid hex colors, sensible
 * sizes, aspect ratio) rather than pinning exact design values — the palette
 * and sizes are intentionally tunable without breaking the suite.
 */

import { describe, it, expect } from 'vitest';
import { defaultOGConfig } from './og-config';

const HEX = /^#[0-9A-Fa-f]{6}$/;

describe('defaultOGConfig', () => {
  it('should have standard OG image dimensions', () => {
    expect(defaultOGConfig.width).toBe(1200);
    expect(defaultOGConfig.height).toBe(630);
  });

  it('should have a background with gradient colors', () => {
    expect(defaultOGConfig.background).toBeDefined();
    expect(defaultOGConfig.background.color).toMatch(HEX);
    expect(defaultOGConfig.background.gradientFrom).toMatch(HEX);
    expect(defaultOGConfig.background.gradientTo).toMatch(HEX);
  });

  it('should have title configuration', () => {
    expect(defaultOGConfig.title).toBeDefined();
    expect(defaultOGConfig.title.fontFamily).toBe('Inter');
    expect(defaultOGConfig.title.fontSize).toBeGreaterThan(0);
    expect(defaultOGConfig.title.color).toMatch(HEX);
    expect(defaultOGConfig.title.lineHeight).toBeGreaterThan(0);
  });

  it('should have description configuration', () => {
    expect(defaultOGConfig.description).toBeDefined();
    expect(defaultOGConfig.description.fontFamily).toBe('Inter');
    expect(defaultOGConfig.description.fontSize).toBeGreaterThan(0);
    expect(defaultOGConfig.description.color).toMatch(HEX);
    expect(defaultOGConfig.description.lineHeight).toBeGreaterThan(0);
  });

  it('should have accent bar configuration', () => {
    expect(defaultOGConfig.accent).toBeDefined();
    expect(defaultOGConfig.accent.width).toBeGreaterThan(0);
    expect(defaultOGConfig.accent.color).toMatch(HEX);
    expect(defaultOGConfig.accent.gradientFrom).toMatch(HEX);
    expect(defaultOGConfig.accent.gradientTo).toMatch(HEX);
  });

  it('should have logo configuration with border', () => {
    expect(defaultOGConfig.logo).toBeDefined();
    expect(defaultOGConfig.logo.path).toBe('./assets/img/headshot.jpg');
    expect(defaultOGConfig.logo.size).toBeGreaterThan(0);
    expect(defaultOGConfig.logo.borderRadius).toBeGreaterThan(0);
    expect(defaultOGConfig.logo.borderWidth).toBeGreaterThan(0);
    expect(defaultOGConfig.logo.borderColor).toMatch(HEX);
  });

  it('should have domain configuration', () => {
    expect(defaultOGConfig.domain).toBeDefined();
    expect(defaultOGConfig.domain.text).toBe('ben.balter.com');
    expect(defaultOGConfig.domain.fontSize).toBeGreaterThan(0);
    expect(defaultOGConfig.domain.color).toMatch(HEX);
  });

  it('should have reasonable font sizes', () => {
    // Title should be larger than description
    expect(defaultOGConfig.title.fontSize).toBeGreaterThan(defaultOGConfig.description.fontSize);

    // Both should be reasonable sizes for OG images
    expect(defaultOGConfig.title.fontSize).toBeGreaterThan(32);
    expect(defaultOGConfig.description.fontSize).toBeGreaterThan(16);
  });

  it('should have valid hex colors for text', () => {
    expect(defaultOGConfig.title.color).toMatch(HEX);
    expect(defaultOGConfig.description.color).toMatch(HEX);
  });

  it('should have padding defined', () => {
    expect(defaultOGConfig.padding).toBeGreaterThan(0);
  });

  it('should have dimensions with 1.91:1 aspect ratio (Facebook/OpenGraph standard)', () => {
    const aspectRatio = defaultOGConfig.width / defaultOGConfig.height;
    expect(aspectRatio).toBeCloseTo(1.9048, 2);
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
