import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

/**
 * The WebMCP feature check (src/scripts/webmcp-init.ts). Kept apart from
 * webmcp.spec.ts, which launches Chromium with WebMCP turned on for the whole
 * file; this test needs a browser without it.
 */

test('browsers without WebMCP never download the tools', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (req) => {
    if (req.resourceType() === 'script') scripts.push(req.url());
  });

  await page.goto('/');
  await waitForPageReady(page);

  expect(scripts.some((url) => /\/webmcp\.[^/]*\.js$/.test(url))).toBe(false);
  expect(scripts.some((url) => url.includes('/pagefind/'))).toBe(false);
});
