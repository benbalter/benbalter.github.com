/**
 * Tests for Resume and CollectionPage structured data schemas
 */

import { describe, it, expect } from 'vitest';
import {
  generateResumeSchema,
  generateCollectionPageSchema,
} from './structured-data';
import { siteConfig } from '../config';

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
