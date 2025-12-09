import { test, expect } from '@playwright/test';
import { waitForPageReady, isAstroBuild } from './helpers';

test.describe('TLDR Tooltip', () => {
  // Use a known blog post with description that displays TLDR
  const testPostUrl = '/2015/12/08/types-of-pull-requests/';

  test('should display TLDR component with tooltip on posts with description', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      // Check TLDR component is visible
      const tldr = page.locator('.lead strong abbr.initialism');
      await expect(tldr).toBeVisible();
      await expect(tldr).toHaveText('TL;DR');

      // Check tooltip attributes are present
      await expect(tldr).toHaveAttribute('data-tooltip', 'true');
      await expect(tldr).toHaveAttribute('data-tooltip-text');

      // Verify tooltip text contains expected content
      const tooltipText = await tldr.getAttribute('data-tooltip-text');
      expect(tooltipText).toContain('Too Long');
      expect(tooltipText).toContain('Didn\'t Read');
    }
  });

  test('should show tooltip on hover (desktop)', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Hover over the TLDR element
      await tldrElement.hover();

      // Wait a bit for tooltip to appear
      await page.waitForTimeout(100);

      // Check tooltip is visible
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toContainText('Too Long');

      // Move mouse away
      await page.mouse.move(0, 0);

      // Wait for tooltip to fade out
      await page.waitForTimeout(400);

      // Tooltip should be gone
      await expect(tooltip).not.toBeAttached();
    }
  });

  test('should toggle tooltip on click/tap (mobile)', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Dispatch click event without triggering mouse events
      await tldrElement.dispatchEvent('click');

      // Wait for tooltip to appear
      await page.waitForTimeout(200);

      // Check tooltip is visible
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).toBeVisible();
      await expect(tooltip).toContainText('Too Long');

      // Dispatch click again to hide tooltip
      await tldrElement.dispatchEvent('click');

      // Wait for tooltip to fade out and be removed
      await page.waitForTimeout(500);

      // Tooltip should be completely gone from DOM
      const anyTooltip = page.locator('.custom-tooltip');
      await expect(anyTooltip).not.toBeAttached();
    }
  });

  test('should close tooltip when clicking outside', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Click to show tooltip
      await tldrElement.click();

      // Wait a bit for tooltip to appear
      await page.waitForTimeout(100);

      // Check tooltip is visible
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).toBeVisible();

      // Click somewhere else on the page
      await page.locator('body').click({ position: { x: 100, y: 100 } });

      // Wait for tooltip to fade out and be removed
      await page.waitForTimeout(500);

      // Tooltip should be completely gone from DOM
      const anyTooltip = page.locator('.custom-tooltip');
      await expect(anyTooltip).not.toBeAttached();
    }
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Check for help cursor style
      const cursorStyle = await tldrElement.evaluate((el) => {
        return window.getComputedStyle(el).cursor;
      });
      expect(cursorStyle).toBe('help');

      // Check element is clickable and interactive
      await expect(tldrElement).toHaveAttribute('data-tooltip', 'true');
      await expect(tldrElement).toHaveAttribute('data-tooltip-text');
    }
  });
});
