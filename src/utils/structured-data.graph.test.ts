/**
 * Tests for schemaToJsonLd and schemaToGraphJsonLd utilities
 */

import { describe, it, expect } from 'vitest';
import {
  generatePersonSchema,
  generateWebSiteSchema,
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  schemaToJsonLd,
  schemaToGraphJsonLd,
} from './structured-data';

describe('schemaToJsonLd', () => {
  it('should convert schema to JSON-LD string', () => {
    const schema = generatePersonSchema();
    const jsonLd = schemaToJsonLd(schema);
    
    expect(typeof jsonLd).toBe('string');
    expect(jsonLd).toContain('"@context"');
    expect(jsonLd).toContain('"@type"');
  });

  it('should format JSON with indentation', () => {
    const schema = generatePersonSchema();
    const jsonLd = schemaToJsonLd(schema);
    
    // Check for proper indentation (2 spaces)
    expect(jsonLd).toContain('  "@context"');
  });

  it('should handle array of schemas', () => {
    const schemas = [
      generatePersonSchema(),
      generateWebSiteSchema(),
    ];
    const jsonLd = schemaToJsonLd(schemas);
    
    expect(typeof jsonLd).toBe('string');
    expect(jsonLd).toContain('[');
    expect(jsonLd).toContain(']');
  });

  it('should produce valid JSON', () => {
    const schema = generatePersonSchema();
    const jsonLd = schemaToJsonLd(schema);
    
    expect(() => JSON.parse(jsonLd)).not.toThrow();
  });

  it('should preserve schema structure', () => {
    const schema = generatePersonSchema();
    const jsonLd = schemaToJsonLd(schema);
    const parsed = JSON.parse(jsonLd);
    
    expect(parsed['@context']).toBe(schema['@context']);
    expect(parsed).toHaveProperty('@type');
    expect(parsed).toHaveProperty('name');
  });

  it('should handle BlogPosting schema', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    });
    const jsonLd = schemaToJsonLd(schema);
    
    expect(jsonLd).toContain('BlogPosting');
    expect(() => JSON.parse(jsonLd)).not.toThrow();
  });

  it('should handle BreadcrumbList schema', () => {
    const schema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://ben.balter.com/' },
      { name: 'Blog' },
    ]);
    const jsonLd = schemaToJsonLd(schema);
    
    expect(jsonLd).toContain('BreadcrumbList');
    expect(() => JSON.parse(jsonLd)).not.toThrow();
  });
});

describe('schemaToGraphJsonLd', () => {
  it('should wrap schemas in @graph envelope', () => {
    const schemas = [
      generatePersonSchema(),
      generateWebSiteSchema(),
    ];
    const jsonLd = schemaToGraphJsonLd(schemas);
    const parsed = JSON.parse(jsonLd);

    expect(parsed).toHaveProperty('@graph');
    expect(Array.isArray(parsed['@graph'])).toBe(true);
    expect(parsed['@graph']).toHaveLength(2);
  });

  it('should strip individual @context from schemas', () => {
    const schemas = [
      generatePersonSchema(),
      generateWebSiteSchema(),
    ];
    const jsonLd = schemaToGraphJsonLd(schemas);
    const parsed = JSON.parse(jsonLd);

    for (const item of parsed['@graph']) {
      expect(item).not.toHaveProperty('@context');
    }
  });

  it('should have single top-level @context', () => {
    const schemas = [
      generatePersonSchema(),
      generateWebSiteSchema(),
    ];
    const jsonLd = schemaToGraphJsonLd(schemas);
    const parsed = JSON.parse(jsonLd);

    expect(parsed['@context']).toBe('https://schema.org');
  });

  it('should produce valid JSON', () => {
    const schemas = [
      generatePersonSchema(),
      generateWebSiteSchema(),
      generateBreadcrumbSchema([{ name: 'Home', url: 'https://ben.balter.com/' }]),
    ];
    const jsonLd = schemaToGraphJsonLd(schemas);

    expect(() => JSON.parse(jsonLd)).not.toThrow();
  });
});
