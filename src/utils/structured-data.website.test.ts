/**
 * Tests for WebSite structured data schema
 */

import { describe, it, expect } from 'vitest';
import { generateWebSiteSchema } from './structured-data';
import { siteConfig } from '../config';

describe('generateWebSiteSchema', () => {
  it('should generate valid WebSite schema', () => {
    const schema = generateWebSiteSchema();
    
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
  });

  it('should have site name and URL', () => {
    const schema = generateWebSiteSchema();
    
    expect(schema).toHaveProperty('name', siteConfig.name);
    expect(schema).toHaveProperty('url', siteConfig.url);
  });

  it('should have site description', () => {
    const schema = generateWebSiteSchema();
    
    expect(schema).toHaveProperty('description', siteConfig.description);
  });

  it('should include @id', () => {
    const schema = generateWebSiteSchema();
    
    expect(schema).toHaveProperty('@id', `${siteConfig.url}/#website`);
  });

  it('should include author information', () => {
    const schema = generateWebSiteSchema();
    
    expect(schema.author).toBeDefined();
    expect(schema.author).toHaveProperty('@type', 'Person');
    expect(schema.author).toHaveProperty('name', siteConfig.author);
    expect(schema.author).toHaveProperty('url', siteConfig.url);
  });
});
