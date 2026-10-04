/**
 * Popular posts from Cloudflare Web Analytics (RUM).
 *
 * `script/popular-posts.ts` calls {@link fetchRumPathCounts} and
 * {@link rankPopularPosts} in CI to write `src/data/popular-posts.json`, which
 * the build reads through {@link selectPopularPostIds}. Everything here is
 * pure (fetch is injected) so it can be unit tested without the network.
 *
 * Why RUM rather than the zone's edge request logs: RUM counts real browser
 * page loads, so bots, feed readers, and uptime checks mostly drop out, and on
 * this account it can look back further than the zone's HTTP dataset.
 */

import { getPostUrl } from './post-urls';

export const GRAPHQL_URL = 'https://api.cloudflare.com/client/v4/graphql';

/** Traffic sources that skew the counts (scrapers and headless clients). */
export const EXCLUDED_COUNTRIES = ['CN', 'SG'];
export const EXCLUDED_BROWSERS = ['Unknown'];

export interface RumQueryOptions {
  token: string;
  accountTag: string;
  host: string;
  start: Date;
  end: Date;
  /** Max rows to request; high so URL variants can be merged before ranking. */
  limit?: number;
  fetchImpl?: typeof fetch;
}

export interface PathCount {
  path: string;
  count: number;
}

export interface PopularPost {
  id: string;
  url: string;
  count: number;
}

export interface PopularPostsData {
  generatedAt: string;
  windowDays: number;
  source: string;
  posts: PopularPost[];
}

const iso = (d: Date) => d.toISOString().replace(/\.\d+Z$/, 'Z');

export const RUM_QUERY = `query PopularPosts($accountTag: String!, $start: Time!, $end: Time!, $host: String!, $limit: Int!, $countries: [String!], $browsers: [String!]) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      rumPageloadEventsAdaptiveGroups(
        limit: $limit
        orderBy: [count_DESC]
        filter: {
          datetime_geq: $start
          datetime_leq: $end
          requestHost: $host
          countryName_notin: $countries
          userAgentBrowser_notin: $browsers
        }
      ) {
        count
        dimensions { requestPath }
      }
    }
  }
}`;

/**
 * Query RUM page loads grouped by path. Throws on HTTP or GraphQL errors
 * (Cloudflare reports GraphQL errors with a 200 status).
 */
