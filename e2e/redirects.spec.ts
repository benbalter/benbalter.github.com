import { test, expect, type Page } from '@playwright/test';

const expectPathname = (page: Page, expectedPath: string) => {
  const currentPath = new URL(page.url()).pathname;
  expect(currentPath).toBe(expectedPath);
};

test.describe('Legacy URL Redirects', () => {
  test('should redirect /cv/ to /resume/', async ({ page }) => {
    // Start on the legacy URL
    await page.goto('/cv/');
    
    // Should redirect to the new URL
    expectPathname(page, '/resume/');
  });

  test('should redirect /books/ to /other-recommended-reading/', async ({ page }) => {
    await page.goto('/books/');
    expectPathname(page, '/other-recommended-reading/');
  });

  test('should redirect post with typo /2014/01/27/open-collabortion/', async ({ page }) => {
    await page.goto('/2014/01/27/open-collabortion/');
    expectPathname(page, '/2014/01/27/open-collaboration/');
  });

  test('should redirect post with wrong date /2014/12/08/types-of-pull-requests/', async ({ page }) => {
    await page.goto('/2014/12/08/types-of-pull-requests/');
    expectPathname(page, '/2015/12/08/types-of-pull-requests/');
  });

  test('should redirect to external site for /2023/10/04/how-to-communicate-like-a-github-engineer/', async ({ page }) => {
    // Navigate to the redirect page
    await page.goto('/2023/10/04/how-to-communicate-like-a-github-engineer/');
    
    // Should redirect to GitHub blog (same page, not new tab)
    await expect(page).toHaveURL(/github\.blog/);
  });

  test('should show redirect message before redirecting', async ({ request }) => {
    // Fetch the redirect page HTML directly without following redirects
    const response = await request.get('/cv/', { 
      maxRedirects: 0,
      failOnStatusCode: false 
    });
    
    const content = await response.text();
    
    // Check that the redirect HTML contains proper elements
    expect(content).toContain('Redirecting');
    expect(content).toContain('<h1>');
    expect(content).toContain('/resume/');
    expect(content).toContain('meta http-equiv="refresh"');
  });
});
