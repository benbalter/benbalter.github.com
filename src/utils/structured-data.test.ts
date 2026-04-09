/**
 * Tests for structured data (JSON-LD) generation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  generatePersonSchema,
  generateProfilePageSchema,
  generateWebSiteSchema,
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  generateResumeSchema,
  generateCollectionPageSchema,
  schemaToJsonLd,
  schemaToGraphJsonLd,
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

describe('generateBlogPostingSchema', () => {
  it('should generate valid BlogPosting schema', () => {
    const props = {
      title: 'Test Blog Post',
      description: 'This is a test post',
      url: 'https://ben.balter.com/2024/01/01/test-post/',
      publishedTime: new Date('2024-01-01'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BlogPosting');
  });

  it('should include post title and description', () => {
    const props = {
      title: 'Test Blog Post',
      description: 'This is a test post',
      url: 'https://ben.balter.com/2024/01/01/test-post/',
      publishedTime: new Date('2024-01-01'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('headline', 'Test Blog Post');
    expect(schema).toHaveProperty('description', 'This is a test post');
  });

  it('should include post URL', () => {
    const props = {
      title: 'Test Blog Post',
      url: 'https://ben.balter.com/2024/01/01/test-post/',
      publishedTime: new Date('2024-01-01'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('url', 'https://ben.balter.com/2024/01/01/test-post/');
  });

  it('should include published date in ISO format', () => {
    const publishDate = new Date('2024-01-15T12:00:00Z');
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: publishDate,
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('datePublished', publishDate.toISOString());
  });

  it('should use published date as modified date when no modified date provided', () => {
    const publishDate = new Date('2024-01-15T12:00:00Z');
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: publishDate,
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('dateModified', publishDate.toISOString());
  });

  it('should use custom modified date when provided', () => {
    const publishDate = new Date('2024-01-15T12:00:00Z');
    const modifiedDate = new Date('2024-02-01T12:00:00Z');
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: publishDate,
      modifiedTime: modifiedDate,
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('dateModified', modifiedDate.toISOString());
  });

  it('should include custom image when provided', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
      image: 'https://ben.balter.com/assets/img/custom-image.jpg',
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('image', 'https://ben.balter.com/assets/img/custom-image.jpg');
  });

  it('should use default headshot when no image provided', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('image', `${siteConfig.url}/assets/img/headshot.jpg`);
  });

  it('should include author information', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('author');
    expect(schema.author).toHaveProperty('@type', 'Person');
    expect(schema.author).toHaveProperty('name', siteConfig.author);
  });

  it('should accept custom author name', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
      author: 'Custom Author',
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('author');
    expect(schema.author).toHaveProperty('name', 'Custom Author');
  });

  it('should include publisher information', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('publisher');
    expect(schema.publisher).toHaveProperty('@type', 'Organization');
  });

  it('should include mainEntityOfPage', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('mainEntityOfPage');
    expect(schema.mainEntityOfPage).toHaveProperty('@type', 'WebPage');
    expect(schema.mainEntityOfPage).toHaveProperty('@id', props.url);
  });

  it('should include wordCount when provided', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
      wordCount: 1500,
    });
    
    expect(schema).toHaveProperty('wordCount', 1500);
  });

  it('should omit wordCount when not provided', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    });
    
    expect(schema).not.toHaveProperty('wordCount');
  });

  it('should include inLanguage', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    });
    
    expect(schema).toHaveProperty('inLanguage', 'en');
  });

  it('should include keywords when provided', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
      keywords: ['open-source', 'government'],
    });
    
    expect(schema).toHaveProperty('keywords', 'open-source, government');
  });

  it('should omit keywords when empty', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
      keywords: [],
    });
    
    expect(schema).not.toHaveProperty('keywords');
  });

  it('should include @id reference in author', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    });
    
    expect(schema.author).toHaveProperty('@id', `${siteConfig.url}/#person`);
  });
});

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

describe('generateResumeSchema', () => {
  const samplePositions = [
    { employer: 'GitHub', title: 'Director of Engineering', startDate: '2023-01-01' },
    { employer: 'GitHub', title: 'Senior Engineer', startDate: '2020-01-01', endDate: '2023-01-01' },
    { employer: 'Acme Corp', title: 'Engineer', startDate: '2018-01-01', endDate: '2020-01-01' },
  ];

  const sampleDegrees = [
    { school: 'MIT', degree: 'Bachelor of Science', date: '2018-05-01' },
  ];

  const sampleCertifications = [
    { authority: 'ISC2', name: 'CISSP', url: 'https://example.com/cissp' },
    { authority: 'PMI', name: 'PMP' },
  ];

  it('should generate valid Person schema', () => {
    const schema = generateResumeSchema({ positions: samplePositions });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema).toHaveProperty('@type', 'Person');
    expect(schema).toHaveProperty('name', siteConfig.author);
  });

  it('should include worksFor for current position', () => {
    const schema = generateResumeSchema({ positions: samplePositions });
    const schemaAny = schema as any;

    expect(schemaAny.worksFor).toBeDefined();
    expect(schemaAny.worksFor['@type']).toBe('Organization');
    expect(schemaAny.worksFor.name).toBe('GitHub');
  });

  it('should not include worksFor when all positions have end dates', () => {
    const pastPositions = samplePositions.filter(p => p.endDate);
    const schema = generateResumeSchema({ positions: pastPositions });
    const schemaAny = schema as any;

    expect(schemaAny.worksFor).toBeUndefined();
  });

  it('should include hasOccupation for all positions', () => {
    const schema = generateResumeSchema({ positions: samplePositions });
    const schemaAny = schema as any;

    expect(Array.isArray(schemaAny.hasOccupation)).toBe(true);
    expect(schemaAny.hasOccupation).toHaveLength(3);
    expect(schemaAny.hasOccupation[0]['@type']).toBe('Occupation');
    expect(schemaAny.hasOccupation[0].name).toBe('Director of Engineering');
  });

  it('should include alumniOf for degrees', () => {
    const schema = generateResumeSchema({ positions: samplePositions, degrees: sampleDegrees });
    const schemaAny = schema as any;

    expect(Array.isArray(schemaAny.alumniOf)).toBe(true);
    expect(schemaAny.alumniOf).toHaveLength(1);
    expect(schemaAny.alumniOf[0]['@type']).toBe('EducationalOrganization');
    expect(schemaAny.alumniOf[0].name).toBe('MIT');
  });

  it('should include hasCredential for certifications', () => {
    const schema = generateResumeSchema({ positions: samplePositions, certifications: sampleCertifications });
    const schemaAny = schema as any;

    expect(Array.isArray(schemaAny.hasCredential)).toBe(true);
    expect(schemaAny.hasCredential).toHaveLength(2);
    expect(schemaAny.hasCredential[0]['@type']).toBe('EducationalOccupationalCredential');
    expect(schemaAny.hasCredential[0].name).toBe('CISSP');
    expect(schemaAny.hasCredential[0].url).toBe('https://example.com/cissp');
    expect(schemaAny.hasCredential[1].url).toBeUndefined();
  });

  it('should include credential authority as recognizedBy', () => {
    const schema = generateResumeSchema({ positions: samplePositions, certifications: sampleCertifications });
    const schemaAny = schema as any;

    expect(schemaAny.hasCredential[0].recognizedBy['@type']).toBe('Organization');
    expect(schemaAny.hasCredential[0].recognizedBy.name).toBe('ISC2');
  });

  it('should handle missing degrees and certifications', () => {
    const schema = generateResumeSchema({ positions: samplePositions });
    const schemaAny = schema as any;

    expect(schemaAny.alumniOf).toBeUndefined();
    expect(schemaAny.hasCredential).toBeUndefined();
  });
});

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

describe('generateCollectionPageSchema', () => {
  it('should generate valid CollectionPage schema', () => {
    const schema = generateCollectionPageSchema({
      name: 'All Posts',
      description: 'Archive of all blog posts.',
      url: 'https://ben.balter.com/posts/',
      posts: [
        { url: 'https://ben.balter.com/2024/01/01/test/', title: 'Test Post' },
      ],
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema).toHaveProperty('@type', 'CollectionPage');
    expect(schema).toHaveProperty('name', 'All Posts');
    expect(schema).toHaveProperty('description', 'Archive of all blog posts.');
    expect(schema).toHaveProperty('url', 'https://ben.balter.com/posts/');
  });

  it('should include ItemList with posts', () => {
    const schema = generateCollectionPageSchema({
      name: 'All Posts',
      description: 'Archive',
      url: 'https://ben.balter.com/posts/',
      posts: [
        { url: 'https://ben.balter.com/2024/01/01/first/', title: 'First Post' },
        { url: 'https://ben.balter.com/2024/01/02/second/', title: 'Second Post' },
      ],
    });
    const schemaAny = schema as any;

    expect(schemaAny.mainEntity).toBeDefined();
    expect(schemaAny.mainEntity['@type']).toBe('ItemList');
    expect(Array.isArray(schemaAny.mainEntity.itemListElement)).toBe(true);
    expect(schemaAny.mainEntity.itemListElement).toHaveLength(2);
  });

  it('should number items correctly', () => {
    const schema = generateCollectionPageSchema({
      name: 'All Posts',
      description: 'Archive',
      url: 'https://ben.balter.com/posts/',
      posts: [
        { url: 'https://ben.balter.com/2024/01/01/first/', title: 'First Post' },
        { url: 'https://ben.balter.com/2024/01/02/second/', title: 'Second Post' },
        { url: 'https://ben.balter.com/2024/01/03/third/', title: 'Third Post' },
      ],
    });
    const schemaAny = schema as any;
    const items = schemaAny.mainEntity.itemListElement;

    expect(items[0]).toHaveProperty('position', 1);
    expect(items[0]).toHaveProperty('name', 'First Post');
    expect(items[1]).toHaveProperty('position', 2);
    expect(items[2]).toHaveProperty('position', 3);
  });
});
