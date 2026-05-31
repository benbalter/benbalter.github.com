/**
 * Tests for post filtering utilities
 */

import { describe, it, expect } from 'vitest';
import { isPublishedPost } from './post-filtering';

/** Helper to create a minimal post-like object for testing */
function makePost(data: { published?: boolean; archived?: boolean }) {
  return { data } as { data: { published?: boolean; archived?: boolean } };
}

describe('isPublishedPost', () => {
  it('should return true for normal posts', () => {
    expect(isPublishedPost(makePost({}) as any)).toBe(true);
  });

  it('should return true when published is explicitly true', () => {
    expect(isPublishedPost(makePost({ published: true }) as any)).toBe(true);
  });

  it('should return false when published is false', () => {
    expect(isPublishedPost(makePost({ published: false }) as any)).toBe(false);
  });

  it('should return false when archived is true', () => {
    expect(isPublishedPost(makePost({ archived: true }) as any)).toBe(false);
  });

  it('should return false when both published is false and archived is true', () => {
    expect(isPublishedPost(makePost({ published: false, archived: true }) as any)).toBe(false);
  });

  it('should return true when archived is explicitly false', () => {
    expect(isPublishedPost(makePost({ archived: false }) as any)).toBe(true);
  });
});
