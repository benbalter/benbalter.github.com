/**
 * Tests for post filtering utilities
 */

import { describe, it, expect } from 'vitest';
import { isPublished, isBuildablePost, isListablePost, pickPostsBySlug } from './post-filtering';

/** Helper to create a minimal post-like object for testing */
function makePost(data: { published?: boolean; archived?: boolean }) {
  return { data } as { data: { published?: boolean; archived?: boolean } };
}

describe('isPublished', () => {
  it('returns true for normal posts', () => {
    expect(isPublished(makePost({}) as any)).toBe(true);
  });

  it('returns true when published is explicitly true', () => {
    expect(isPublished(makePost({ published: true }) as any)).toBe(true);
  });

  it('returns false for drafts (published: false)', () => {
    expect(isPublished(makePost({ published: false }) as any)).toBe(false);
  });

  it('returns true for archived posts (they are still published)', () => {
    expect(isPublished(makePost({ archived: true }) as any)).toBe(true);
  });

  it('returns false for archived drafts', () => {
    expect(isPublished(makePost({ published: false, archived: true }) as any)).toBe(false);
  });
});

describe('isBuildablePost', () => {
  it('builds published posts in production', () => {
    expect(isBuildablePost(makePost({}) as any, false)).toBe(true);
  });

  it('skips drafts in production builds', () => {
    expect(isBuildablePost(makePost({ published: false }) as any, false)).toBe(false);
  });

  it('builds drafts when previewing in dev', () => {
    expect(isBuildablePost(makePost({ published: false }) as any, true)).toBe(true);
  });

  it('still builds archived posts in production', () => {
    expect(isBuildablePost(makePost({ archived: true }) as any, false)).toBe(true);
  });
});

describe('isListablePost', () => {
  it('returns true for normal posts', () => {
    expect(isListablePost(makePost({}) as any)).toBe(true);
  });

  it('returns false for drafts (published: false)', () => {
    expect(isListablePost(makePost({ published: false }) as any)).toBe(false);
  });

  it('returns false for archived posts (built, but kept out of listings)', () => {
    expect(isListablePost(makePost({ archived: true }) as any)).toBe(false);
  });

  it('returns false when both published is false and archived is true', () => {
    expect(isListablePost(makePost({ published: false, archived: true }) as any)).toBe(false);
  });

  it('returns true when archived is explicitly false', () => {
    expect(isListablePost(makePost({ archived: false }) as any)).toBe(true);
  });
});

describe('pickPostsBySlug', () => {
  const posts = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  it('returns posts in slug order, not collection order', () => {
    expect(pickPostsBySlug(posts, ['c', 'a']).map((p) => p.id)).toEqual(['c', 'a']);
  });

  it('skips slugs with no matching post', () => {
    expect(pickPostsBySlug(posts, ['b', 'gone']).map((p) => p.id)).toEqual(['b']);
  });
});
