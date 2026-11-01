#!/usr/bin/env tsx
/**
 * Print a Markdown Search Console report for ben.balter.com: totals against the
 * previous period, pages that gained or lost clicks, "striking distance"
 * queries (positions 8-20), top-ranking queries nobody clicks, sitemap health,
 * and whether recent posts are indexed.
 *
 * The monthly cloud routine runs this and turns the output into
 * recommendations; locally it's a quick way to see the same data without the
 * gsc MCP server. Search data is private and this repo is public, so the
 * report goes to stdout only: never commit it, paste it into an issue, or run
 * it in CI.
 *
 * Usage:
 *   npx tsx script/gsc-report.ts                # 28-day comparison, 90-day query windows
 *   npx tsx script/gsc-report.ts --days 7
 *
 * Environment:
 *   GSC_SERVICE_ACCOUNT_KEY: the service-account key as JSON, as base64-encoded
 *   JSON (handy in cloud environment settings, which are one line per
 *   variable), or a 1Password op:// reference (what .env holds locally).
 *
 * The token requests the read-only `webmasters.readonly` scope, so the report
 * can't change anything even if the service account's Search Console
 * permission is broader than it needs.
 */

import { execFileSync } from 'node:child_process';
import { createSign } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv } from 'node:process';
import { parseArgs } from 'node:util';

const SITE = 'sc-domain:ben.balter.com';
const ORIGIN = 'https://ben.balter.com';
const API = 'https://searchconsole.googleapis.com';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
/** Search Console data lags by a few days; ending the window here avoids a fake drop. */
const LAG_DAYS = 3;
/** Query-level data is sparse, so the query sections look back further than the totals. */
const QUERY_WINDOW_DAYS = 90;
/** Posts published within this many days get a URL inspection. */
const NEW_POST_DAYS = 45;

const { values } = parseArgs({
  args: argv.slice(2),
  options: { days: { type: 'string', default: '28' } },
});
const days = Number.parseInt(String(values.days), 10);

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri: string;
}

interface Row {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

function loadKey(): ServiceAccountKey {
  try {
    process.loadEnvFile();
  } catch {
    /* no .env; rely on the environment */
  }
  let raw = process.env.GSC_SERVICE_ACCOUNT_KEY?.trim();
  if (!raw) {
    console.error('gsc-report: set GSC_SERVICE_ACCOUNT_KEY (JSON, base64 JSON, or an op:// reference).');
    process.exit(1);
  }
  if (raw.startsWith('op://')) raw = execFileSync('op', ['read', raw], { encoding: 'utf8' });
  else if (!raw.startsWith('{')) raw = Buffer.from(raw, 'base64').toString('utf8');
  return JSON.parse(raw) as ServiceAccountKey;
}

async function accessToken(key: ServiceAccountKey): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: key.client_email,
    scope: SCOPE,
    aud: key.token_uri,
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
  const response = await fetch(key.token_uri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  if (!response.ok) throw new Error(`token exchange failed: ${response.status} ${await response.text()}`);
  return ((await response.json()) as { access_token: string }).access_token;
}

const token = await accessToken(loadKey());

async function call<T>(path: string, body?: object): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`);
  return (await response.json()) as T;
}

const siteSegment = `/webmasters/v3/sites/${encodeURIComponent(SITE)}`;
const isoDate = (date: Date) => date.toISOString().slice(0, 10);
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

async function query(dimensions: string[], start: Date, end: Date, rowLimit = 1000): Promise<Row[]> {
  const result = await call<{ rows?: Row[] }>(`${siteSegment}/searchAnalytics/query`, {
    startDate: isoDate(start),
    endDate: isoDate(end),
    dimensions,
    rowLimit,
    dataState: 'all',
  });
  return result.rows ?? [];
}

const path = (url: string) => url.replace(ORIGIN, '') || '/';
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const sum = (rows: Row[], field: 'clicks' | 'impressions') => rows.reduce((total, row) => total + row[field], 0);

function table(headers: string[], rows: (string | number)[][]): string {
  if (rows.length === 0) return '_None._\n';
  const line = (cells: (string | number)[]) => `| ${cells.join(' | ')} |`;
  return [line(headers), line(headers.map(() => '---')), ...rows.map(line)].join('\n') + '\n';
}

const end = daysAgo(LAG_DAYS);
const start = daysAgo(LAG_DAYS + days - 1);
const previousEnd = daysAgo(LAG_DAYS + days);
const previousStart = daysAgo(LAG_DAYS + 2 * days - 1);
const queryStart = daysAgo(LAG_DAYS + QUERY_WINDOW_DAYS - 1);

const [current, previous, queryPages] = await Promise.all([
  query(['page'], start, end),
  query(['page'], previousStart, previousEnd),
  query(['query', 'page'], queryStart, end, 5000),
]);

const out: string[] = [];
out.push(`# Search Console report: ${SITE}\n`);
out.push(`${isoDate(start)} to ${isoDate(end)} (${days} days), compared with the ${days} days before. Query sections cover the last ${QUERY_WINDOW_DAYS} days.\n`);

out.push('## Totals\n');
const totalRow = (label: string, rows: Row[]) => {
  const clicks = sum(rows, 'clicks');
  const impressions = sum(rows, 'impressions');
  return [label, clicks, impressions, impressions ? pct(clicks / impressions) : 'n/a'];
};
out.push(table(['Period', 'Clicks', 'Impressions', 'CTR'], [totalRow('Current', current), totalRow('Previous', previous)]));

out.push('## Pages that gained or lost the most clicks\n');
const previousClicks = new Map(previous.map((row) => [row.keys[0], row.clicks]));
const deltas = [...new Set([...current.map((row) => row.keys[0]), ...previousClicks.keys()])].map((url) => {
  const now = current.find((row) => row.keys[0] === url)?.clicks ?? 0;
  const before = previousClicks.get(url) ?? 0;
  return { url, now, before, delta: now - before };
});
deltas.sort((a, b) => b.delta - a.delta);
const movers = [...deltas.slice(0, 10), ...deltas.slice(-10).reverse()].filter((row) => row.delta !== 0);
out.push(table(['Page', 'Clicks now', 'Before', 'Change'], movers.map((row) => [path(row.url), row.now, row.before, row.delta > 0 ? `+${row.delta}` : row.delta])));

out.push('## Striking distance (average position 8-20)\n');
out.push('Queries where a page is close to the first page of results. Fragment URLs (`#section`) are folded into their page.\n');
const striking = queryPages
  .filter((row) => row.position >= 8 && row.position <= 20 && row.impressions >= 10 && !row.keys[1].includes('#'))
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25);
out.push(table(['Query', 'Page', 'Impressions', 'Clicks', 'Position'], striking.map((row) => [row.keys[0], path(row.keys[1]), row.impressions, row.clicks, row.position.toFixed(1)])));

