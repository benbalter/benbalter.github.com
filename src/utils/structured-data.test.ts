/**
 * Tests for structured data (JSON-LD) generation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  generatePersonSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  schemaToJsonLd,
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
    
    expect(schema).toHaveProperty('jobTitle', `${siteConfig.jobTitle} at ${siteConfig.employer}`);
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

describe('generateOrganizationSchema', () => {
  it('should generate valid Organization schema', () => {
    const schema = generateOrganizationSchema();
    
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema).toHaveProperty('@type', 'Organization');
  });

  it('should have GitHub as organization name', () => {
    const schema = generateOrganizationSchema();
    
    expect(schema).toHaveProperty('name', 'GitHub');
  });

  it('should have GitHub URL', () => {
    const schema = generateOrganizationSchema();
    
    expect(schema).toHaveProperty('url', 'https://github.com');
  });

  it('should have GitHub logo', () => {
    const schema = generateOrganizationSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('logo');
    if (typeof schemaAny.logo === 'string') {
      expect(schemaAny.logo).toContain('GitHub-Mark.png');
    }
  });

  it('should include social media links', () => {
    const schema = generateOrganizationSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('sameAs');
    expect(Array.isArray(schemaAny.sameAs)).toBe(true);
    if (Array.isArray(schemaAny.sameAs)) {
      expect(schemaAny.sameAs.length).toBeGreaterThan(0);
    }
  });

  it('should include GitHub social profiles', () => {
    const schema = generateOrganizationSchema();
    const schemaAny = schema as any;
    
    expect(schema).toHaveProperty('sameAs');
    if (Array.isArray(schemaAny.sameAs)) {
      expect(schemaAny.sameAs).toContain('https://twitter.com/github');
      expect(schemaAny.sameAs).toContain('https://www.linkedin.com/company/github');
      expect(schemaAny.sameAs).toContain('https://www.facebook.com/GitHub');
    }
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
    expect(schema.publisher).toHaveProperty('@type', 'Person');
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
