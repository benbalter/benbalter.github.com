/**
 * Tests for BreadcrumbList structured data schema
 */

import { describe, it, expect } from 'vitest';
import { generateBreadcrumbSchema } from './structured-data';

describe('generateBreadcrumbSchema', () => {
  it('should generate valid BreadcrumbList schema', () => {
    const items = [
      { name: 'Home', url: 'https://ben.balter.com/' },
      { name: 'Blog', url: 'https://ben.balter.com/blog/' },
    ];
    
    const schema = generateBreadcrumbSchema(items);
    
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
  });

  it('should generate list items with correct positions', () => {
    const items = [
      { name: 'Home', url: 'https://ben.balter.com/' },
      { name: 'Blog', url: 'https://ben.balter.com/blog/' },
      { name: 'Post' },
    ];
    
    const schema = generateBreadcrumbSchema(items);
    
    expect(schema).toHaveProperty('itemListElement');
    expect(Array.isArray(schema.itemListElement)).toBe(true);
    if (Array.isArray(schema.itemListElement)) {
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0]).toHaveProperty('position', 1);
      expect(schema.itemListElement[1]).toHaveProperty('position', 2);
      expect(schema.itemListElement[2]).toHaveProperty('position', 3);
    }
  });

  it('should include item URLs when provided', () => {
    const items = [
      { name: 'Home', url: 'https://ben.balter.com/' },
      { name: 'Blog', url: 'https://ben.balter.com/blog/' },
    ];
    
    const schema = generateBreadcrumbSchema(items);
    
    expect(schema).toHaveProperty('itemListElement');
    if (Array.isArray(schema.itemListElement)) {
      expect(schema.itemListElement[0]).toHaveProperty('item', 'https://ben.balter.com/');
      expect(schema.itemListElement[1]).toHaveProperty('item', 'https://ben.balter.com/blog/');
    }
  });

  it('should omit item URL for last breadcrumb (current page)', () => {
    const items = [
      { name: 'Home', url: 'https://ben.balter.com/' },
      { name: 'Current Page' },
    ];
    
    const schema = generateBreadcrumbSchema(items);
    
    expect(schema).toHaveProperty('itemListElement');
    if (Array.isArray(schema.itemListElement)) {
      expect(schema.itemListElement[0]).toHaveProperty('item', 'https://ben.balter.com/');
      expect(schema.itemListElement[1].item).toBeUndefined();
    }
  });

  it('should omit item URL when URL is empty string', () => {
    const items = [
      { name: 'Home', url: 'https://ben.balter.com/' },
      { name: 'Current Page', url: '' },
    ];
    
    const schema = generateBreadcrumbSchema(items);
    
    expect(schema).toHaveProperty('itemListElement');
    if (Array.isArray(schema.itemListElement)) {
      expect(schema.itemListElement[1].item).toBeUndefined();
    }
  });

  it('should include item names', () => {
    const items = [
      { name: 'Home', url: 'https://ben.balter.com/' },
      { name: 'Blog Posts', url: 'https://ben.balter.com/blog/' },
      { name: 'My Post' },
    ];
    
    const schema = generateBreadcrumbSchema(items);
    
    expect(schema).toHaveProperty('itemListElement');
    if (Array.isArray(schema.itemListElement)) {
      expect(schema.itemListElement[0]).toHaveProperty('name', 'Home');
      expect(schema.itemListElement[1]).toHaveProperty('name', 'Blog Posts');
      expect(schema.itemListElement[2]).toHaveProperty('name', 'My Post');
    }
  });

  it('should set correct ListItem type', () => {
    const items = [
      { name: 'Home', url: 'https://ben.balter.com/' },
    ];
    
    const schema = generateBreadcrumbSchema(items);
    
    expect(schema).toHaveProperty('itemListElement');
    if (Array.isArray(schema.itemListElement)) {
      expect(schema.itemListElement[0]).toHaveProperty('@type', 'ListItem');
    }
  });

  it('should handle empty breadcrumb list', () => {
    const items: Array<{ name: string; url?: string }> = [];
    
    const schema = generateBreadcrumbSchema(items);
    
    expect(schema).toHaveProperty('itemListElement');
    if (Array.isArray(schema.itemListElement)) {
      expect(schema.itemListElement).toHaveLength(0);
    }
  });

  it('should handle single breadcrumb item', () => {
    const items = [{ name: 'Home', url: 'https://ben.balter.com/' }];
    
    const schema = generateBreadcrumbSchema(items);
    
    expect(schema).toHaveProperty('itemListElement');
    if (Array.isArray(schema.itemListElement)) {
      expect(schema.itemListElement).toHaveLength(1);
      expect(schema.itemListElement[0]).toHaveProperty('position', 1);
    }
  });
});
