// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

/**
 * Guards `assets.run_worker_first` in wrangler.json. Requests it excludes skip
 * worker/index.js entirely, so a negative pattern that matches a page URL
 * would silently break Markdown content negotiation (and Vary: Accept), and
 * one that matches /api/event would drop engagement events.
 */

const { assets } = JSON.parse(
  readFileSync(new URL('../wrangler.json', import.meta.url), 'utf8'),
);
const patterns = /** @type {string[]} */ (assets.run_worker_first);

/**
 * Same glob semantics as Cloudflare's asset router (workers-shared, bundled
 * in miniflare): `*` matches any run of characters, including `/`; everything
 * else is literal; the whole pathname must match.
 * @param {string} glob
 */
const toRegExp = (glob) =>
  new RegExp(`^${glob.split('*').map((part) => part.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('.*')}$`);

const include = patterns.filter((p) => !p.startsWith('!')).map(toRegExp);
const exclude = patterns.filter((p) => p.startsWith('!')).map((p) => toRegExp(p.slice(1)));

/** Negative patterns win; otherwise any positive match runs the Worker first. */
const runsWorkerFirst = (/** @type {string} */ pathname) =>
  include.some((re) => re.test(pathname)) && !exclude.some((re) => re.test(pathname));

describe('run_worker_first', () => {
  it.each([
    '/',
    '/about/',
    '/2020/01/02/some-post/',
    '/2020/01/02/a.dotted.slug/',
    '/posts/',
    '/api/event',
  ])('routes %s through the Worker', (pathname) => {
    expect(runsWorkerFirst(pathname)).toBe(true);
  });

  it.each([
    '/feed.xml',
    '/sitemap-index.xml',
    '/sitemap-0.xml',
    '/robots.txt',
    '/llms.txt',
    '/humans.txt',
    '/index.md',
    '/2020/01/02/some-post.md',
    '/posts-meta.json',
    '/site.webmanifest',
    '/vcard.vcf',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/resume.pdf',
    '/.well-known/api-catalog',
    '/assets/global.abc123.css',
    '/og/some-post.png',
  ])('serves %s straight from assets', (pathname) => {
    expect(runsWorkerFirst(pathname)).toBe(false);
  });
});
