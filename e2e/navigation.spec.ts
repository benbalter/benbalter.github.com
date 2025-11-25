import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

test.describe('Navigation Active Link Highlighting', () => {
  test('should highlight About link when on About page', async ({ page }) => {
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // The active class is applied client-side via script
    const aboutLink = page.locator('a[data-nav-path="/about/"]');
    await expect(aboutLink).toHaveClass(/active/);
  });

  test('should highlight Contact link when on Contact page', async ({ page }) => {
    await page.goto('/contact/');
    await waitForPageReady(page);
    
    const contactLink = page.locator('a[data-nav-path="/contact/"]');
    await expect(contactLink).toHaveClass(/active/);
  });

  test('should highlight Posts link when on homepage', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Root path (/) should highlight the home/posts link
    const homeLink = page.locator('a[data-nav-path="/"]');
    await expect(homeLink).toHaveClass(/active/);
  });

  test('should update active class when navigating between pages', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    await waitForPageReady(page);
    
    const homeLink = page.locator('a[data-nav-path="/"]');
    const aboutLink = page.locator('a[data-nav-path="/about/"]');
    
    // Home link should be active initially
    await expect(homeLink).toHaveClass(/active/);
    await expect(aboutLink).not.toHaveClass(/active/);
    
    // Navigate to About page using direct navigation (full page load)
    // This tests that the script correctly runs on each page load
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // Re-query the locators after navigation since DOM has changed
    const aboutLinkAfterNav = page.locator('a[data-nav-path="/about/"]');
    const homeLinkAfterNav = page.locator('a[data-nav-path="/"]');
    
    // About link should now be active, home should not
    await expect(aboutLinkAfterNav).toHaveClass(/active/);
    await expect(homeLinkAfterNav).not.toHaveClass(/active/);
  });

  test('should only have one active navigation link at a time', async ({ page }) => {
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // Count nav links with active class
    const activeLinks = page.locator('[data-nav-path].active');
    await expect(activeLinks).toHaveCount(1);
    
    // Verify it's the correct link
    const activeLink = activeLinks.first();
    await expect(activeLink).toHaveAttribute('data-nav-path', '/about/');
  });

  test('should handle path with or without trailing slash', async ({ page }) => {
    // Navigate to /about (without trailing slash)
    await page.goto('/about');
    await waitForPageReady(page);
    
    // Should still highlight the about link
    const aboutLink = page.locator('a[data-nav-path="/about/"]');
    await expect(aboutLink).toHaveClass(/active/);
  });
});
