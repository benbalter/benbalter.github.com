/**
 * Tests for getPublishedPosts helper.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

import { getCollection, type CollectionEntry } from 'astro:content';
import { getPublishedPosts } from './posts';

const mockGetCollection = vi.mocked(getCollection);

interface MockData {
  title: string;
  published?: boolean;
  archived?: boolean;
}

type PostFilter = (entry: CollectionEntry<'posts'>) => unknown;

function makePost(id: string, data: MockData): CollectionEntry<'posts'> {
  return {
    id,
    collection: 'posts' as const,
    data: {
      title: data.title,
      description: 'desc',
      published: data.published ?? true,
      archived: data.archived ?? false,
    },
    body: '',
  } as unknown as CollectionEntry<'posts'>;
}

/**
 * Stand-in for Astro's getCollection that applies the filter it's given,
 * typed loosely because getCollection's overloads are generic over every
 * collection
 */
function mockCollection(all: CollectionEntry<'posts'>[]) {
  mockGetCollection.mockImplementation((async (_collection: string, filter?: PostFilter) =>
    filter ? all.filter(filter) : all) as unknown as typeof getCollection);
}

describe('getPublishedPosts', () => {
  beforeEach(() => {
    mockGetCollection.mockReset();
  });

  it('forwards the isListablePost filter to getCollection', async () => {
    // Simulate Astro's getCollection applying the filter we pass in.
    mockCollection([
      makePost('2024-01-01-published', { title: 'Published' }),
      makePost('2024-02-01-draft', { title: 'Draft', published: false }),
      makePost('2024-03-01-archived', { title: 'Archived', archived: true }),
      makePost('2024-04-01-also-published', { title: 'Also Published' }),
    ]);

    const posts = await getPublishedPosts();

    expect(posts).toHaveLength(2);
    const ids = posts.map((p) => p.id);
    expect(ids).toContain('2024-01-01-published');
    expect(ids).toContain('2024-04-01-also-published');
    expect(ids).not.toContain('2024-02-01-draft');
    expect(ids).not.toContain('2024-03-01-archived');
  });

  it('excludes posts where published is false (drafts)', async () => {
    mockCollection([
      makePost('2024-01-01-a', { title: 'A' }),
      makePost('2024-02-01-b', { title: 'B', published: false }),
    ]);

    const posts = await getPublishedPosts();
    expect(posts.map((p) => p.id)).toEqual(['2024-01-01-a']);
  });

  it('excludes archived posts', async () => {
    mockCollection([
      makePost('2024-01-01-a', { title: 'A' }),
      makePost('2024-02-01-b', { title: 'B', archived: true }),
    ]);

    const posts = await getPublishedPosts();
    expect(posts.map((p) => p.id)).toEqual(['2024-01-01-a']);
  });

  it('returns posts unsorted by default (preserving collection order)', async () => {
    mockCollection([
      makePost('2024-01-01-old', { title: 'Old' }),
      makePost('2024-12-01-new', { title: 'New' }),
      makePost('2024-06-01-mid', { title: 'Mid' }),
    ]);

    const posts = await getPublishedPosts();
    expect(posts.map((p) => p.id)).toEqual([
      '2024-01-01-old',
      '2024-12-01-new',
      '2024-06-01-mid',
    ]);
  });

  it('returns posts sorted by id descending when sorted: true', async () => {
    mockCollection([
      makePost('2024-01-01-old', { title: 'Old' }),
      makePost('2024-12-01-new', { title: 'New' }),
      makePost('2024-06-01-mid', { title: 'Mid' }),
    ]);

    const posts = await getPublishedPosts({ sorted: true });
    expect(posts.map((p) => p.id)).toEqual([
      '2024-12-01-new',
      '2024-06-01-mid',
      '2024-01-01-old',
    ]);
  });
});
