import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

test.describe('Navigation Active Link Highlighting', () => {
  test('should highlight About link when on About page', async ({ page }) => {
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // Jekyll adds active class server-side based on current page
    const aboutLink = page.locator('a[href="/about/"]');
    await expect(aboutLink).toHaveClass(/active/);
  });

  test('should highlight Contact link when on Contact page', async ({ page }) => {
    await page.goto('/contact/');
    await waitForPageReady(page);
    
    const contactLink = page.locator('a[href="/contact/"]');
    await expect(contactLink).toHaveClass(/active/);
  });

  test('should highlight Posts link when on homepage', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Root path (/) should highlight the home/posts link
    // Use .nav-link selector to avoid matching navbar-brand which also has href="/"
    const homeLink = page.locator('.nav-link[href="/"]');
    await expect(homeLink).toHaveClass(/active/);
  });

  test('should update active class when navigating between pages', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    await waitForPageReady(page);
    
    // Use .nav-link selector to avoid matching navbar-brand which also has href="/"
    const homeLink = page.locator('.nav-link[href="/"]');
    const aboutLink = page.locator('a[href="/about/"]');
    
    // Home link should be active initially
    await expect(homeLink).toHaveClass(/active/);
    await expect(aboutLink).not.toHaveClass(/active/);
    
    // Navigate to About page using direct navigation (full page load)
    // Astro adds active class server-side based on current page
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // Re-query the locators after navigation since DOM has changed
    const aboutLinkAfterNav = page.locator('a[href="/about/"]');
    const homeLinkAfterNav = page.locator('.nav-link[href="/"]');
    
    // About link should now be active, home should not
    await expect(aboutLinkAfterNav).toHaveClass(/active/);
    await expect(homeLinkAfterNav).not.toHaveClass(/active/);
  });

  test('should only have one active navigation link at a time', async ({ page }) => {
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // Count nav links with active class in the main navigation
    const activeLinks = page.locator('.navbar a.active, nav a.active');
    await expect(activeLinks).toHaveCount(1);
    
    // Verify it's the correct link
    const activeLink = activeLinks.first();
    await expect(activeLink).toHaveAttribute('href', '/about/');
  });

  test('should handle path with or without trailing slash', async ({ page }) => {
    // Navigate to /about (without trailing slash)
    // Note: Astro's preview server returns 404 for non-trailing-slash URLs
    // Production server (GitHub Pages) handles redirects differently
    await page.goto('/about');
    await waitForPageReady(page);
    
    // Wait for potential redirect to trailing slash version
    await page.waitForURL(/\/about\/?/);
    
    // Should redirect to /about/ and highlight the about link
    const aboutLink = page.locator('a[href="/about/"]');
    const count = await aboutLink.count();
    if (count === 0) {
      // Skip if the preview server doesn't redirect (returns 404)
      test.skip();
      return;
    }
    await expect(aboutLink).toHaveClass(/active/);
  });
});
