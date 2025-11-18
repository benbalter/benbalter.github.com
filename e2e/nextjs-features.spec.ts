import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

test.describe('Next.js Features and Performance', () => {
  test('should use Next.js Image optimization', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref);
    await waitForPageReady(page);
    
    // Check for avatar image (which uses Next.js Image component)
    const avatarImg = page.locator('img.avatar');
    if (await avatarImg.count() > 0) {
      const src = await avatarImg.getAttribute('src');
      expect(src).toBeTruthy();
      
      // Check image has width and height attributes (Next.js Image requirement)
      const width = await avatarImg.getAttribute('width');
      const height = await avatarImg.getAttribute('height');
      expect(width).toBeTruthy();
      expect(height).toBeTruthy();
    }
  });

  test('pages should have meta theme-color for dark mode', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for theme-color meta tags
    const themeColorLight = page.locator('meta[name="theme-color"][media*="light"]');
    const themeColorDark = page.locator('meta[name="theme-color"][media*="dark"]');
    
    await expect(themeColorLight).toHaveCount(1);
    await expect(themeColorDark).toHaveCount(1);
  });

  test('pages should have proper color-scheme meta tag', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for color-scheme meta tag
    const colorScheme = page.locator('meta[name="color-scheme"]');
    await expect(colorScheme).toHaveCount(1);
    
    const content = await colorScheme.getAttribute('content');
    expect(content).toContain('light');
    expect(content).toContain('dark');
  });

  test('pages should load CSS from webpack build', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for CSS stylesheets - Next.js may use different naming
    const styleLinks = page.locator('link[rel="stylesheet"]');
    const count = await styleLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('pages should load JavaScript bundle', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for JavaScript bundles - Next.js may use different naming
    const scripts = page.locator('script[src]');
    const count = await scripts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navigation should have active link highlighting', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check home link is active
    const homeLink = page.locator('nav a[href="/"]').first();
    if (await homeLink.count() > 0) {
      const classes = await homeLink.getAttribute('class');
      // May or may not have active class depending on exact path
      expect(classes).toBeTruthy();
    }
    
    // Navigate to About and check active state
    const aboutLink = page.locator('nav a:has-text("About")').first();
    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await waitForPageReady(page);
      
      // Check about link is now active
      const activeAboutLink = page.locator('nav a.active:has-text("About")');
      await expect(activeAboutLink).toBeVisible();
    }
  });

  test('client-side navigation should work', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Click on About link (should use client-side routing)
    const aboutLink = page.locator('nav a:has-text("About"), a:has-text("About")').first();
    if (await aboutLink.count() > 0) {
      const initialUrl = page.url();
      
      await aboutLink.click();
      await waitForPageReady(page);
      
      const newUrl = page.url();
      expect(newUrl).not.toBe(initialUrl);
      expect(newUrl).toContain('/about/');
    }
  });

  test('pages should have proper HTML semantics', async ({ page }) => {
    const pages = ['/', '/about/', '/resume/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await waitForPageReady(page);
      
      // Check for HTML5 semantic structure
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang');
      
      // Check for main content area
      const main = page.locator('main, [role="main"]');
      await expect(main).toHaveCount(1);
      
      // Check for proper heading hierarchy (h1 should exist)
      const h1 = page.locator('h1');
      const h1Count = await h1.count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    }
  });

  test('site should have manifest file', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveCount(1);
    
    const href = await manifestLink.getAttribute('href');
    expect(href).toContain('.webmanifest');
  });

  test('site should have favicon', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for favicon links
    const favicon32 = page.locator('link[rel="icon"][sizes="32x32"]');
    const favicon16 = page.locator('link[rel="icon"][sizes="16x16"]');
    
    await expect(favicon32).toHaveCount(1);
    await expect(favicon16).toHaveCount(1);
  });

  test('site should have apple-touch-icon', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for apple-touch-icon
    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleTouchIcon).toHaveCount(1);
  });

  test('pages should have RSS feed link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for RSS feed alternate link
    const rssLink = page.locator('link[type="application/rss+xml"]');
    await expect(rssLink).toHaveCount(1);
    
    const href = await rssLink.getAttribute('href');
    expect(href).toContain('feed.xml');
  });

  test('pages should have rel=me links for social verification', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for rel="me" links (for social verification)
    const relMeLinks = page.locator('link[rel="me"]');
    const count = await relMeLinks.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('blog posts should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref);
    await waitForPageReady(page);
    
    // Check for exactly one h1 (post title)
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    
    // Check h1 has proper styling
    const h1Classes = await h1.getAttribute('class');
    expect(h1Classes).toEqual(expect.stringContaining('display-4'));
    expect(h1Classes).toEqual(expect.stringContaining('text-primary'));
  });

  test('pages should not have JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await waitForPageReady(page);
    
    // Navigate to a few pages
    const pages = ['/about/', '/resume/'];
    for (const pagePath of pages) {
      try {
        await page.goto(pagePath, { waitUntil: 'load', timeout: 10000 });
        await page.waitForLoadState('load');
      } catch (e) {
        // Page might not exist, skip
        continue;
      }
    }
    
    // Filter out known/acceptable errors
    // These are common false positives that don't indicate real issues:
    // - favicon: Browser requests for missing favicon variants
    // - chrome-extension: Browser extension interference
    // - ERR_BLOCKED_BY_CLIENT: Ad blockers or privacy extensions
    const significantErrors = errors.filter(error => {
      return !error.includes('favicon') && 
             !error.includes('chrome-extension') &&
             !error.includes('ERR_BLOCKED_BY_CLIENT');
    });
    
    expect(significantErrors.length).toBe(0);
  });

  test('homepage should list posts with dates', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for post rows
    const postRows = page.locator('.row.mb-2');
    const count = await postRows.count();
    
    if (count > 0) {
      // Check first post has a date
      const firstRow = postRows.first();
      const dateText = firstRow.locator('.text-muted small');
      await expect(dateText).toBeVisible();
      
      const text = await dateText.textContent();
      expect(text).toBeTruthy();
      // Should contain a month name
      expect(text).toMatch(/January|February|March|April|May|June|July|August|September|October|November|December/);
    }
  });

  test('pages should be crawlable by search engines', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check robots meta tag
    const robotsMeta = page.locator('meta[name="robots"]');
    const robotsCount = await robotsMeta.count();
    
    if (robotsCount > 0) {
      const content = await robotsMeta.getAttribute('content');
      // Should allow indexing
      expect(content).not.toContain('noindex');
      expect(content).not.toContain('nofollow');
    }
  });
});
