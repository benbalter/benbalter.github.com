import { test, expect, devices } from '@playwright/test';
import { waitForPageReady, isAstroBuild } from './helpers';

/**
 * Test for TLDR tooltip functionality after View Transitions navigation on iOS/iPadOS
 * This reproduces the specific issue where tooltips stop working after page navigation
 */
test.describe('TLDR Tooltip - iOS/iPadOS Navigation', () => {
  const testPostUrl = '/2015/12/08/types-of-pull-requests/';

  test('should work after View Transitions navigation on iPhone', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    // Navigate to a real page before detecting the build system
    await page.goto('/');
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);
    if (!astro) {
      test.skip(true, 'Test requires Astro build');
    }

    // Navigate directly to the test post (too old to appear in recent posts on homepage)
    await page.goto(testPostUrl);
    await waitForPageReady(page);
    await page.waitForTimeout(500);

    // Check TLDR component is visible on load
    const tldrElement = page.locator('.tldr-content strong abbr.initialism');
    await expect(tldrElement).toBeVisible();
    await expect(tldrElement).toHaveText('TL;DR');

    // Verify tooltip still works (this is where it fails after View Transitions)
    await tldrElement.tap();

    // Check tooltip is visible
    const tooltip = page.locator('.custom-tooltip.show');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
    await expect(tooltip).toContainText('Too Long');

    // Clean up - tap again to hide
    await tldrElement.tap();
    await expect(tooltip).not.toBeAttached({ timeout: 1000 });

    // Navigate away and back to test TLDR re-initialization
    await page.goto('/');
    await waitForPageReady(page);
    await page.goto(testPostUrl);
    await waitForPageReady(page);
    await page.waitForTimeout(500);

    // Verify tooltip still works after re-navigation
    const tldrElement2 = page.locator('.tldr-content strong abbr.initialism');
    await expect(tldrElement2).toBeVisible();
    
    await tldrElement2.tap();
    const tooltip2 = page.locator('.custom-tooltip.show');
    await expect(tooltip2).toBeVisible({ timeout: 2000 });

    await context.close();
  });

  test('should work after View Transitions navigation on iPad', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro 11'],
    });
    const page = await context.newPage();

    // Navigate to a real page before detecting the build system
    await page.goto('/');
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);
    if (!astro) {
      test.skip(true, 'Test requires Astro build');
    }

    // Navigate directly to the test post (too old to appear in recent posts on homepage)
    await page.goto(testPostUrl);
    await waitForPageReady(page);
    await page.waitForTimeout(500);

    // Check TLDR component is visible on load
    const tldrElement = page.locator('.tldr-content strong abbr.initialism');
    await expect(tldrElement).toBeVisible();
    await expect(tldrElement).toHaveText('TL;DR');

    // Verify tooltip still works after navigation on iPad (touch interaction)
    await tldrElement.tap();

    // Check tooltip is visible
    const tooltip = page.locator('.custom-tooltip.show');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
    await expect(tooltip).toContainText('Too Long');

    // Clean up - tap again to hide
    await tldrElement.tap();
    await expect(tooltip).not.toBeAttached({ timeout: 1000 });

    await context.close();
  });
});
