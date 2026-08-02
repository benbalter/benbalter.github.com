/**
 * Maps a post id (Jekyll-style `YYYY-MM-DD-slug`) to its generated Open Graph
 * image path. Shared by the OG generation route (src/pages/og/[...route].ts)
 * and PostLayout so the advertised `og:image` always matches the file that's
 * actually built. Returns null when the id isn't date-prefixed (no OG image).
 */

const POST_ID_DATE = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

/** Route-param form: `YYYY/MM/DD/slug.png` (no leading slash). */
export function ogImageRoute(postId: string): string | null {
  const match = postId.match(POST_ID_DATE);
  if (!match) return null;
  const [, year, month, day, slug] = match;
  return `${year}/${month}/${day}/${slug}.png`;
}

/** Absolute site path: `/og/YYYY/MM/DD/slug.png`. */
export function ogImagePath(postId: string): string | null {
  const route = ogImageRoute(postId);
  return route ? `/og/${route}` : null;
}
