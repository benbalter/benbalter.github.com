import { test, expect } from '@playwright/test';

/**
 * Production request path: worker/index.js plus Cloudflare's asset layer
 * (public/_headers, the built _redirects, not_found_handling). The suite runs
 * against `wrangler dev --local` (see playwright.config.ts), which applies all
 * of these the way production does. worker/index.test.js unit-tests the
 * Worker with a mocked ASSETS binding; these check the pieces wired together.
 */

const POST = '/2014/11/06/rules-of-communicating-at-github/';
const POST_HEADING = '# 15 rules for communicating at GitHub';

test.describe('Markdown content negotiation', () => {
  test('serves Markdown for Accept: text/markdown', async ({ request }) => {
    const res = await request.get(POST, { headers: { Accept: 'text/markdown' } });
    expect(res.status()).toBe(200);
    const headers = res.headers();
    expect(headers['content-type']).toMatch(/^text\/markdown/);
    expect(headers['vary']).toMatch(/\bAccept\b/i);
    expect(headers['cache-control']).toContain('private');
    // The Worker copies the asset's headers, so _headers rules survive.
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['link']).toContain('rel="api-catalog"');
    const body = await res.text();
    expect(body).toContain(POST_HEADING);
    expect(body).not.toContain('<html');
  });

  test('serves HTML that varies on Accept by default', async ({ request }) => {
    const res = await request.get(POST);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/^text\/html/);
    expect(res.headers()['vary']).toMatch(/\bAccept\b/i);
  });

  test('treats text/markdown;q=0 as a refusal', async ({ request }) => {
    const res = await request.get(POST, {
      headers: { Accept: 'text/markdown;q=0, text/html' },
    });
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/^text\/html/);
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
