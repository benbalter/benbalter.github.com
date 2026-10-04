#!/usr/bin/env tsx
/**
 * Write src/data/popular-posts.json from Cloudflare Web Analytics (RUM).
 *
 * Runs in the deploy workflow right before `npm run build`. The JSON is
 * gitignored: it holds traffic counts, and this repo is public. The build
 * treats the file as optional, so any failure here leaves the site building
 * normally, just without the "Most read" list.
 *
 * Usage:
 *   npm run popular-posts                 # trailing 30 days
 *   npm run popular-posts -- --days 14
 *
 * Environment:
 *   CLOUDFLARE_ANALYTICS_API_TOKEN (or CLOUDFLARE_API_TOKEN): a token with
 *   "Account Analytics: Read" on the account below. If neither is set, the
 *   script exits 0 without writing anything.
 *
 * Why 30 days: Cloudflare samples and rounds RUM data more coarsely as the
 * window grows; past about a month the per-post rows thin out to almost
 * nothing once bot-heavy traffic is filtered.
 *
 * Output never includes counts in logs, since CI logs are public.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv } from 'node:process';
import { parseArgs } from 'node:util';
import { frontMatterRedirects, loadRoutedEntries } from '../src/utils/front-matter-routes';
import {
  fetchRumPathCounts,
  parseRedirectsFile,
  rankPopularPosts,
  type PopularPostsData,
} from '../src/utils/popular-posts';

/** Cloudflare account that holds the ben.balter.com Web Analytics site. */
const ACCOUNT_TAG = '257c6aae4bebbdcd5bbe1d9136c08f1a';
const HOST = 'ben.balter.com';
const OUTPUT = join(process.cwd(), 'src/data/popular-posts.json');
/** Enough headroom for pages that drop curated posts before taking their top 5. */
const MAX_POSTS = 20;

const { values } = parseArgs({
  args: argv.slice(2),
  options: { days: { type: 'string', default: '30' } },
});
const days = Number.parseInt(String(values.days), 10);

// Locally, .env may hold a 1Password op:// reference (as for script/analytics.mjs).
try {
  process.loadEnvFile();
} catch {
  /* no .env; rely on the environment */
}
let token = process.env.CLOUDFLARE_ANALYTICS_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
if (token?.startsWith('op://')) {
  token = execFileSync('op', ['read', token], { encoding: 'utf8' }).trim();
}
if (!token) {
  console.log('popular-posts: no Cloudflare analytics token set; skipping.');
  process.exit(0);
}

const entries = loadRoutedEntries();
const postIds = entries
  .filter((e) => e.collection === 'posts')
  .filter((e) => (e.data as { published?: unknown }).published !== false)
  .filter((e) => (e.data as { archived?: unknown }).archived !== true)
  .map((e) => e.id);

const redirects = parseRedirectsFile(readFileSync(join(process.cwd(), 'public/_redirects'), 'utf8'));
for (const { source, destination } of frontMatterRedirects(entries)) {
  redirects.set(source, destination);
}

const end = new Date();
const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

try {
  const rows = await fetchRumPathCounts({ token, accountTag: ACCOUNT_TAG, host: HOST, start, end });
  const posts = rankPopularPosts(rows, postIds, { redirects, limit: MAX_POSTS });
  if (posts.length === 0) {
    console.log('popular-posts: no post traffic matched; leaving any existing file alone.');
    process.exit(0);
  }
  const data: PopularPostsData = {
    generatedAt: end.toISOString(),
    windowDays: days,
    source: 'Cloudflare Web Analytics (rumPageloadEventsAdaptiveGroups)',
    posts,
  };
  writeFileSync(OUTPUT, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`popular-posts: wrote ${posts.length} posts (${days}-day window).`);
} catch (error) {
  // Don't fail the deploy over analytics; the build renders without the list.
  console.warn(`popular-posts: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(0);
}
