import type { CollectionEntry } from 'astro:content';

/** Filter predicate for published, non-archived posts */
export function isPublishedPost({ data }: CollectionEntry<'posts'>): boolean {
  return data.published !== false && data.archived !== true;
}
