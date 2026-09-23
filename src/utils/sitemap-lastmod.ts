/**
 * Sitemap <lastmod> from git history.
 *
 * `lastmod` is the one sitemap field Google uses (it ignores `priority` and
 * `changefreq`), and it only trusts the field when it's accurate. So dates come
 * from the last commit that touched each page's source file, never the build
 * time, and a URL with no known source gets no `lastmod` at all.
 *
 * Archive-wide sweeps (lint fixes, style enforcement, TL;DR rewrites) touch
 * dozens of posts at once. Counting them would stamp most of the archive as
 * modified in the same week, and Google learns to ignore a lastmod that moves
 * in lockstep. So a commit that touches more than SWEEP_THRESHOLD posts is
 * skipped. In this repo's history, 1–5 posts per commit is a deliberate edit
 * (a callout, a pull quote, a copy fix); 6+ is always tooling or a sweep. A
 * post with no qualifying edit falls back to its publish date from the URL.
 *
 * A shallow clone has no history (every file would date to the checkout
 * commit), so in that case the index is empty and the sitemap omits `lastmod`.
 * CI checks out full history for this; see build-and-deploy.yml.
 */

import { execFileSync } from 'node:child_process';

export const LASTMOD_SOURCE_DIRS = [
  'src/content/posts',
  'src/content/pages',
  'src/content/resume-positions',
];

/** A commit touching more posts than this is an archive-wide sweep. */
export const SWEEP_THRESHOLD = 5;

const POSTS_DIR = 'src/content/posts/';
const POST_URL_PATTERN = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/$/;
const PAGE_URL_PATTERN = /^\/([a-z0-9-]+)\/$/;

/**
 * Parse `git log --format=%x00%cI --name-only` output into a map of file path
 * to the ISO date of the newest non-sweep commit that touched it. Log output
 * is newest first, so the first date seen for a path wins.
 */
export function parseGitLog(output: string, sweepThreshold: number = SWEEP_THRESHOLD): Map<string, string> {
  const commits: { date: string; files: string[] }[] = [];
  for (const line of output.split('\n')) {
    if (line.startsWith('\0')) {
      commits.push({ date: line.slice(1).trim(), files: [] });
    } else if (line && commits.length > 0) {
      commits[commits.length - 1].files.push(line);
    }
  }

  const index = new Map<string, string>();
  for (const { date, files } of commits) {
    if (files.filter((f) => f.startsWith(POSTS_DIR)).length > sweepThreshold) continue;
    for (const file of files) {
      if (!index.has(file)) index.set(file, date);
    }
  }
  return index;
}

/** Build the file → last-modified index, or an empty map without full history. */
export function buildLastmodIndex(cwd: string = process.cwd()): Map<string, string> {
  try {
    const git = (args: string[]) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') {
      console.warn('[sitemap] Shallow git clone; omitting <lastmod> rather than emitting wrong dates');
      return new Map();
    }
    return parseGitLog(git(['log', '--format=%x00%cI', '--name-only', '--', ...LASTMOD_SOURCE_DIRS]));
  } catch {
    console.warn('[sitemap] git history unavailable; omitting <lastmod>');
    return new Map();
  }
}

/**
 * Source files (or directory prefixes, ending in `/`) whose edits change the
 * page at `url`. Unknown URLs return an empty list and get no `lastmod`.
 */
export function sourcesForUrl(url: string): string[] {
  const { pathname } = new URL(url);

  const post = pathname.match(POST_URL_PATTERN);
  if (post) {
    const [, year, month, day, slug] = post;
    const base = `src/content/posts/${year}-${month}-${day}-${slug}`;
    return [`${base}.md`, `${base}.mdx`];
  }

  // The résumé renders the page entry plus every position.
  if (pathname === '/resume/') {
    return ['src/content/pages/resume.md', 'src/content/resume-positions/'];
  }

  const page = pathname.match(PAGE_URL_PATTERN);
  if (page) {
    return [`src/content/pages/${page[1]}.md`, `src/content/pages/${page[1]}.mdx`];
  }

  return [];
}

/**
 * Newest last-modified date across a URL's sources. A post with no qualifying
 * edit gets its publish date; any other URL with no known source gets
 * undefined. An empty index (no git history) always yields undefined.
 */
export function lastmodForUrl(url: string, index: Map<string, string>): string | undefined {
  if (index.size === 0) return undefined;
  let newest: string | undefined;
  for (const source of sourcesForUrl(url)) {
    const dates = source.endsWith('/')
      ? [...index].filter(([path]) => path.startsWith(source)).map(([, date]) => date)
      : [index.get(source)].filter((d): d is string => Boolean(d));
    for (const date of dates) {
      if (!newest || Date.parse(date) > Date.parse(newest)) newest = date;
    }
  }
  if (!newest) {
    const post = new URL(url).pathname.match(POST_URL_PATTERN);
    if (post) newest = `${post[1]}-${post[2]}-${post[3]}`;
  }
  return newest;
}
