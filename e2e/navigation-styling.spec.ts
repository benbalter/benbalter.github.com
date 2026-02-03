/**
 * E2E tests for navigation border and rounded corner styling
 * 
 * Tests verify that the navigation bar has correct border and rounded corner
 * styling on hero vs non-hero pages, both on initial page load and during
 * client-side navigation with Astro View Transitions.
 */

import { test, expect } from '@playwright/test';
import { waitForPageReady, isAstroBuild } from './helpers';

test.describe('Navigation Styling - Initial Page Load', () => {
  test('should have rounded top corners on non-hero pages', async ({ page }) => {
    // Navigate to About page (non-hero page)
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // Skip test if not Astro build
    if (!await isAstroBuild(page)) {
      test.skip();
      return;
    }
    
    const nav = page.locator('nav.navbar');
    
    // Check classes
    await expect(nav).toHaveClass(/rounded-top/);
    await expect(nav).toHaveClass(/rounded-bottom/);
    await expect(nav).toHaveClass(/border-top/);
    
    // Verify computed styles
    const borderRadius = await nav.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        topLeft: styles.borderTopLeftRadius,
        topRight: styles.borderTopRightRadius,
        bottomLeft: styles.borderBottomLeftRadius,
        bottomRight: styles.borderBottomRightRadius,
      };
    });
    
    // All corners should be rounded (6px or similar)
    expect(borderRadius.topLeft).not.toBe('0px');
    expect(borderRadius.topRight).not.toBe('0px');
    expect(borderRadius.bottomLeft).not.toBe('0px');
    expect(borderRadius.bottomRight).not.toBe('0px');
  });
  
  test('should NOT have rounded top corners on hero pages', async ({ page }) => {
    // Navigate to homepage (hero page)
    await page.goto('/');
    await waitForPageReady(page);
    
    // Skip test if not Astro build
    if (!await isAstroBuild(page)) {
      test.skip();
      return;
    }
    
    const nav = page.locator('nav.navbar');
    
    // Check classes - should have rounded-bottom but NOT rounded-top
    await expect(nav).toHaveClass(/rounded-bottom/);
    await expect(nav).not.toHaveClass(/rounded-top/);
    await expect(nav).not.toHaveClass(/border-top/);
    
    // Verify computed styles
    const borderRadius = await nav.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        topLeft: styles.borderTopLeftRadius,
        topRight: styles.borderTopRightRadius,
        bottomLeft: styles.borderBottomLeftRadius,
        bottomRight: styles.borderBottomRightRadius,
      };
    });
    
    // Top corners should be square (0px), bottom corners rounded
    expect(borderRadius.topLeft).toBe('0px');
    expect(borderRadius.topRight).toBe('0px');
    expect(borderRadius.bottomLeft).not.toBe('0px');
    expect(borderRadius.bottomRight).not.toBe('0px');
  });
  
  test('should have data-has-hero attribute matching page type', async ({ page }) => {
    // Check hero page
    await page.goto('/');
    await waitForPageReady(page);
    
    // Skip test if not Astro build
    if (!await isAstroBuild(page)) {
      test.skip();
      return;
    }
    
    let nav = page.locator('nav.navbar');
    await expect(nav).toHaveAttribute('data-has-hero', 'true');
    
    // Check non-hero page
    await page.goto('/about/');
    await waitForPageReady(page);
    
    nav = page.locator('nav.navbar');
    await expect(nav).toHaveAttribute('data-has-hero', 'false');
  });
});

