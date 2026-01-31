import { test, expect, devices } from '@playwright/test';
import { waitForPageReady, isAstroBuild } from './helpers';

/**
 * Mobile-specific tests for TLDR tooltip
 * These tests specifically verify iOS/mobile touch interaction
 */
test.describe('TLDR Tooltip - Mobile/iOS', () => {
  // Use a known blog post with description that displays TLDR
  const testPostUrl = '/2015/12/08/types-of-pull-requests/';

  test('should work on iOS Safari (iPhone)', async ({ browser }) => {
    // Create a context with iPhone viewport and user agent
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Verify iOS-specific CSS properties are applied
      const styles = await tldrElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          webkitTapHighlightColor: computed.getPropertyValue('-webkit-tap-highlight-color'),
          touchAction: computed.touchAction,
          cursor: computed.cursor,
        };
      });

      // Verify touch-action is set for proper iOS handling
      expect(styles.touchAction).toBe('manipulation');

      // Tap the element to show tooltip
      await tldrElement.tap();

      // Wait for tooltip to appear
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await expect(tooltip).toContainText('Too Long');

      // Tap again to hide
      await tldrElement.tap();

      // Tooltip should be gone
      await expect(tooltip).not.toBeAttached({ timeout: 1000 });
    }

    await context.close();
  });

  test('should work on Android Chrome', async ({ browser }) => {
    // Create a context with Android viewport and user agent
    const context = await browser.newContext({
      ...devices['Pixel 5'],
    });
    const page = await context.newPage();

    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Tap the element to show tooltip
      await tldrElement.tap();

      // Wait for tooltip to appear
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await expect(tooltip).toContainText('Too Long');

      // Tap elsewhere to close via click-outside
      await page.locator('body').tap({ position: { x: 50, y: 50 } });

      // Tooltip should be gone
      await expect(tooltip).not.toBeAttached({ timeout: 1000 });
    }

    await context.close();
  });

  test('should not show tooltip on hover on mobile', async ({ browser }) => {
    // Mobile devices don't have hover, so the hover event shouldn't trigger
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Try to hover (should not work on mobile)
      await tldrElement.hover();

      // Tooltip should NOT appear on hover (mobile devices use tap, not hover)
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).not.toBeAttached({ timeout: 500 });
    }

    await context.close();
  });

  test('should use pointer cursor on touch devices', async ({ browser }) => {
    // Touch devices should get cursor: pointer instead of cursor: help
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Check that cursor is pointer on touch devices
      const cursor = await tldrElement.evaluate((el) => {
        return window.getComputedStyle(el).cursor;
      });

      // On touch devices with any-pointer: coarse, cursor should be 'pointer'
      // This includes iPhones, iPads, and Android devices with touchscreens
      expect(cursor).toBe('pointer');
    }

    await context.close();
  });

  test('should work on iPad Safari (iPadOS)', async ({ browser }) => {
    // iPad is a hybrid device: it has hover (via trackpad/mouse) and touch
    // The media query uses any-pointer: coarse to detect touch capability
    const context = await browser.newContext({
      ...devices['iPad Pro 11'],
    });
    const page = await context.newPage();

    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Verify touch-action is set for proper iPadOS handling
      const styles = await tldrElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          touchAction: computed.touchAction,
          cursor: computed.cursor,
        };
      });

      // Verify touch-action is set for proper iPad touch handling
      expect(styles.touchAction).toBe('manipulation');

      // Tap the element to show tooltip (touch interaction)
      await tldrElement.tap();

      // Wait for tooltip to appear
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await expect(tooltip).toContainText('Too Long');

      // Tap again to hide
      await tldrElement.tap();

      // Tooltip should be gone
      await expect(tooltip).not.toBeAttached({ timeout: 1000 });
    }

    await context.close();
  });

  test('should provide visual feedback on tap (tap highlight)', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Verify -webkit-tap-highlight-color is set
      const tapHighlight = await tldrElement.evaluate((el) => {
        return window.getComputedStyle(el).getPropertyValue('-webkit-tap-highlight-color');
      });

      // Should have some value set (not default transparent)
      expect(tapHighlight).toBeTruthy();
      // The actual value may vary based on browser, but it should be set
      // We're looking for rgba(0, 0, 0, 0.1) or similar
      expect(tapHighlight).toContain('rgba');
    }

    await context.close();
  });
});
