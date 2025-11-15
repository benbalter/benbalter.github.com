import { test, expect } from '@playwright/test';

test.describe('Legacy URL Redirects', () => {
  test('should redirect /cv/ to /resume/', async ({ page }) => {
    // Start on the legacy URL
    await page.goto('/cv/');
    
    // Should redirect to the new URL
    await expect(page).toHaveURL('/resume/');
  });

  test('should redirect /books/ to /other-recommended-reading/', async ({ page }) => {
    await page.goto('/books/');
    await expect(page).toHaveURL('/other-recommended-reading/');
  });

  test('should redirect post with typo /2014/01/27/open-collabortion/', async ({ page }) => {
    await page.goto('/2014/01/27/open-collabortion/');
    await expect(page).toHaveURL('/2014/01/27/open-collaboration/');
  });

  test('should redirect post with wrong date /2014/12/08/types-of-pull-requests/', async ({ page }) => {
    await page.goto('/2014/12/08/types-of-pull-requests/');
    await expect(page).toHaveURL('/2015/12/08/types-of-pull-requests/');
  });

  test('should redirect to external site for /2023/10/04/how-to-communicate-like-a-github-engineer/', async ({ page, context }) => {
    // Set up to allow navigation to external URL
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.goto('/2023/10/04/how-to-communicate-like-a-github-engineer/')
    ]);
    
    // Should redirect to GitHub blog
    await expect(newPage).toHaveURL(/github\.blog/);
  });

  test('should show redirect message before redirecting', async ({ page }) => {
    // Navigate to a redirect page
    await page.goto('/cv/', { waitUntil: 'domcontentloaded' });
    
    // Check for redirect HTML elements
    const heading = await page.locator('h1').textContent();
    expect(heading).toBe('Redirecting...');
  });
});
