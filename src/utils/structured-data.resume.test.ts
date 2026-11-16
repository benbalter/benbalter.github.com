/**
 * Tests for Resume and CollectionPage structured data schemas
 */

import { describe, it, expect } from 'vitest';
import {
  generateResumeSchema,
  generateCollectionPageSchema,
} from './structured-data';
import { siteConfig } from '../config';

/** A schema.org node as the tests read it */
interface NodeView {
  '@type': string;
  name: string;
  url?: string;
  description?: string;
  recognizedBy: NodeView;
}

/**
 * The résumé fields these tests read. schema-dts types every property as a
 * wide union (Text | URL | Role | …), so tests read through this narrower view
 */
interface ResumeView {
  jobTitle: string;
  worksFor: NodeView;
  hasOccupation: NodeView[];
  alumniOf: NodeView[];
  hasCredential: NodeView[];
}

/** The CollectionPage fields these tests read */
interface CollectionPageView {
  mainEntity: {
    '@type': string;
    itemListElement: { position: number; name: string }[];
  };
}

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

  it('should assert the current role (no end date) as jobTitle + worksFor', () => {
    // The current position — the one with no end date — drives jobTitle and
    // worksFor. (The sitewide Person stays employer-neutral; the résumé does not.)
    const schema = generateResumeSchema({ positions: samplePositions });
    const view = schema as unknown as ResumeView;

    expect(view.jobTitle).toBe('Director of Engineering');
    expect(view.worksFor['@type']).toBe('Organization');
    expect(view.worksFor.name).toBe('GitHub');
  });

  it('should not assert a current employer when every position has ended', () => {
    const ended = samplePositions.map(p => ({ ...p, endDate: p.endDate ?? '2024-01-01' }));
    const view = generateResumeSchema({ positions: ended }) as unknown as ResumeView;

    expect(view.jobTitle).toBeUndefined();
    expect(view.worksFor).toBeUndefined();
  });

  it('should include hasOccupation for all positions', () => {
    const schema = generateResumeSchema({ positions: samplePositions });
    const view = schema as unknown as ResumeView;

    expect(Array.isArray(view.hasOccupation)).toBe(true);
    expect(view.hasOccupation).toHaveLength(3);
    expect(view.hasOccupation[0]['@type']).toBe('Occupation');
    expect(view.hasOccupation[0].name).toBe('Director of Engineering');
  });

  it('should surface employer and year range in each occupation description', () => {
    const schema = generateResumeSchema({ positions: samplePositions });
    const view = schema as unknown as ResumeView;

    expect(view.hasOccupation[0].description).toBe('Director of Engineering at GitHub (2023–present)');
    expect(view.hasOccupation[2].description).toBe('Engineer at Acme Corp (2018–2020)');
  });

  it('should include alumniOf for degrees', () => {
    const schema = generateResumeSchema({ positions: samplePositions, degrees: sampleDegrees });
    const view = schema as unknown as ResumeView;

    expect(Array.isArray(view.alumniOf)).toBe(true);
    expect(view.alumniOf).toHaveLength(1);
    expect(view.alumniOf[0]['@type']).toBe('EducationalOrganization');
    expect(view.alumniOf[0].name).toBe('MIT');
  });

  it('should include hasCredential for certifications', () => {
    const schema = generateResumeSchema({ positions: samplePositions, certifications: sampleCertifications });
    const view = schema as unknown as ResumeView;

    expect(Array.isArray(view.hasCredential)).toBe(true);
    expect(view.hasCredential).toHaveLength(2);
    expect(view.hasCredential[0]['@type']).toBe('EducationalOccupationalCredential');
    expect(view.hasCredential[0].name).toBe('CISSP');
    expect(view.hasCredential[0].url).toBe('https://example.com/cissp');
    expect(view.hasCredential[1].url).toBeUndefined();
  });

  it('should include credential authority as recognizedBy', () => {
    const schema = generateResumeSchema({ positions: samplePositions, certifications: sampleCertifications });
    const view = schema as unknown as ResumeView;

    expect(view.hasCredential[0].recognizedBy['@type']).toBe('Organization');
    expect(view.hasCredential[0].recognizedBy.name).toBe('ISC2');
  });

  it('should handle missing degrees and certifications', () => {
    const schema = generateResumeSchema({ positions: samplePositions });
    const view = schema as unknown as ResumeView;

    expect(view.alumniOf).toBeUndefined();
    expect(view.hasCredential).toBeUndefined();
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
    const view = schema as unknown as CollectionPageView;

    expect(view.mainEntity).toBeDefined();
    expect(view.mainEntity['@type']).toBe('ItemList');
    expect(Array.isArray(view.mainEntity.itemListElement)).toBe(true);
    expect(view.mainEntity.itemListElement).toHaveLength(2);
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
    const view = schema as unknown as CollectionPageView;
    const items = view.mainEntity.itemListElement;

    expect(items[0]).toHaveProperty('position', 1);
    expect(items[0]).toHaveProperty('name', 'First Post');
    expect(items[1]).toHaveProperty('position', 2);
    expect(items[2]).toHaveProperty('position', 3);
  });
});
