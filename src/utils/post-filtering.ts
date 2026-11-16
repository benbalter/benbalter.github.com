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
 * Whether a post gets its own page (HTML, `.md`, and OG image).
 *
 * Same as {@link isPublished}, except drafts also render under `astro dev` so
 * they can be previewed at their real URL. Production builds still drop them,
 * and listings (via {@link isListablePost}) never include drafts.
 */
export function isBuildablePost(post: CollectionEntry<'posts'>, includeDrafts = import.meta.env.DEV): boolean {
  return includeDrafts || isPublished(post);
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

/**
 * Whether a listable post's content lives on this site.
 *
 * Posts with `redirect_to` are stubs for something published elsewhere (a
 * GitHub blog or TechCrunch piece): their URL 301s off-site and they have no
 * body. They stay on /posts/ (where PostCard marks them external) and in
 * /posts-meta.json (so in-body links to them still get a preview), but feeds,
 * Markdown indexes, and "keep reading" suggestions should skip them: a feed
 * item would arrive empty, and a related-post card would bounce the reader
 * off-site without warning.
 */
export function isInternalPost(post: CollectionEntry<'posts'>): boolean {
  return isListablePost(post) && post.data.redirect_to === undefined;
}

/**
 * The posts matching `slugs`, in `slugs` order, skipping any slug with no
 * matching post (e.g. a popular post that was since archived or unpublished).
 * Use for config-driven lists like `popularPostSlugs`.
 */
export function pickPostsBySlug<T extends { id: string }>(posts: T[], slugs: readonly string[]): T[] {
  const byId = new Map(posts.map((post) => [post.id, post]));
  return slugs.map((slug) => byId.get(slug)).filter((post): post is T => post !== undefined);
}
