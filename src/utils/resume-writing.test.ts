/**
 * Tests for resolvePopularPosts — the resume's "Selected Writing" resolver.
 *
 * The config's popularPostSlugs list is mocked so we can exercise every branch
 * (curated ordering, unresolved slugs, non-dated ids) independently of the real
 * curated list. getPostUrlOrNull is exercised for real so path/year parsing is
 * covered end-to-end.
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('../config', () => ({
  popularPostSlugs: [
    '2022-03-17-why-async',
    '2015-11-12-why-urls',
    '2099-01-01-missing-from-collection',
    'not-a-dated-slug',
  ],
}));

import { resolvePopularPosts } from './resume-writing';

function makePost(id: string, title: string) {
  return {
    id,
    collection: 'posts' as const,
    data: { title, description: 'desc', published: true, archived: false },
    body: '',
  } as any;
}

describe('resolvePopularPosts', () => {
  it('preserves curated order regardless of input order', () => {
    const posts = [
      // Deliberately reversed relative to popularPostSlugs.
      makePost('2015-11-12-why-urls', 'Why URLs'),
      makePost('2022-03-17-why-async', 'Why Async'),
    ];

    const result = resolvePopularPosts(posts);

    expect(result.map((item) => item.title)).toEqual(['Why Async', 'Why URLs']);
  });

  it('maps title, root-relative path, and four-digit year', () => {
    const result = resolvePopularPosts([makePost('2022-03-17-why-async', 'Why Async')]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      title: 'Why Async',
      path: '/2022/03/17/why-async/',
      year: '2022',
    });
  });

  it('skips slugs with no matching post rather than rendering them broken', () => {
    // '2099-01-01-missing-from-collection' is in the curated list but absent here.
    const result = resolvePopularPosts([makePost('2022-03-17-why-async', 'Why Async')]);

    expect(result.map((item) => item.title)).toEqual(['Why Async']);
  });

  it('skips posts whose id is not a dated slug', () => {
    const posts = [
      makePost('2022-03-17-why-async', 'Why Async'),
      makePost('not-a-dated-slug', 'Undated'),
    ];

    const result = resolvePopularPosts(posts);

    expect(result.map((item) => item.title)).toEqual(['Why Async']);
  });

  it('returns an empty array when nothing resolves', () => {
    expect(resolvePopularPosts([])).toEqual([]);
  });
});
