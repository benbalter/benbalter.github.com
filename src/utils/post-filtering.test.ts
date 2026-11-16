/**
 * Tests for post filtering utilities
 */

import { describe, it, expect } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import { isPublished, isBuildablePost, isListablePost, isInternalPost, pickPostsBySlug } from './post-filtering';

/** Helper to create a minimal post-like object for testing */
function makePost(data: { published?: boolean; archived?: boolean; redirect_to?: string }): CollectionEntry<'posts'> {
  return { data } as unknown as CollectionEntry<'posts'>;
}

describe('isPublished', () => {
  it('returns true for normal posts', () => {
    expect(isPublished(makePost({}))).toBe(true);
  });

  it('returns true when published is explicitly true', () => {
    expect(isPublished(makePost({ published: true }))).toBe(true);
  });

  it('returns false for drafts (published: false)', () => {
    expect(isPublished(makePost({ published: false }))).toBe(false);
  });

  it('returns true for archived posts (they are still published)', () => {
    expect(isPublished(makePost({ archived: true }))).toBe(true);
  });

  it('returns false for archived drafts', () => {
    expect(isPublished(makePost({ published: false, archived: true }))).toBe(false);
  });
});

describe('isBuildablePost', () => {
  it('builds published posts in production', () => {
    expect(isBuildablePost(makePost({}), false)).toBe(true);
  });

  it('skips drafts in production builds', () => {
    expect(isBuildablePost(makePost({ published: false }), false)).toBe(false);
  });

  it('builds drafts when previewing in dev', () => {
    expect(isBuildablePost(makePost({ published: false }), true)).toBe(true);
  });

  it('still builds archived posts in production', () => {
    expect(isBuildablePost(makePost({ archived: true }), false)).toBe(true);
  });
});

describe('isListablePost', () => {
  it('returns true for normal posts', () => {
    expect(isListablePost(makePost({}))).toBe(true);
  });

  it('returns false for drafts (published: false)', () => {
    expect(isListablePost(makePost({ published: false }))).toBe(false);
  });

  it('returns false for archived posts (built, but kept out of listings)', () => {
    expect(isListablePost(makePost({ archived: true }))).toBe(false);
  });

  it('returns false when both published is false and archived is true', () => {
    expect(isListablePost(makePost({ published: false, archived: true }))).toBe(false);
  });

  it('returns true when archived is explicitly false', () => {
    expect(isListablePost(makePost({ archived: false }))).toBe(true);
  });
});

describe('isInternalPost', () => {
  const post = makePost;

  it('returns true for normal posts', () => {
    expect(isInternalPost(post({}))).toBe(true);
  });

  it('returns false for posts that redirect off-site', () => {
    expect(isInternalPost(post({ redirect_to: 'https://github.blog/example/' }))).toBe(false);
  });

  it('returns false for posts that are not listable', () => {
    expect(isInternalPost(post({ archived: true }))).toBe(false);
    expect(isInternalPost(post({ published: false }))).toBe(false);
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
