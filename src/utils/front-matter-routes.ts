/**
 * Front-matter-driven routing: sitemap exclusions and `_redirects` rules.
 *
 * `redirect_from`, `redirect_to`, and `sitemap: false` are Jekyll-era front
 * matter fields. The content schema accepts them, but Astro does nothing with
 * them on its own. This module turns them into build output so front matter
 * stays the source of truth:
 *
 * - `sitemap: false` → URL excluded by the @astrojs/sitemap filter
 * - `redirect_from` → `<old path> <entry URL> 301`
 * - `redirect_to`   → `<entry URL> <target> 301`
 *
 * Both are wired up in astro.config.mjs. It runs outside Astro's content layer
 * (at config load and in `astro:build:done`), so it reads the Markdown files
 * directly instead of using getCollection().
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { getPostUrl } from './post-urls';

type RoutedCollection = 'posts' | 'pages';

export interface RoutedEntry {
  collection: RoutedCollection;
  /** Entry id: the file path relative to the collection, minus extension. */
  id: string;
  data: {
    permalink?: unknown;
    sitemap?: unknown;
    redirect_from?: unknown;
    redirect_to?: unknown;
  };
}

export interface Redirect {
  source: string;
  destination: string;
  status: 301;
}

const COLLECTIONS: RoutedCollection[] = ['posts', 'pages'];
const CONTENT_FILE = /\.mdx?$/;

/** The canonical URL path an entry renders at, with a trailing slash. */
export function entryUrl(entry: RoutedEntry): string {
  if (entry.collection === 'posts') return getPostUrl(entry.id);
  const { permalink } = entry.data;
  return typeof permalink === 'string' && permalink ? permalink : `/${entry.id}/`;
}

/**
 * URL paths to keep out of the sitemap: entries marked `sitemap: false`, plus
 * `redirect_to` entries, whose URL 301s off-site and so isn't a canonical page.
 */
export function sitemapExclusions(entries: RoutedEntry[]): string[] {
  return entries
    .filter((entry) => entry.data.sitemap === false || (typeof entry.data.redirect_to === 'string' && entry.data.redirect_to))
    .map(entryUrl);
}

function toArray(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  return [];
}

/**
 * Redirect rules from `redirect_from` and `redirect_to`. Throws when a
 * `redirect_from` path shadows another entry's own URL, since the redirect
 * would silently hide that page.
 */
export function frontMatterRedirects(entries: RoutedEntry[]): Redirect[] {
  const urls = new Set(entries.map(entryUrl));
  const redirects: Redirect[] = [];
  for (const entry of entries) {
    const url = entryUrl(entry);
    for (const source of toArray(entry.data.redirect_from)) {
      if (urls.has(source)) {
        throw new Error(`redirect_from "${source}" in ${entry.collection}/${entry.id} shadows an existing page`);
      }
      redirects.push({ source, destination: url, status: 301 });
    }
    if (typeof entry.data.redirect_to === 'string' && entry.data.redirect_to) {
      redirects.push({ source: url, destination: entry.data.redirect_to, status: 301 });
    }
  }
  return redirects;
}

/**
 * `_redirects` lines for each rule. Cloudflare matches the source path
 * literally, so a directory-style source (`/foo/`) also gets a bare `/foo`
 * rule, matching the convention in public/_redirects.
 */
export function formatRedirects(redirects: Redirect[]): string[] {
  return redirects.flatMap(({ source, destination, status }) => {
    const sources = source.length > 1 && source.endsWith('/') ? [source, source.slice(0, -1)] : [source];
    return sources.map((s) => `${s} ${destination} ${status}`);
  });
}

/** Source paths declared in a `_redirects` file (comments and blanks skipped). */
export function redirectSources(contents: string): string[] {
  return contents
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/)[0]!);
}

/** Read posts and pages front matter from `src/content`. */
export function loadRoutedEntries(root: string = process.cwd()): RoutedEntry[] {
  const entries: RoutedEntry[] = [];
  for (const collection of COLLECTIONS) {
    const base = join(root, 'src/content', collection);
    const files = readdirSync(base, { recursive: true, encoding: 'utf8' });
    for (const file of files.sort()) {
      // Mirrors the collection glob: `**/[^_]*.{md,mdx}`.
      const name = file.split('/').pop() ?? '';
      if (!CONTENT_FILE.test(name) || name.startsWith('_')) continue;
      const { data } = matter(readFileSync(join(base, file), 'utf8'));
      entries.push({ collection, id: file.replace(CONTENT_FILE, ''), data });
    }
  }
  return entries;
}
