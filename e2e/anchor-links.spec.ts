import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

test.describe('Header Anchor Links (Astro)', () => {
  test('blog post headings should have anchor links', async ({ page }) => {
    // Navigate to a blog post with headings
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    // Check that h2 headings have anchor links
    const h2WithAnchors = page.locator('h2 a.anchor-link');
    const count = await h2WithAnchors.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Check the first anchor link has correct structure
    const firstAnchor = h2WithAnchors.first();
    await expect(firstAnchor).toHaveAttribute('href');
    await expect(firstAnchor).toHaveAttribute('aria-label', 'Link to this section');
    
    // Check the anchor contains the icon
    const anchorIcon = firstAnchor.locator('.anchor-icon');
    await expect(anchorIcon).toHaveText('#');
  });

  test('anchor links should be functional', async ({ page }) => {
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    // Get the first h2 anchor link and its href
    const firstAnchor = page.locator('h2 a.anchor-link').first();
    const href = await firstAnchor.getAttribute('href');
    
    expect(href).toBeTruthy();
    expect(href).toMatch(/^#/); // Should be a fragment identifier
    
    // Click the anchor link
    await firstAnchor.click();
    
    // Verify the URL contains the fragment
    await expect(page).toHaveURL(new RegExp(href!));
  });

  test('h3 headings should also have anchor links', async ({ page }) => {
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    // Check that h3 headings have anchor links
    const h3WithAnchors = page.locator('h3 a.anchor-link');
    const count = await h3WithAnchors.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('anchor links should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    // Check all anchor links have aria-label
    const allAnchors = page.locator('h2 a.anchor-link, h3 a.anchor-link, h4 a.anchor-link');
    const count = await allAnchors.count();
    
    if (count > 0) {
      // Check first few anchors have proper aria-label
      for (let i = 0; i < Math.min(3, count); i++) {
        const anchor = allAnchors.nth(i);
        await expect(anchor).toHaveAttribute('aria-label', 'Link to this section');
      }
    }
  });
});
