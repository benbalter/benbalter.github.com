import { describe, it, expect } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import { groupPostsByYear } from './posts-by-year';

const post = (id: string) => ({ id }) as unknown as CollectionEntry<'posts'>;

describe('groupPostsByYear', () => {
  it('groups by slug year with years newest first', () => {
    const { years, postsByYear } = groupPostsByYear([
      post('2023-01-10-manage-like-an-engineer'),
      post('2026-03-04-thirteen-years-at-github'),
      post('2023-04-20-meetings-are-a-point-of-escalation'),
    ]);
    expect(years).toEqual([2026, 2023]);
    expect(postsByYear.get(2023)!.map((p) => p.id)).toEqual([
      '2023-01-10-manage-like-an-engineer',
      '2023-04-20-meetings-are-a-point-of-escalation',
    ]);
  });

  it('returns nothing for no posts', () => {
    const { years, postsByYear } = groupPostsByYear([]);
    expect(years).toEqual([]);
    expect(postsByYear.size).toBe(0);
  });
});
