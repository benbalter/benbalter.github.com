/**
 * Tests for Quotation structured data schemas
 */

import { describe, it, expect } from 'vitest';
import { generateQuotesCollectionSchema } from './structured-data';
import { quoteAnchorId } from '../lib/remark-quote-directive';
import { siteConfig } from '../config';

const sample = {
  id: 'why-async',
  text: 'You can be professional without being formal.',
  postUrl: '/2022/03/17/why-async/',
  postTitle: 'Why async',
};

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

  it('points each quote url and @id at its in-post deep link (no /q/ page)', () => {
    const schema = generateQuotesCollectionSchema(props);
    const list = schema.mainEntity as unknown as { itemListElement: Array<{ item: { url: string; '@id': string } }> };
    const deepLink = `${siteConfig.url}${sample.postUrl}#${quoteAnchorId(sample.id)}`;
    expect(list.itemListElement[0].item.url).toBe(deepLink);
    expect(list.itemListElement[0].item['@id']).toBe(deepLink);
  });

  it('attributes each quote to the canonical Person and links back to its post', () => {
    const schema = generateQuotesCollectionSchema(props);
    const item = (schema.mainEntity as unknown as { itemListElement: Array<{ item: { creator: { '@id': string }; isPartOf: { url: string; headline: string } } }> }).itemListElement[0].item;
    expect(item.creator['@id']).toBe(`${siteConfig.url}/#person`);
    expect(item.isPartOf.url).toBe(`${siteConfig.url}${sample.postUrl}`);
    expect(item.isPartOf.headline).toBe(sample.postTitle);
  });

  it('handles an empty wall', () => {
    const schema = generateQuotesCollectionSchema({ ...props, quotes: [] });
    const list = schema.mainEntity as unknown as { numberOfItems: number; itemListElement: unknown[] };
    expect(list.numberOfItems).toBe(0);
    expect(list.itemListElement).toHaveLength(0);
  });
});
