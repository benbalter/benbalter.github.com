/**
 * Shared helpers for fetching blog posts.
 *
 * Centralizes the `getCollection('posts', isPublishedPost)` call that was
 * previously duplicated across pages, ensuring all callers share the same
 * filtering semantics (drafts/unpublished and archived posts excluded).
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublishedPost } from './post-filtering';

export interface GetPublishedPostsOptions {
  /**
   * If true, return posts sorted by id (descending). Post IDs follow the
   * Jekyll `YYYY-MM-DD-title` convention, so a lexicographic descending
   * sort yields newest-first ordering.
   */
  sorted?: boolean;
}

/**
 * Fetch all published, non-archived posts.
 *
 * @param options - Optional behavior flags.
 * @returns A promise resolving to the filtered collection of posts.
 */
export async function getPublishedPosts(
  options: GetPublishedPostsOptions = {},
): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', isPublishedPost);
  if (options.sorted) {
    return [...posts].sort(
      (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) =>
        b.id.localeCompare(a.id),
    );
  }
  return posts;
}
