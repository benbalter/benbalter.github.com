/**
 * URL → lookup keys for external link preview cards.
 *
 * Shared by the build-time cache script (script/build-link-previews.ts), which
 * fetches metadata for every key it finds in posts, and the client
 * (src/scripts/link-previews.ts), which computes the same key on hover to find
 * that metadata. Keeping one implementation means a link can't be cached under
 * one spelling and looked up under another.
 */

/** Cached metadata for a GitHub repo, as stored in src/data/link-previews.json */
interface GitHubPreview {
  kind: 'github';
  /** owner/repo, in GitHub's casing */
  title: string;
  description?: string;
  language?: string;
  stars: number;
  archived?: boolean;
}

/** Cached summary of a Wikipedia article */
interface WikipediaPreview {
  kind: 'wikipedia';
  title: string;
  /** Wikidata short description, e.g. "Software development methodology" */
  description?: string;
  /** Plain-text lead, trimmed to a sentence or two */
  extract: string;
}

export type ExternalPreview = GitHubPreview | WikipediaPreview;

/** Shape of src/data/link-previews.json */
export interface ExternalPreviewCache {
  generatedAt: string;
  previews: Record<string, ExternalPreview>;
}

/** First path segments on github.com that are site pages, not repo owners */
const GITHUB_RESERVED_OWNERS = new Set([
  'about', 'apps', 'blog', 'collections', 'contact', 'customer-stories',
  'enterprise', 'events', 'explore', 'features', 'join', 'login',
  'marketplace', 'new', 'notifications', 'orgs', 'organizations', 'pricing',
  'pulls', 'search', 'security', 'settings', 'showcases', 'signup', 'site', 'sponsors', 'topics',
  'trending', 'users',
]);

const GITHUB_NAME = /^[A-Za-z0-9_.-]+$/;

/**
 * Key for a link to a GitHub repository's root (`github:owner/repo`, lowercased),
 * or null for anything else (issues, files, profiles, site pages).
 * A `#readme` fragment, trailing slash, or `.git` suffix still counts as the root.
 */
export function githubRepoKey(href: string): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') return null;

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length !== 2) return null;

  const owner = segments[0]!;
  const repo = segments[1]!.replace(/\.git$/i, '');
  if (GITHUB_RESERVED_OWNERS.has(owner.toLowerCase())) return null;
  if (!GITHUB_NAME.test(owner) || !GITHUB_NAME.test(repo)) return null;

  return `github:${owner}/${repo}`.toLowerCase();
}

/**
 * Key for a link to an English Wikipedia article (`wikipedia:Title_with_underscores`),
 * or null. Percent-encoding and spaces are normalized, so `Lock_%28computer_science%29`
 * and `Lock_(computer_science)` share a key. Namespaced pages (File:, Special:…) are skipped.
 */
export function wikipediaKey(href: string): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.hostname !== 'en.wikipedia.org' && url.hostname !== 'en.m.wikipedia.org') return null;
  if (!url.pathname.startsWith('/wiki/')) return null;

  let title: string;
  try {
    title = decodeURIComponent(url.pathname.slice('/wiki/'.length));
  } catch {
    return null;
  }
  title = title.replace(/ /g, '_').replace(/\/+$/, '');
  if (!title || /^[A-Za-z_]+:/.test(title)) return null;

  // MediaWiki treats the first letter as case-insensitive
  return `wikipedia:${title.charAt(0).toUpperCase()}${title.slice(1)}`;
}

/** The cache key for an external link, or null if it isn't a previewable kind */
export function externalPreviewKey(href: string): string | null {
  return githubRepoKey(href) ?? wikipediaKey(href);
}

export interface WaybackSnapshot {
  /** Capture time, UTC */
  captured: Date;
  /** The archived URL, as written after the timestamp */
  original: string;
}

/**
 * Parse an Internet Archive snapshot link
 * (`https://web.archive.org/web/20140301123456/http://example.com/`), or null.
 * Accepts partial timestamps and modifiers like `id_`; rejects wildcard
 * (`2014*`) search links, which aren't a single snapshot.
 */
export function parseWaybackUrl(href: string): WaybackSnapshot | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.hostname !== 'web.archive.org' && url.hostname !== 'wayback.archive.org') return null;

  const match = /^\/web\/(\d{4,14})(?:[a-z]{2}_)?\/(.+)$/.exec(url.pathname + url.search);
  if (!match) return null;

  const stamp = match[1]!.padEnd(14, '0');
  const year = Number(stamp.slice(0, 4));
  const month = Math.max(1, Number(stamp.slice(4, 6)));
  const day = Math.max(1, Number(stamp.slice(6, 8)));
  const captured = new Date(Date.UTC(
    year, month - 1, day,
    Number(stamp.slice(8, 10)), Number(stamp.slice(10, 12)), Number(stamp.slice(12, 14)),
  ));
  if (Number.isNaN(captured.getTime())) return null;

  let original = match[2]!;
  // The archive accepts "http:/example.com" with the second slash collapsed
  original = original.replace(/^(https?:)\/(?!\/)/, '$1//');
  if (!/^https?:\/\//.test(original)) original = `http://${original}`;

  return { captured, original };
}