out.push('## Ranking but not clicked (position 1-7, CTR under 1%)\n');
out.push('Usually a title or description that doesn\'t match what the searcher wanted, or a navigational query the post can\'t win.\n');
const unclicked = queryPages
  .filter((row) => row.position <= 7 && row.impressions >= 100 && row.ctr < 0.01)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 15);
out.push(table(['Query', 'Page', 'Impressions', 'CTR', 'Position'], unclicked.map((row) => [row.keys[0], path(row.keys[1]), row.impressions, pct(row.ctr), row.position.toFixed(1)])));

out.push('## Sitemaps\n');
const { sitemap: sitemaps = [] } = await call<{ sitemap?: { path: string; lastDownloaded?: string; errors?: string; warnings?: string; contents?: { submitted?: string }[] }[] }>(`${siteSegment}/sitemaps`);
out.push(table(['Sitemap', 'Last downloaded', 'URLs', 'Errors', 'Warnings'], sitemaps.map((s) => [s.path, s.lastDownloaded?.slice(0, 10) ?? 'never', s.contents?.[0]?.submitted ?? '?', s.errors ?? '0', s.warnings ?? '0'])));

out.push(`## Posts from the last ${NEW_POST_DAYS} days\n`);
const postsDir = join(process.cwd(), 'src/content/posts');
const cutoff = isoDate(daysAgo(NEW_POST_DAYS));
const recent = readdirSync(postsDir)
  .map((file) => /^(\d{4})-(\d{2})-(\d{2})-(.+)\.mdx?$/.exec(file))
  .filter((match): match is RegExpExecArray => match !== null && `${match[1]}-${match[2]}-${match[3]}` >= cutoff)
  .filter((match) => !/^published:\s*false/m.test(readFileSync(join(postsDir, match[0]), 'utf8')))
  .map((match) => `${ORIGIN}/${match[1]}/${match[2]}/${match[3]}/${match[4]}/`);
const inspections = await Promise.all(
  recent.map(async (url) => {
    const { inspectionResult } = await call<{ inspectionResult: { indexStatusResult: { verdict: string; coverageState: string; lastCrawlTime?: string } } }>(
      '/v1/urlInspection/index:inspect',
      { inspectionUrl: url, siteUrl: SITE },
    );
    const status = inspectionResult.indexStatusResult;
    return [path(url), status.verdict, status.coverageState, status.lastCrawlTime?.slice(0, 10) ?? 'never'];
  }),
);
out.push(table(['Post', 'Verdict', 'Coverage', 'Last crawled'], inspections));

console.log(out.join('\n'));