export async function fetchRumPathCounts(options: RumQueryOptions): Promise<PathCount[]> {
  const { token, accountTag, host, start, end, limit = 1000, fetchImpl = fetch } = options;
  const res = await fetchImpl(GRAPHQL_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: RUM_QUERY,
      variables: {
        accountTag,
        host,
        start: iso(start),
        end: iso(end),
        limit,
        countries: EXCLUDED_COUNTRIES,
        browsers: EXCLUDED_BROWSERS,
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Cloudflare GraphQL request failed: HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    data?: { viewer?: { accounts?: { rumPageloadEventsAdaptiveGroups?: unknown[] }[] } } | null;
    errors?: { message?: string }[] | null;
  };
  if (json.errors && json.errors.length > 0) {
    throw new Error(`Cloudflare GraphQL error: ${json.errors.map((e) => e.message).join('; ')}`);
  }
  const groups = json.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups;
  if (!Array.isArray(groups)) {
    throw new Error('Cloudflare GraphQL response had no rumPageloadEventsAdaptiveGroups');
  }
  return groups.flatMap((group) => {
    const g = group as { count?: unknown; dimensions?: { requestPath?: unknown } };
    const path = g.dimensions?.requestPath;
    return typeof path === 'string' && typeof g.count === 'number' ? [{ path, count: g.count }] : [];
  });
}

/** Decode a URL path, tolerating malformed escapes, without query or hash. */
function decodePath(raw: string): string {
  const path = raw.split(/[?#]/)[0] ?? '';
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/** `/a/b` → `/a/b/` so paths compare the same with or without a trailing slash. */
function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Lowercase ASCII letters and digits only. Mojibake (`â‰ ` for `≠`), stray
 * encoded characters, and punctuation all drop out, so variants of the same
 * post URL collapse to one key.
 */
export function pathSkeleton(path: string): string {
  return decodePath(path).toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Build a resolver from a raw request path to a post id, or null when the
 * path isn't a post. Tries, in order: an exact URL match, a redirect to a post
 * URL, then a unique skeleton match against `/YYYY/MM/DD/...` post URLs.
 *
 * @param postIds - Ids of the posts eligible to be listed
 * @param redirects - Source path → destination path (e.g. `redirect_from`)
 */
export function createPathResolver(
  postIds: string[],
  redirects: Map<string, string> = new Map(),
): (rawPath: string) => string | null {
  const byUrl = new Map<string, string>();
  const bySkeleton = new Map<string, string[]>();
  for (const id of postIds) {
    const url = getPostUrl(id);
    byUrl.set(url, id);
    const skeleton = pathSkeleton(url);
    bySkeleton.set(skeleton, [...(bySkeleton.get(skeleton) ?? []), id]);
  }

  const normalizedRedirects = new Map<string, string>();
  for (const [source, destination] of redirects) {
    normalizedRedirects.set(withTrailingSlash(decodePath(source)), withTrailingSlash(decodePath(destination)));
  }

  return (rawPath: string) => {
    const path = withTrailingSlash(decodePath(rawPath));
    const exact = byUrl.get(path);
    if (exact) return exact;

    const redirected = normalizedRedirects.get(path);
    if (redirected) {
      const target = byUrl.get(redirected);
      if (target) return target;
    }

    // Only date-prefixed paths can be posts; skip `/`, `/posts/`, etc.
    if (!/^\/\d{4}\/\d{2}\/\d{2}\/./.test(path)) return null;
    const matches = bySkeleton.get(pathSkeleton(path));
    return matches && matches.length === 1 ? matches[0]! : null;
  };
}

/**
 * Merge path counts into per-post totals and return the top `limit` posts.
 * Ties break by post id, newest first, so the order is stable across runs
 * (Cloudflare rounds counts, so ties are common).
 */
export function rankPopularPosts(
  rows: PathCount[],
  postIds: string[],
  options: { redirects?: Map<string, string>; limit?: number } = {},
): PopularPost[] {
  const { redirects, limit = 10 } = options;
  const resolve = createPathResolver(postIds, redirects);
  const totals = new Map<string, number>();
  for (const { path, count } of rows) {
    const id = resolve(path);
    if (id) totals.set(id, (totals.get(id) ?? 0) + count);
  }
  return [...totals]
    .sort(([aId, a], [bId, b]) => b - a || bId.localeCompare(aId))
    .slice(0, limit)
    .map(([id, count]) => ({ id, url: getPostUrl(id), count }));
}

/**
 * Parse `_redirects` file contents into a source → destination map. Skips
 * comments, splats/placeholders, and off-site destinations.
 */
export function parseRedirectsFile(contents: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of contents.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [source, destination] = trimmed.split(/\s+/);
    if (!source || !destination) continue;
    if (/[*:]/.test(source) || !destination.startsWith('/')) continue;
    map.set(source, destination);
  }
  return map;
}

/**
 * Post ids to show, in rank order, from the generated data file. Returns an
 * empty list when the data is missing or malformed, so the build never
 * depends on the analytics fetch having succeeded.
 *
 * @param data - Parsed `popular-posts.json`, or undefined if absent
 * @param listableIds - Ids that may be listed (drops drafts/archived/stale ids)
 * @param options.exclude - Ids to skip, e.g. ones already shown nearby
 * @param options.limit - Max ids to return
 */
export function selectPopularPostIds(
  data: unknown,
  listableIds: Iterable<string>,
  options: { exclude?: Iterable<string>; limit?: number } = {},
): string[] {
  const posts = (data as Partial<PopularPostsData> | undefined)?.posts;
  if (!Array.isArray(posts)) return [];
  const allowed = new Set(listableIds);
  const excluded = new Set(options.exclude ?? []);
  const ids: string[] = [];
  for (const post of posts) {
    const id = (post as Partial<PopularPost> | null)?.id;
    if (typeof id !== 'string' || !allowed.has(id) || excluded.has(id) || ids.includes(id)) continue;
    ids.push(id);
  }
  return ids.slice(0, options.limit ?? 5);
}
