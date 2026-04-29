/**
 * Tests for Person and ProfilePage structured data schemas
 */

import { describe, it, expect } from 'vitest';
import {
  generatePersonSchema,
  generateProfilePageSchema,
} from './structured-data';
import { siteConfig } from '../config';

describe('generatePersonSchema', () => {
  it('should generate valid Person schema', () => {
    const schema = generatePersonSchema();
    
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema).toHaveProperty('@type', 'Person');
    expect(schema).toHaveProperty('name', siteConfig.author);
    expect(schema).toHaveProperty('url', siteConfig.url);
    expect(schema).toHaveProperty('email', siteConfig.email);
  });

  it('should include job title', () => {
    const schema = generatePersonSchema();
    
    expect(schema).toHaveProperty('jobTitle', siteConfig.jobTitle);
  });

  it('should include worksFor Organization', () => {
    const schema = generatePersonSchema();
    const schemaAny = schema as any;
    
    expect(schemaAny.worksFor).toBeDefined();
    expect(schemaAny.worksFor['@type']).toBe('Organization');
    expect(schemaAny.worksFor.name).toBe(siteConfig.employer);
    expect(schemaAny.worksFor.url).toBe(siteConfig.employerUrl);
  });

  it('should include @id', () => {
    const schema = generatePersonSchema();
    
    expect(schema).toHaveProperty('@id', `${siteConfig.url}/#person`);
  });

  it('should include social media links', () => {
    const schema = generatePersonSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('sameAs');
    expect(Array.isArray(schemaAny.sameAs)).toBe(true);
    if (Array.isArray(schemaAny.sameAs)) {
      expect(schemaAny.sameAs.length).toBeGreaterThan(0);
    }
  });

  it('should include GitHub profile in sameAs', () => {
    const schema = generatePersonSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('sameAs');
    if (Array.isArray(schemaAny.sameAs)) {
      expect(schemaAny.sameAs).toContain(`https://github.com/${siteConfig.githubUsername}`);
    }
  });

  it('should include Twitter profile in sameAs', () => {
    const schema = generatePersonSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('sameAs');
    if (Array.isArray(schemaAny.sameAs)) {
      expect(schemaAny.sameAs).toContain(`https://twitter.com/${siteConfig.socialUsername}`);
    }
  });

  it('should include LinkedIn profile in sameAs', () => {
    const schema = generatePersonSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('sameAs');
    if (Array.isArray(schemaAny.sameAs)) {
      expect(schemaAny.sameAs).toContain(siteConfig.linkedinUrl);
    }
  });

  it('should include Mastodon profile in sameAs', () => {
    const schema = generatePersonSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('sameAs');
    if (Array.isArray(schemaAny.sameAs)) {
      expect(schemaAny.sameAs).toContain(siteConfig.mastodonUrl);
    }
  });

  it('should include Bluesky profile in sameAs', () => {
    const schema = generatePersonSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('sameAs');
    if (Array.isArray(schemaAny.sameAs)) {
      expect(schemaAny.sameAs).toContain(siteConfig.blueskyUrl);
    }
  });

  it('should include profile image', () => {
    const schema = generatePersonSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('image', `${siteConfig.url}/assets/img/headshot.jpg`);
    if (typeof schemaAny.image === 'string') {
      expect(schemaAny.image).toMatch(/^https:\/\//);
    }
  });

  it('should accept overrides', () => {
    const schema = generatePersonSchema({ jobTitle: 'Custom Job Title' });
    
    expect(schema).toHaveProperty('jobTitle', 'Custom Job Title');
    // Other fields should remain
    expect(schema).toHaveProperty('name', siteConfig.author);
  });

  it('should have all required Person properties', () => {
    const schema = generatePersonSchema();
    
    expect(schema).toHaveProperty('@context');
    expect(schema).toHaveProperty('@type');
    expect(schema).toHaveProperty('name');
    expect(schema).toHaveProperty('url');
  });
});

describe('generateProfilePageSchema', () => {
  it('should generate valid ProfilePage schema', () => {
    const schema = generateProfilePageSchema();

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema).toHaveProperty('@type', 'ProfilePage');
  });

  it('should include mainEntity as Person', () => {
    const schema = generateProfilePageSchema();

    expect(schema).toHaveProperty('mainEntity');
    expect(schema.mainEntity).toHaveProperty('@type', 'Person');
  });

  it('should include Person details in mainEntity', () => {
    const schema = generateProfilePageSchema();
    const person = schema.mainEntity as Record<string, unknown>;

    expect(person).toHaveProperty('name', siteConfig.author);
    expect(person).toHaveProperty('url', siteConfig.url);
    expect(person).toHaveProperty('email', siteConfig.email);
  });

  it('should include social links in mainEntity', () => {
    const schema = generateProfilePageSchema();
    const person = schema.mainEntity as Record<string, unknown>;

    expect(person).toHaveProperty('sameAs');
    expect(Array.isArray(person.sameAs)).toBe(true);
  });
});
