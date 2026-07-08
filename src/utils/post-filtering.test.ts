/**
 * Tests for post filtering utilities
 */

import { describe, it, expect } from 'vitest';
import { isPublished, isListablePost } from './post-filtering';

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
