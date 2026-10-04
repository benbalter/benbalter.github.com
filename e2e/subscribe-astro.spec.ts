import { test, expect } from '@playwright/test';
import {
  checkCommonElements,
  checkNavigation,
  checkFooter,
  waitForPageReady,
} from './helpers';

/**
 * Tests for the /subscribe/ landing page — a shareable URL that composes the
 * same SubscribeCta used on posts and the homepage (RSS, email form, social).
 */
test.describe('Subscribe Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/subscribe/');
    await waitForPageReady(page);
  });

  test('should load successfully with nav and footer', async ({ page }) => {
    await checkCommonElements(page);
    await checkNavigation(page);
    await checkFooter(page);
  });

  test('should have a single Subscribe heading', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Subscribe');
  });

  test('should offer an RSS subscription link', async ({ page }) => {
    // Scope to the subscribe card — the footer/head also link to the feed.
    await expect(
      page.locator('.subscribe-card a[href="/feed.xml"]'),
    ).toBeVisible();
  });

  test('should have a labeled, required email input', async ({ page }) => {
    const emailInput = page.locator('input#subscribe-email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required', '');

    // The visible input must be programmatically labeled (accessibility).
    await expect(page.locator('label[for="subscribe-email"]')).toHaveCount(1);
  });

  test('should post to the site Worker, not straight to Kit', async ({ page }) => {
    // A real form post, so the browser can submit it without JavaScript.
    const form = page.locator('form[data-subscribe-form]');
    await expect(form).toHaveAttribute('method', 'post');
    await expect(form).toHaveAttribute('action', '/api/subscribe');
  });

  test('should show the no-JS result the Worker redirects to', async ({ page }) => {
    await expect(page.locator('#subscribe-thanks')).toBeHidden();
    await page.goto('/subscribe/#subscribe-thanks');
    await expect(page.locator('#subscribe-thanks')).toBeVisible();
    await expect(page.locator('#subscribe-error')).toBeHidden();
  });

  test('should submit the email with a Turnstile token and confirm', async ({ page }) => {
    // Stand-ins for Turnstile and the Worker, so the test needs neither.
    await page.route('https://challenges.cloudflare.com/**', (route) =>
      route.fulfill({
        contentType: 'text/javascript',
        body: `window.turnstile = {
          render(el, options) { setTimeout(() => options.callback('test-token'), 0); return 'widget'; },
          reset() {},
        };`,
      }),
    );
    const posted = new URLSearchParams();
    await page.route('**/api/subscribe', (route) => {
      new URLSearchParams(route.request().postData() ?? '').forEach((value, key) => posted.set(key, value));
      return route.fulfill({ json: { ok: true } });
    });

    await page.locator('input#subscribe-email').fill('reader@example.com');
    await page.locator('form[data-subscribe-form] button[type="submit"]').click();

    await expect(page.locator('.subscribe-status')).toHaveText(/on the list/);
    expect(posted.get('email')).toBe('reader@example.com');
    expect(posted.get('cf-turnstile-response')).toBe('test-token');
  });

  test('should link to social follow options', async ({ page }) => {
    // Bluesky + LinkedIn are always rendered by SubscribeCta.
    const socialLinks = page.locator(
      'a[href*="bsky"], a[href*="bluesky"], a[href*="linkedin"]',
    );
    expect(await socialLinks.count()).toBeGreaterThan(0);
  });
});
