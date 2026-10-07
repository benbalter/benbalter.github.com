import { test, expect } from '@playwright/test';

/**
 * Production request path: worker/index.js plus Cloudflare's asset layer
 * (public/_headers, the built _redirects, not_found_handling). The suite runs
 * against `wrangler dev --local` (see playwright.config.ts), which applies all
 * of these the way production does. worker/index.test.js unit-tests the
 * Worker with a mocked ASSETS binding; these check the pieces wired together.
 *
 * Markdown content negotiation (Accept: text/markdown -> the page's .md file)
 * is a Cloudflare zone rule, which `wrangler dev` doesn't run, so it's checked
 * against production by script/check-markdown-negotiation instead.
 */

const POST_MD = '/2014/11/06/rules-of-communicating-at-github.md';
const POST_HEADING = '# 15 rules for communicating at GitHub';

test.describe('Markdown representations', () => {
  test('serve the pre-built .md as UTF-8 Markdown with _headers applied', async ({ request }) => {
    const res = await request.get(POST_MD);
    expect(res.status()).toBe(200);
    const headers = res.headers();
    expect(headers['content-type']).toBe('text/markdown; charset=utf-8');
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['link']).toContain('rel="api-catalog"');
    const body = await res.text();
    expect(body).toContain(POST_HEADING);
    expect(body).not.toContain('<html');
  });
});

test.describe('_headers', () => {
  test('applies security and Link headers to pages', async ({ request }) => {
    const res = await request.get('/about/');
    expect(res.status()).toBe(200);
    const headers = res.headers();
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['link']).toContain('</llms.txt>; rel="describedby"');
    expect(headers['link']).toContain('</sitemap-index.xml>; rel="sitemap"');
  });

  test('caches hashed assets immutably', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const asset = html.match(/(?:src|href)="(\/assets\/[^"]+\.js)"/)?.[1];
    expect(asset, 'homepage should reference a hashed /assets/ script').toBeTruthy();
    const res = await request.get(asset!);
    expect(res.status()).toBe(200);
    expect(res.headers()['cache-control']).toContain('immutable');
  });
});

test.describe('_redirects', () => {
  // Rules from public/_redirects (not generated from front matter).
  // maxRedirects: 0 checks the redirect itself, not the page it lands on.
  for (const [source, destination] of [
    ['/quotes/', '/posts/'],
    ['/feed/index.xml', '/feed.xml'],
    ['/talks/', 'https://speakerdeck.com/benbalter'],
  ]) {
    test(`${source} redirects to ${destination}`, async ({ request }) => {
      const res = await request.get(source, { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      expect(res.headers()['location']).toBe(destination);
    });
  }

  test('generated front matter rules redirect too', async ({ request }) => {
    const res = await request.get('/cv/', { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()['location']).toBe('/resume/');
  });
});

test.describe('/api/event', () => {
  test('accepts a known event', async ({ request }) => {
    const res = await request.post('/api/event', {
      data: { event: 'subscribe', path: '/subscribe/' },
    });
    expect(res.status()).toBe(204);
  });

  test('rejects an unknown event', async ({ request }) => {
    const res = await request.post('/api/event', {
      data: { event: 'not-an-event', path: '/' },
    });
    expect(res.status()).toBe(400);
  });
});