test.describe('Navigation Styling - Client-Side Navigation', () => {
  test('should update styling when navigating from hero to non-hero page', async ({ page }) => {
    // Start on homepage (hero page)
    await page.goto('/');
    await waitForPageReady(page);
    
    // Skip test if not Astro build
    if (!await isAstroBuild(page)) {
      test.skip();
      return;
    }
    
    const nav = page.locator('nav.navbar');
    
    // Verify initial state (hero page)
    await expect(nav).toHaveClass(/rounded-bottom/);
    await expect(nav).not.toHaveClass(/rounded-top/);
    await expect(nav).not.toHaveClass(/border-top/);
    
    let borderRadius = await nav.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        topLeft: styles.borderTopLeftRadius,
        topRight: styles.borderTopRightRadius,
      };
    });
    
    expect(borderRadius.topLeft).toBe('0px');
    expect(borderRadius.topRight).toBe('0px');
    
    // Navigate to About page (non-hero) via client-side navigation
    const aboutLink = page.locator('a[href="/about/"]').first();
    await aboutLink.click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    // Verify styling updated (non-hero page)
    await expect(nav).toHaveClass(/rounded-top/);
    await expect(nav).toHaveClass(/rounded-bottom/);
    await expect(nav).toHaveClass(/border-top/);
    await expect(nav).toHaveAttribute('data-has-hero', 'false');
    
    borderRadius = await nav.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        topLeft: styles.borderTopLeftRadius,
        topRight: styles.borderTopRightRadius,
      };
    });
    
    // Top corners should now be rounded
    expect(borderRadius.topLeft).not.toBe('0px');
    expect(borderRadius.topRight).not.toBe('0px');
  });
  
  test('should update styling when navigating from non-hero to hero page', async ({ page }) => {
    // Start on About page (non-hero)
    await page.goto('/about/');
    await waitForPageReady(page);
    
    // Skip test if not Astro build
    if (!await isAstroBuild(page)) {
      test.skip();
      return;
    }
    
    const nav = page.locator('nav.navbar');
    
    // Verify initial state (non-hero page)
    await expect(nav).toHaveClass(/rounded-top/);
    await expect(nav).toHaveClass(/border-top/);
    
    let borderRadius = await nav.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        topLeft: styles.borderTopLeftRadius,
        topRight: styles.borderTopRightRadius,
      };
    });
    
    expect(borderRadius.topLeft).not.toBe('0px');
    expect(borderRadius.topRight).not.toBe('0px');
    
    // Navigate to homepage (hero) via client-side navigation
    const postsLink = page.locator('a[href="/"]').first();
    await postsLink.click();
    await page.waitForURL('/');
    await waitForPageReady(page);
    
    // Verify styling updated (hero page)
    await expect(nav).not.toHaveClass(/rounded-top/);
    await expect(nav).not.toHaveClass(/border-top/);
    await expect(nav).toHaveClass(/rounded-bottom/);
    await expect(nav).toHaveAttribute('data-has-hero', 'true');
    
    borderRadius = await nav.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        topLeft: styles.borderTopLeftRadius,
        topRight: styles.borderTopRightRadius,
      };
    });
    
    // Top corners should now be square
    expect(borderRadius.topLeft).toBe('0px');
    expect(borderRadius.topRight).toBe('0px');
  });
  
  test('should maintain styling through multiple page navigations', async ({ page }) => {
    // Skip test if not Astro build
    await page.goto('/');
    await waitForPageReady(page);
    
    if (!await isAstroBuild(page)) {
      test.skip();
      return;
    }
    
    const nav = page.locator('nav.navbar');
    
    // Hero page
    await expect(nav).not.toHaveClass(/rounded-top/);
    
    // Navigate to About (non-hero)
    await page.locator('a[href="/about/"]').first().click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    await expect(nav).toHaveClass(/rounded-top/);
    
    // Navigate to Contact (non-hero)
    await page.locator('a[href="/contact/"]').first().click();
    await page.waitForURL('**/contact/');
    await waitForPageReady(page);
    await expect(nav).toHaveClass(/rounded-top/);
    
    // Navigate back to hero page
    await page.locator('a[href="/"]').first().click();
    await page.waitForURL('/');
    await waitForPageReady(page);
    await expect(nav).not.toHaveClass(/rounded-top/);
  });
  
  test('should handle browser back/forward navigation correctly', async ({ page }) => {
    // Skip test if not Astro build
    await page.goto('/');
    await waitForPageReady(page);
    
    if (!await isAstroBuild(page)) {
      test.skip();
      return;
    }
    
    const nav = page.locator('nav.navbar');
    
    // Start on hero page
    await expect(nav).not.toHaveClass(/rounded-top/);
    
    // Navigate to About page
    await page.locator('a[href="/about/"]').first().click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    await expect(nav).toHaveClass(/rounded-top/);
    
    // Go back to hero page
    await page.goBack();
    await page.waitForURL('/');
    await waitForPageReady(page);
    await expect(nav).not.toHaveClass(/rounded-top/);
    
    // Go forward to About page again
    await page.goForward();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    await expect(nav).toHaveClass(/rounded-top/);
  });
});

test.describe('Navigation Styling - Edge Cases', () => {
  test('should work correctly on blog post pages (non-hero)', async ({ page }) => {
    // Navigate to a blog post (non-hero page)
    // Use a well-known post that should exist
    await page.goto('/2015/11/23/why-open-source/');
    await waitForPageReady(page);
    
    // Skip test if not Astro build or post doesn't exist
    if (!await isAstroBuild(page)) {
      test.skip();
      return;
    }
    
    const nav = page.locator('nav.navbar');
    
    // Blog posts don't have hero images, so should have rounded top
    await expect(nav).toHaveClass(/rounded-top/);
    await expect(nav).toHaveClass(/border-top/);
  });
  
  test('should not have visual glitches during transition', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Skip test if not Astro build
    if (!await isAstroBuild(page)) {
      test.skip();
      return;
    }
    
    const nav = page.locator('nav.navbar');
    
    // Take initial measurement
    const initialBox = await nav.boundingBox();
    expect(initialBox).toBeTruthy();
    
    // Navigate to another page
    await page.locator('a[href="/about/"]').first().click();
    await page.waitForURL('**/about/');
    
    // Wait a moment for any transitions
    await page.waitForTimeout(100);
    await waitForPageReady(page);
    
    // Navigation should still be visible and properly positioned
    await expect(nav).toBeVisible();
    const finalBox = await nav.boundingBox();
    expect(finalBox).toBeTruthy();
    
    // Navigation position should be stable (allowing for small differences)
    if (initialBox && finalBox) {
      expect(Math.abs(finalBox.y - initialBox.y)).toBeLessThan(5);
    }
  });
});
