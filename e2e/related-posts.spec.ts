import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

// Related posts render through KeepReading.astro: a "Keep reading" heading, a
// prominent card for the top match, and a short list, all visible without JavaScript.
test.describe('Related Posts (Keep reading)', () => {
  test('shows related posts that link to other posts', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const firstPostUrl = await page.locator('a[href*="/20"]').first().getAttribute('href');
    if (!firstPostUrl) throw new Error('No blog post link found on the homepage');

    await page.goto(firstPostUrl);
    await waitForPageReady(page);

    const section = page.locator('section.keep-reading');
    await expect(section).toHaveCount(1);
    await expect(section).toHaveAttribute('aria-labelledby', 'keep-reading-heading');
    await expect(section.getByRole('heading', { name: 'Keep reading' })).toBeVisible();

    const links = section.locator('a[href*="/20"]');
    expect(await links.count()).toBeGreaterThan(0);

    // A post should never recommend itself.
    const currentPath = new URL(page.url()).pathname;
    for (const href of await links.evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).pathname))) {
      expect(href).not.toBe(currentPath);
    }
  });
});
