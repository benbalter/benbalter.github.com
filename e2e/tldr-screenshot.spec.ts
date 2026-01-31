import { test, devices } from '@playwright/test';

/**
 * Screenshot test for visual verification of TL;DR mobile support
 */
test.describe('TLDR Visual Screenshots', () => {
  test('capture TL;DR on iPhone before and after tap', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/2015/12/08/types-of-pull-requests/');
    await page.waitForLoadState('networkidle');

    // Scroll to the TL;DR element
    const tldrElement = page.locator('.lead strong abbr.initialism');
    await tldrElement.scrollIntoViewIfNeeded();
    
    // Take screenshot before tap
    await page.screenshot({
      path: 'tldr-mobile-before-tap.png',
      fullPage: false,
    });

    // Tap to show tooltip
    await tldrElement.tap();
    await page.waitForTimeout(500);

    // Take screenshot with tooltip
    await page.screenshot({
      path: 'tldr-mobile-with-tooltip.png',
      fullPage: false,
    });

    await context.close();
  });

  test('capture TL;DR on desktop', async ({ page }) => {
    await page.goto('/2015/12/08/types-of-pull-requests/');
    await page.waitForLoadState('networkidle');

    // Scroll to the TL;DR element
    const tldrElement = page.locator('.lead strong abbr.initialism');
    await tldrElement.scrollIntoViewIfNeeded();

    // Take screenshot before hover
    await page.screenshot({
      path: 'tldr-desktop-before-hover.png',
      fullPage: false,
    });

    // Hover to show tooltip
    await tldrElement.hover();
    await page.waitForTimeout(500);

    // Take screenshot with tooltip
    await page.screenshot({
      path: 'tldr-desktop-with-tooltip.png',
      fullPage: false,
    });
  });
});
