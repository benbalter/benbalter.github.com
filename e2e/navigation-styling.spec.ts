/**
 * E2E tests for navigation bar styling
 *
 * The nav bar is a fully rounded, bordered card on every page, including the
 * homepage, and keeps that styling through client-side navigation with Astro
 * View Transitions. (The homepage used to have a hero image that squared off
 * the nav's top corners; the hero was removed.)
 */

import { test, expect, type Locator } from '@playwright/test';
import { waitForPageReady } from './helpers';

async function cornerRadii(nav: Locator) {
  return nav.evaluate((el) => {
    const styles = window.getComputedStyle(el);
    return [
      styles.borderTopLeftRadius,
      styles.borderTopRightRadius,
      styles.borderBottomLeftRadius,
      styles.borderBottomRightRadius,
    ];
  });
}

async function expectFullyRounded(nav: Locator) {
  await expect(nav).toHaveClass(/rounded-lg/);
  for (const radius of await cornerRadii(nav)) {
    expect(radius).not.toBe('0px');
  }
}

test.describe('Navigation Styling', () => {
  for (const path of ['/', '/about/', '/2026/07/14/work-loudly/']) {
    test(`is fully rounded on ${path}`, async ({ page }) => {
      await page.goto(path);
      await waitForPageReady(page);
      await expectFullyRounded(page.locator('nav.navbar'));
    });
  }

  test('stays fully rounded through client-side navigation and back', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    const nav = page.locator('nav.navbar');
    await expectFullyRounded(nav);

    await page.locator('a[href="/about/"]').first().click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    await expectFullyRounded(nav);

    await page.goBack();
    await page.waitForURL((url) => url.pathname === '/');
    await waitForPageReady(page);
    await expectFullyRounded(nav);
  });
});
