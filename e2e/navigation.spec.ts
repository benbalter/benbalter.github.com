import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';
import { siteConfig } from '../src/config';

test.describe('Navigation Tagline', () => {
  // The tagline is revealed at Tailwind's lg breakpoint (1024px). Anything
  // narrower lacks room for it on one nav row, so it stays hidden there. These
  // use /about/ because the homepage drops it (see the last test).
  test('should show tagline at lg and wider', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/about/');
    await waitForPageReady(page);

    const tagline = page.locator('.navbar-text');
    await expect(tagline).toBeVisible();
    await expect(tagline).toContainText(siteConfig.description);
  });

  test('should keep the tagline on the same row as the nav links at lg', async ({ page }) => {
    // The tagline is whitespace-nowrap inside a flex-wrap row, so a string too
    // long for the row doesn't truncate: the whole right-hand group drops onto
    // a second line. Compare the row's height with the tagline hidden and shown.
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/about/');
    await waitForPageReady(page);

    const { withoutTagline, withTagline } = await page.evaluate(() => {
      const tagline = document.querySelector<HTMLElement>('.navbar-text')!;
      const row = document.querySelector<HTMLElement>('nav > div')!;
      const withTagline = row.offsetHeight;
      tagline.style.display = 'none';
      const withoutTagline = row.offsetHeight;
      tagline.style.display = '';
      return { withoutTagline, withTagline };
    });
    expect(withTagline).toBeLessThanOrEqual(withoutTagline + 4);
  });

  test('should hide tagline below lg where the nav row has no room', async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 768 });
    await page.goto('/about/');
    await waitForPageReady(page);

    const tagline = page.locator('.navbar-text');
    await expect(tagline).toBeHidden();
  });

  test('should hide tagline on mobile for cleaner UI', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/about/');
    await waitForPageReady(page);

    // Tagline is intentionally hidden on mobile to save space
    const tagline = page.locator('.navbar-text');
    await expect(tagline).toBeHidden();
  });

  test('should drop the tagline on the homepage, which opens with a fuller line', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await waitForPageReady(page);

    await expect(page.locator('.navbar-text')).toHaveCount(0);
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('main h1')).toContainText('showing your work');
  });
});

test.describe('Navigation Active Link Highlighting', () => {
  test('should highlight About link when on About page', async ({ page }) => {
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // Jekyll adds active class server-side based on current page
    const aboutLink = page.locator('nav .nav-link[href="/about/"]');
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
    // Use nav-link class to distinguish from navbar-brand which also links to /
    const homeLink = page.locator('nav .nav-link[href="/"]');
    await expect(homeLink).toHaveClass(/active/);
  });

  test('should update active class when navigating between pages', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    await waitForPageReady(page);
    
    // Use nav-link class to distinguish from navbar-brand which also links to /
    const homeLink = page.locator('nav .nav-link[href="/"]');
    const aboutLink = page.locator('nav .nav-link[href="/about/"]');
    
    // Home link should be active initially
    await expect(homeLink).toHaveClass(/active/);
    await expect(aboutLink).not.toHaveClass(/active/);
    
    // Navigate to About page using direct navigation (full page load)
    // Jekyll adds active class server-side based on current page
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // Re-query the locators after navigation since DOM has changed
    const aboutLinkAfterNav = page.locator('nav .nav-link[href="/about/"]');
    const homeLinkAfterNav = page.locator('nav .nav-link[href="/"]');
    
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
    // Cloudflare's asset layer redirects /about to /about/ (html_handling's
    // trailing-slash rule, not a _redirects entry). Needs the Worker server
    // (wrangler dev); astro preview never redirected, so this was a fixme.
    await page.goto('/about');
    await waitForPageReady(page);
    
    // After redirect, should be on /about/ with about link active
    expect(page.url()).toContain('/about/');
    
    // Should still highlight the about link
    const aboutLink = page.locator('nav .nav-link[href="/about/"]');
    await expect(aboutLink).toHaveClass(/active/);
  });
});
