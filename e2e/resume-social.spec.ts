import { test, expect } from '@playwright/test';
import { checkCommonElements, waitForPageReady } from './helpers';
import { socialBios } from '../src/content/social-bios';

test.describe('Resume social bios page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resume/social/');
    await waitForPageReady(page);
  });

  test('should load successfully', async ({ page }) => {
    await checkCommonElements(page);
  });

  test('should have noindex meta tag', async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('should show every bio with a copy button', async ({ page }) => {
    for (const entry of socialBios) {
      await expect(page.getByRole('heading', { name: entry.network, level: 2 })).toBeVisible();
      await expect(page.getByRole('button', { name: `Copy ${entry.network} bio to clipboard` })).toHaveAttribute('data-copy', entry.bio);
    }
  });

  test('should not warn that any bio is over its limit', async ({ page }) => {
    await expect(page.getByText(/over the .* limit/)).toHaveCount(0);
  });
});
