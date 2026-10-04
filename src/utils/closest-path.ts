import { distance } from 'fastest-levenshtein';

/** The last non-empty path segment: `/2014/11/06/rules/` -> `rules`. */
function slugOf(path: string): string {
  return path.split('/').filter(Boolean).pop() ?? '';
}

/**
 * The known path most likely meant by a mistyped one, for the 404 page's
 * "Perhaps you're looking for…" suggestion.
 *
 * Matches on the slug (the last path segment) rather than the whole URL, so a
 * wrong date prefix or a different host can't outweigh the part a reader
 * actually typed. A slug that starts with the requested one wins outright,
 * since truncated links ("…/how-to-communicate-lik") are the most common
 * miss. Ties fall back to the distance between full paths.
 *
 * @param requested - The pathname that 404ed.
 * @param candidates - Known pathnames (e.g. from the sitemap).
 * @returns The best match, or null if there are no candidates.
 */
export function closestPath(requested: string, candidates: string[]): string | null {
  const want = slugOf(requested).toLowerCase();
  let best: string | null = null;
  let bestScore = Infinity;
  let bestTie = Infinity;
  for (const candidate of candidates) {
    const slug = slugOf(candidate).toLowerCase();
    const score = want && slug.startsWith(want) ? -1 : distance(want, slug);
    const tie = distance(requested, candidate);
    if (score < bestScore || (score === bestScore && tie < bestTie)) {
      best = candidate;
      bestScore = score;
      bestTie = tie;
    }
  }
  return best;
}
