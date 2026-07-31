/**
 * Tests for structured-data (JSON-LD) generators.
 *
 * These drive the site's SEO/rich-result output, so the shape matters. Focuses
 * on the behaviors most likely to regress silently: the BlogPosting image
 * (ImageObject for generated OG cards vs. bare URL otherwise), author sameAs,
 * optional-property handling, and BreadcrumbList current-page handling.
 *
 * schema-dts types every property as a broad union, so we cast results to the
 * minimal shape each assertion needs rather than fighting the type surface.
 */

import { describe, it, expect } from 'vitest';
import {
  generatePersonSchema,
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
} from './structured-data';

const base = {
  title: 'A Post',
  url: 'https://ben.balter.com/2024/01/01/a-post/',
  publishedTime: new Date('2024-01-01T00:00:00Z'),
};

type PersonShape = { '@type': string; sameAs: string[] };
type ImageObjectShape = { '@type': string; url: string; width: number; height: number };
type PostShape = {
  image: unknown;
  author: { sameAs: string[] };
  description?: string;
  wordCount?: number;
};
type BreadcrumbItem = { position: number; item?: string };

describe('generatePersonSchema', () => {
  it('emits a Person with social sameAs profiles', () => {
    const schema = generatePersonSchema() as unknown as PersonShape;
    expect(schema['@type']).toBe('Person');
    expect(Array.isArray(schema.sameAs)).toBe(true);
    expect(schema.sameAs.length).toBeGreaterThan(0);
  });
});

describe('generateBlogPostingSchema', () => {
  it('exposes a generated OG card as a 1200x630 ImageObject', () => {
    const schema = generateBlogPostingSchema({ ...base, image: '/og/2024/01/01/a-post.png' });
    const image = schema.image as unknown as ImageObjectShape;
    expect(image['@type']).toBe('ImageObject');
    expect(image.width).toBe(1200);
    expect(image.height).toBe(630);
    expect(image.url).toBe('https://ben.balter.com/og/2024/01/01/a-post.png');
  });

  it('leaves a custom frontmatter image as a bare URL (unknown dimensions)', () => {
    const schema = generateBlogPostingSchema({ ...base, image: 'https://example.com/custom.jpg' });
    expect(schema.image).toBe('https://example.com/custom.jpg');
  });

  it('falls back to the headshot URL when no image is provided', () => {
    const schema = generateBlogPostingSchema({ ...base });
    expect(typeof schema.image).toBe('string');
    expect(schema.image as string).toMatch(/headshot\.jpg$/);
  });

  it('carries author sameAs matching the site-wide Person', () => {
    const post = generateBlogPostingSchema({ ...base }) as unknown as PostShape;
    const person = generatePersonSchema() as unknown as PersonShape;
    expect(post.author.sameAs).toEqual(person.sameAs);
  });

  it('omits description when undefined and wordCount when unset', () => {
    const schema = generateBlogPostingSchema({ ...base }) as unknown as PostShape;
    expect('description' in schema).toBe(false);
    expect('wordCount' in schema).toBe(false);

    const withExtras = generateBlogPostingSchema({
      ...base,
      description: 'Hi',
      wordCount: 500,
    }) as unknown as PostShape;
    expect(withExtras.description).toBe('Hi');
    expect(withExtras.wordCount).toBe(500);
  });
});

describe('generateBreadcrumbSchema', () => {
  it('links non-final items and treats the last as the current page', () => {
    const schema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://ben.balter.com' },
      { name: 'Posts', url: 'https://ben.balter.com/posts/' },
      { name: 'A Post' }, // current page — no url
    ]);
    const items = schema.itemListElement as unknown as BreadcrumbItem[];
    expect(items).toHaveLength(3);
    expect(items[0].position).toBe(1);
    expect(items[0].item).toBe('https://ben.balter.com');
    expect(items[2].position).toBe(3);
    expect('item' in items[2]).toBe(false); // last item has no link
  });
});
