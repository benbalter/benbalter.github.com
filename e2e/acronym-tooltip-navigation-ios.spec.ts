import { test, expect, devices } from '@playwright/test';
import { waitForPageReady } from './helpers';

/**
 * Test for acronym tooltip functionality after View Transitions navigation on iOS/iPadOS
 * This reproduces the specific issue where tooltips stop working after page navigation
 */
test.describe('Acronym Tooltip - iOS/iPadOS Navigation', () => {
  const testPostUrl = '/2015/12/08/types-of-pull-requests/';

  test('should work after View Transitions navigation on iPhone', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    // Navigate directly to the test post (too old to appear in recent posts on homepage)
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    // Check acronym tooltip is visible on load
    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();
    await expect(acronym).toHaveText('WIP');

    // Wait for the tooltip runtime to wire up the acronym before tapping it
    await expect(acronym).toHaveAttribute('data-tooltip-initialized', 'true');

    // Verify tooltip still works (this is where it fails after View Transitions)
    await acronym.tap();

    // Check tooltip is visible
    const tooltip = page.locator('.custom-tooltip.show');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
    await expect(tooltip).toContainText('Work in progress');

    // Clean up - tap again to hide
    await acronym.tap();
    await expect(tooltip).not.toBeAttached({ timeout: 1000 });

    // Navigate away and back to test acronym tooltip re-initialization
    await page.goto('/');
    await waitForPageReady(page);
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    // Verify tooltip still works after re-navigation
    const acronym2 = page.locator('.post-content abbr.initialism');
    await expect(acronym2).toBeVisible();
    await expect(acronym2).toHaveAttribute('data-tooltip-initialized', 'true');
    await acronym2.tap();
    const tooltip2 = page.locator('.custom-tooltip.show');
    await expect(tooltip2).toBeVisible({ timeout: 2000 });

    await context.close();
  });

  test('should work after View Transitions navigation on iPad', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro 11'],
    });
    const page = await context.newPage();

    // Navigate directly to the test post (too old to appear in recent posts on homepage)
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    // Check acronym tooltip is visible on load
    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();
    await expect(acronym).toHaveText('WIP');

    // Wait for the tooltip runtime to wire up the acronym before tapping it
    await expect(acronym).toHaveAttribute('data-tooltip-initialized', 'true');

    // Verify tooltip still works after navigation on iPad (touch interaction)
    await acronym.tap();

    // Check tooltip is visible
    const tooltip = page.locator('.custom-tooltip.show');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
    await expect(tooltip).toContainText('Work in progress');

    // Clean up - tap again to hide
    await acronym.tap();
    await expect(tooltip).not.toBeAttached({ timeout: 1000 });

    await context.close();
  });
});
