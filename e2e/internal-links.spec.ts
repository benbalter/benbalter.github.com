import { test, expect } from '@playwright/test';

/**
 * Tests for internal links with absolute URLs
 * 
 * These tests verify that absolute internal URLs (e.g., https://ben.balter.com/about/)
 * are properly processed to use Astro view transitions instead of full page reloads.
 */

test.describe('Internal Links with Absolute URLs', () => {
  test('should add data-astro-reload="false" to absolute internal links', async ({ page }) => {
    // Navigate to a page that contains absolute internal URLs
    await page.goto('/2010/11/29/twitter-mentions-as-comments/');
    
    // Wait for the internal links script to process the page
    await page.waitForLoadState('networkidle');
    
    // Find an absolute internal link on the page
    // This post contains a link to https://ben.balter.com/2010/09/12/wordpress-resume-plugin/
    const internalLink = page.locator('a[href^="https://ben.balter.com/"]').first();
    
    // Verify the link exists
    await expect(internalLink).toBeVisible();
    
    // Verify it has been processed
    await expect(internalLink).toHaveAttribute('data-internal-processed', 'true');
    
    // Verify it has the correct data-astro-reload attribute
    await expect(internalLink).toHaveAttribute('data-astro-reload', 'false');
  });

  test('should process all absolute internal links on a page', async ({ page }) => {
    // Navigate to a page with multiple absolute internal links
    await page.goto('/2010/11/29/twitter-mentions-as-comments/');
    
    // Wait for the internal links script to process the page
    await page.waitForLoadState('networkidle');
    
    // Find all absolute internal links
    const internalLinks = page.locator('a[href^="https://ben.balter.com/"]');
    
    // Verify all have been processed
    const count = await internalLinks.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const link = internalLinks.nth(i);
      await expect(link).toHaveAttribute('data-internal-processed', 'true');
      await expect(link).toHaveAttribute('data-astro-reload', 'false');
    }
  });

  test('should not modify relative internal links', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the script to run
    await page.waitForLoadState('networkidle');
    
    // Find a relative internal link (navigation links are relative)
    const relativeLink = page.locator('a[href="/about/"]').first();
    
    // Verify it exists and has been processed
    await expect(relativeLink).toBeVisible();
    await expect(relativeLink).toHaveAttribute('data-internal-processed', 'true');
    
    // Relative links should NOT have data-astro-reload (they work by default)
    const hasReloadAttr = await relativeLink.getAttribute('data-astro-reload');
    expect(hasReloadAttr).toBeNull();
  });

  test('should not modify external links', async ({ page }) => {
    await page.goto('/about/');
    
    // Wait for the script to run
    await page.waitForLoadState('networkidle');
    
    // Find an external link (social links in footer)
    const externalLink = page.locator('a[href^="https://github.com/"]').first();
    
    if (await externalLink.count() > 0) {
      // Verify it has been processed
      await expect(externalLink).toHaveAttribute('data-internal-processed', 'true');
      
      // External links should NOT have data-astro-reload attribute
      const hasReloadAttr = await externalLink.getAttribute('data-astro-reload');
      expect(hasReloadAttr).toBeNull();
    }
  });

  test('should re-process links after page transition', async ({ page }) => {
    // Navigate to first page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click a link to trigger Astro page transition
    await page.click('a[href="/about/"]');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the new page
    await expect(page).toHaveURL('/about/');
    
    // Check that links on the new page are also processed
    const links = page.locator('a[data-internal-processed="true"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
