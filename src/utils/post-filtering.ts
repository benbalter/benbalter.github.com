import type { CollectionEntry } from 'astro:content';

/**
 * Whether a page should be generated for a post.
 *
 * Archived posts ARE published: they remain reachable (with a warning banner)
 * for historical purposes, so they pass this predicate and get built. Only
 * explicit drafts (`published: false`) are excluded. Use this for route
 * generation (`getStaticPaths`).
 */
export function isPublished({ data }: CollectionEntry<'posts'>): boolean {
  return data.published !== false;
}

/**
 * Whether a post should appear in listings, feeds, and indexes.
 *
 * Stricter than {@link isPublished}: archived posts are reachable directly but
 * intentionally kept out of the post index, RSS feed, and "keep reading"
 * suggestions so they don't compete with current content. Use this for any
 * list of posts surfaced to readers.
 */
export function isListablePost(post: CollectionEntry<'posts'>): boolean {
  return isPublished(post) && post.data.archived !== true;
}
