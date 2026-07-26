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

  test('should link to social follow options', async ({ page }) => {
    // Bluesky + LinkedIn are always rendered by SubscribeCta.
    const socialLinks = page.locator(
      'a[href*="bsky"], a[href*="bluesky"], a[href*="linkedin"]',
    );
    expect(await socialLinks.count()).toBeGreaterThan(0);
  });
});
