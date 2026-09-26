/**
 * Maps a post id (Jekyll-style `YYYY-MM-DD-slug`) to its generated Open Graph
 * image path. Shared by the OG generation route (src/pages/og/[...route].ts)
 * and PostLayout so the advertised `og:image` always matches the file that's
 * actually built. Returns null when the id isn't date-prefixed (no OG image).
 */

import { parsePostId } from './post-urls';

/** Route-param form: `YYYY/MM/DD/slug.png` (no leading slash). */
export function ogImageRoute(postId: string): string | null {
  const parts = parsePostId(postId);
  if (!parts) return null;
  const { year, month, day, slug } = parts;
  return `${year}/${month}/${day}/${slug}.png`;
}

/** Absolute site path: `/og/YYYY/MM/DD/slug.png`. */
export function ogImagePath(postId: string): string | null {
  const route = ogImageRoute(postId);
  return route ? `/og/${route}` : null;
}
