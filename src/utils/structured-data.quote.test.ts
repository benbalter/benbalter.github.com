/**
 * Tests for Quotation structured data schemas
 */

import { describe, it, expect } from 'vitest';
import { generateQuotationSchema, generateQuotesCollectionSchema } from './structured-data';
import { siteConfig } from '../config';

const sample = {
  id: 'why-async',
  text: 'You can be professional without being formal.',
  postUrl: '/2022/03/17/why-async/',
  postTitle: 'Why async',
};

describe('generateQuotationSchema', () => {
  it('generates a Quotation with @context and the quote text', () => {
    const schema = generateQuotationSchema(sample);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Quotation');
    expect(schema.text).toBe(sample.text);
  });

  it('points url and @id at the canonical /q/<id>/ page', () => {
    const schema = generateQuotationSchema(sample);
    expect(schema.url).toBe(`${siteConfig.url}/q/${sample.id}/`);
    expect((schema as { '@id'?: string })['@id']).toBe(`${siteConfig.url}/q/${sample.id}/#quotation`);
  });

  it('attributes the quote to the canonical Person entity by @id', () => {
    const schema = generateQuotationSchema(sample);
    const creator = schema.creator as { '@type': string; '@id': string };
    expect(creator['@type']).toBe('Person');
    expect(creator['@id']).toBe(`${siteConfig.url}/#person`);
  });

  it('links back to the source post with an absolute URL', () => {
    const schema = generateQuotationSchema(sample);
    const isPartOf = schema.isPartOf as { '@type': string; url: string; headline: string };
    expect(isPartOf.url).toBe(`${siteConfig.url}${sample.postUrl}`);
    expect(isPartOf.headline).toBe(sample.postTitle);
  });

  it('does not double-prefix an already-absolute post URL', () => {
    const schema = generateQuotationSchema({ ...sample, postUrl: 'https://example.com/post/' });
    const isPartOf = schema.isPartOf as { url: string };
    expect(isPartOf.url).toBe('https://example.com/post/');
  });
});

describe('generateQuotesCollectionSchema', () => {
  const props = {
    name: 'Quotable',
    description: 'A wall of shareable lines.',
    url: `${siteConfig.url}/quotes/`,
    quotes: [sample, { ...sample, id: 'why-urls', text: 'Cool URIs don’t change.', postTitle: 'Why URLs' }],
  };

  it('generates a CollectionPage with an ItemList mainEntity', () => {
    const schema = generateQuotesCollectionSchema(props);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('CollectionPage');
    const list = schema.mainEntity as unknown as { '@type': string; numberOfItems: number; itemListElement: unknown[] };
    expect(list['@type']).toBe('ItemList');
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement).toHaveLength(2);
  });

  it('wraps each quote as a positioned ListItem holding a Quotation', () => {
    const schema = generateQuotesCollectionSchema(props);
    const list = schema.mainEntity as unknown as { itemListElement: Array<{ '@type': string; position: number; item: { '@type': string; text: string } }> };
    expect(list.itemListElement[0]['@type']).toBe('ListItem');
    expect(list.itemListElement[0].position).toBe(1);
    expect(list.itemListElement[0].item['@type']).toBe('Quotation');
    expect(list.itemListElement[0].item.text).toBe(sample.text);
    expect(list.itemListElement[1].position).toBe(2);
  });

  it('handles an empty wall', () => {
    const schema = generateQuotesCollectionSchema({ ...props, quotes: [] });
    const list = schema.mainEntity as unknown as { numberOfItems: number; itemListElement: unknown[] };
    expect(list.numberOfItems).toBe(0);
    expect(list.itemListElement).toHaveLength(0);
  });
});
