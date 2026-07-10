#!/usr/bin/env node

/**
 * Cloudflare Web Analytics report
 *
 * Pulls visitor/pageview stats for the site from Cloudflare Web Analytics (RUM)
 * via the GraphQL Analytics API and prints a breakdown of top pages, referrers,
 * countries, devices, browsers, and a daily trend.
 *
 * Usage:
 *   node script/analytics.mjs                 # last 7 days, ben.balter.com
 *   node script/analytics.mjs --days 30       # last 30 days
 *   node script/analytics.mjs --host word2md.com
 *   node script/analytics.mjs --day 2026-06-15   # single UTC day (drill into a spike)
 *   npm run analytics -- --days 30
 *
 * Environment variables:
 *   CLOUDFLARE_API_TOKEN  – token with Account Analytics: Read (loaded from .env)
 *
 * Notes:
 *   - The Cloudflare account hosts several sites; results are filtered to --host.
 *   - Cloudflare returns precise counts only for ~the last 7 days. Older data is
 *     rounded to the nearest 10 and lightly sampled, so longer windows are
 *     approximate. The 7-day window is the trustworthy one.
 */

import { argv } from 'node:process';

const GQL_URL = 'https://api.cloudflare.com/client/v4/graphql';
const API_BASE = 'https://api.cloudflare.com/client/v4';

// Node 20.12+ reads .env natively; ignore if already in the environment.
try {
  process.loadEnvFile();
} catch {
  /* .env not present or already loaded — rely on process.env */
}

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
if (!TOKEN) {
  console.error('Missing CLOUDFLARE_API_TOKEN (expected in .env or environment).');
  process.exit(1);
}

/** Minimal flag parser: --days 30, --host x, --day YYYY-MM-DD, --limit N */
function parseArgs(args) {
  const opts = { days: 7, host: 'ben.balter.com', day: null, limit: 25 };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--days') opts.days = parseInt(args[++i], 10);
    else if (a === '--host') opts.host = args[++i];
    else if (a === '--day') opts.day = args[++i];
    else if (a === '--limit') opts.limit = parseInt(args[++i], 10);
    else if (a === '--help' || a === '-h') opts.help = true;
  }
  return opts;
}

const opts = parseArgs(argv.slice(2));
if (opts.help) {
  console.log(
    'Usage: node script/analytics.mjs [--days N] [--host HOST] [--day YYYY-MM-DD] [--limit N]'
  );
  process.exit(0);
}

const authHeaders = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

/** Resolve the account tag the token can see (avoids hardcoding). */
async function getAccountTag() {
  const res = await fetch(`${API_BASE}/accounts`, { headers: authHeaders });
  const json = await res.json();
  if (!json.success || !json.result?.length) {
    throw new Error(`Could not list accounts: ${JSON.stringify(json.errors)}`);
  }
  return json.result[0].id;
}

async function gql(query, variables) {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

const iso = (d) => d.toISOString().replace(/\.\d+Z$/, 'Z');

/** Build the datetime range: either a single --day or the trailing N days. */
function timeRange() {
  if (opts.day) {
    return { start: `${opts.day}T00:00:00Z`, end: `${opts.day}T23:59:59Z` };
  }
  const end = new Date();
  const start = new Date(end.getTime() - opts.days * 24 * 60 * 60 * 1000);
  return { start: iso(start), end: iso(end) };
}

/**
 * Fetch a grouped breakdown of RUM pageload events.
 * @param {string} accountTag
 * @param {string[]} dims  dimension field names to group by
 * @param {object} [o]     { order, limit }
 */
async function groups(accountTag, dims, { order = 'count_DESC', limit = opts.limit } = {}) {
  const { start, end } = timeRange();
  const dimFields = dims.join(' ');
  const query = `query($a:String!,$s:Time!,$e:Time!){
    viewer{ accounts(filter:{accountTag:$a}){
      rumPageloadEventsAdaptiveGroups(
        limit:${limit},
        orderBy:[${order}],
        filter:{datetime_geq:$s, datetime_leq:$e, requestHost:${JSON.stringify(opts.host)}}
      ){ count sum{visits} dimensions{${dimFields}} }
    }}
  }`;
  const data = await gql(query, { a: accountTag, s: start, e: end });
  return data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups ?? [];
}

function table(title, rows, key) {
  console.log(`\n### ${title}`);
  console.log(`${'value'.padEnd(52)}${'views'.padStart(8)}${'visits'.padStart(9)}`);
  for (const r of rows) {
    let v = String(r.dimensions[key] ?? '(direct)');
    if (v === '') v = '(direct)';
    if (v.length > 50) v = `${v.slice(0, 49)}…`;
    console.log(`${v.padEnd(52)}${String(r.count).padStart(8)}${String(r.sum.visits).padStart(9)}`);
  }
}

async function main() {
  const accountTag = await getAccountTag();
  const { start, end } = timeRange();
  const scope = opts.day ? `day ${opts.day}` : `last ${opts.days} days`;
  console.log(`# ${opts.host} — Cloudflare Web Analytics (${scope}, UTC)`);
  console.log(`# range: ${start} → ${end}`);

  const total = await groups(accountTag, ['requestHost'], { limit: 1 });
  if (total.length) {
    console.log(`\nTOTAL: ${total[0].count} pageviews / ${total[0].sum.visits} visits`);
  } else {
    console.log('\nNo data for this host/range.');
    return;
  }

  table('Top pages', await groups(accountTag, ['requestPath']), 'requestPath');
  table('Top referrer hosts', await groups(accountTag, ['refererHost'], { limit: 20 }), 'refererHost');
  table('Top countries', await groups(accountTag, ['countryName'], { limit: 12 }), 'countryName');
  table('Device type', await groups(accountTag, ['deviceType'], { limit: 5 }), 'deviceType');
  table('Browser', await groups(accountTag, ['userAgentBrowser'], { limit: 10 }), 'userAgentBrowser');

  if (!opts.day) {
    table(
      'Daily trend',
      await groups(accountTag, ['date'], { order: 'date_ASC', limit: 60 }),
      'date'
    );
  }

  if (opts.days > 7 && !opts.day) {
    console.log(
      '\nNote: counts older than ~7 days are rounded to the nearest 10 and sampled by Cloudflare.'
    );
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
