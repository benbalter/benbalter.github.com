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

      // Check tooltip is visible (wait up to 1s)
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tooltip).toContainText('Too Long');

      // Move mouse away
      await page.mouse.move(0, 0);

      // Tooltip should be gone (wait up to 1s for removal)
      await expect(tooltip).not.toBeAttached({ timeout: 1000 });
    }
  });

  test('should toggle tooltip on click/tap (mobile)', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Dispatch click event to simulate pure tap without mouse events
      await tldrElement.dispatchEvent('click');

      // Check tooltip is visible (wait up to 1s)
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tooltip).toContainText('Too Long');

      // Dispatch click again to hide tooltip
      await tldrElement.dispatchEvent('click');

      // Tooltip should be completely gone from DOM (wait up to 1s)
      const anyTooltip = page.locator('.custom-tooltip');
      await expect(anyTooltip).not.toBeAttached({ timeout: 1000 });
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

      // Check tooltip is visible (wait up to 1s)
      const tooltip = page.locator('.custom-tooltip.show');
      await expect(tooltip).toBeVisible({ timeout: 1000 });

      // Click somewhere else on the page
      await page.locator('body').click({ position: { x: 100, y: 100 } });

      // Tooltip should be completely gone from DOM (wait up to 1s)
      const anyTooltip = page.locator('.custom-tooltip');
      await expect(anyTooltip).not.toBeAttached({ timeout: 1000 });
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
      
      // Check ARIA and accessibility attributes
      await expect(tldrElement).toHaveAttribute('role', 'button');
      await expect(tldrElement).toHaveAttribute('aria-expanded', 'false');
      await expect(tldrElement).toHaveAttribute('tabindex', '0');
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Focus the element
      await tldrElement.focus();

      // Press Enter to show tooltip
      await page.keyboard.press('Enter');

      // Check tooltip is visible and has proper ARIA
      const tooltip = page.locator('.custom-tooltip[role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tldrElement).toHaveAttribute('aria-expanded', 'true');
      await expect(tldrElement).toHaveAttribute('aria-describedby');

      // Press Escape to hide tooltip
      await page.keyboard.press('Escape');

      // Tooltip should be gone
      await expect(tooltip).not.toBeAttached({ timeout: 1000 });
      await expect(tldrElement).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('should handle Space key to toggle tooltip', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const astro = await isAstroBuild(page);

    if (astro) {
      const tldrElement = page.locator('.lead strong abbr.initialism');
      await expect(tldrElement).toBeVisible();

      // Focus the element
      await tldrElement.focus();

      // Press Space to show tooltip
      await page.keyboard.press('Space');

      // Check tooltip is visible
      const tooltip = page.locator('.custom-tooltip[role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 1000 });
      await expect(tldrElement).toHaveAttribute('aria-expanded', 'true');

      // Press Space again to hide tooltip
      await page.keyboard.press('Space');

      // Tooltip should be gone
      await expect(tooltip).not.toBeAttached({ timeout: 1000 });
      await expect(tldrElement).toHaveAttribute('aria-expanded', 'false');
    }
  });
});
