import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

/**
 * Content Security Policy
 *
 * security.csp in astro.config.mjs emits a per-page <meta> CSP whose
 * script-src allows only 'self' plus hashes of each inline script, with no
 * 'unsafe-inline'. Anything that changes an inline script after Astro hashes
 * it (e.g. an HTML minifier with minifyJS on) or adds an unhashed one (an
 * inline <script> in MDX content) gets silently blocked in the browser. These
 * tests catch that by listening for CSP violations on representative pages.
 */

const PAGES = [
  '/',
  '/posts/',
  '/about/',
  '/resume/',
  '/subscribe/',
  '/2014/03/13/pages-anchor-links/', // code blocks (expressive-code)
  '/2015/08/12/the-zen-of-github/', // live API fetch
  '/2022/03/17/why-async/',
];

test.describe('Content Security Policy', () => {
  for (const path of PAGES) {
    test(`${path} has a hash-based CSP and no violations`, async ({ page }) => {
      const violations: string[] = [];
      await page.exposeFunction('reportCspViolation', (v: string) => violations.push(v));
      await page.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', (e) => {
          (window as unknown as { reportCspViolation: (v: string) => void }).reportCspViolation(
            `${e.violatedDirective} blocked ${e.blockedURI || 'inline'}`,
          );
        });
      });

      await page.goto(path);
      await waitForPageReady(page);

      const csp = await page
        .locator('meta[http-equiv="content-security-policy" i]')
        .getAttribute('content');
      expect(csp).toBeTruthy();
      const scriptSrc = csp!.match(/script-src([^;]*)/)?.[1] ?? '';
      expect(scriptSrc).not.toContain("'unsafe-inline'");
      expect(scriptSrc).toContain("'sha256-");

      expect(violations).toEqual([]);
    });
  }

  test('search still works (Pagefind needs wasm-unsafe-eval)', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error' && /Content Security Policy/i.test(m.text())) violations.push(m.text());
    });
    await page.goto('/');
    await waitForPageReady(page);
    await page.keyboard.press('/');
    await page.keyboard.type('async');
    await expect(page.locator('#search-modal a').first()).toBeVisible({ timeout: 10_000 });
    expect(violations).toEqual([]);
  });
});
