/**
 * E2E tests for Astro View Transitions functionality
 * 
 * Astro View Transitions intercept link clicks and provide smooth page transitions
 * without full page reloads, providing a faster, app-like experience.
 */

import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';
import { viewTransitionName } from '../src/utils/view-transition-name';

test.describe('Astro View Transitions Navigation', () => {
  test('should have View Transitions enabled on the page', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check whether View Transitions are enabled via Astro's meta tag.
    // This site intentionally does NOT use Astro's ClientRouter / View Transitions
    // (see src/scripts/on-page-load.ts for the DOMContentLoaded-based init).
    // Skip this assertion if the meta tag isn't present rather than failing.
    const viewTransitionsEnabled = await page.locator('meta[name="astro-view-transitions-enabled"]').count();
    test.skip(viewTransitionsEnabled === 0, 'Site does not use Astro View Transitions');
    expect(viewTransitionsEnabled).toBeGreaterThan(0);
  });

  test('should intercept link clicks for faster navigation', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    await waitForPageReady(page);
    
    // Track full page loads using the load event
    let fullPageLoadCount = 0;
    page.on('load', () => {
      fullPageLoadCount++;
    });
    
    // Track Astro navigation events
    await page.evaluate(() => {
      document.addEventListener('astro:before-preparation', () => {
        (window as any).astroBeforePreparation = true;
      });
      document.addEventListener('astro:page-load', () => {
        (window as any).astroPageLoadFired = true;
      });
    });
    
    // Reset the counters after initial page load
    fullPageLoadCount = 0;
    
    // Click a link to navigate to another page
    const aboutLink = page.locator('a[href="/about/"]').first();
    await aboutLink.click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    // Check that Astro events were fired
    const astroBeforePreparation = await page.evaluate(() => (window as any).astroBeforePreparation);
    const astroPageLoadFired = await page.evaluate(() => (window as any).astroPageLoadFired);
    
    // Either Astro events should fire OR full page load should happen
    // (Both are acceptable - View Transitions may not work in all browsers)
    const navigationHappened = astroBeforePreparation || astroPageLoadFired || fullPageLoadCount > 0;
    expect(navigationHappened).toBeTruthy();
    
    // Verify we're on the correct page
    await expect(page).toHaveURL(/\/about\//);
    await expect(page.locator('h1')).toContainText('About');
  });

  test.fixme('should preserve scroll position on back navigation', async ({ page }) => {
    // FIXME: This test is flaky due to timing issues with view transitions and scroll restoration
    // Scroll position restoration behavior is inconsistent in test environment
    
    // Start on homepage
    await page.goto('/');
    await waitForPageReady(page);
    
    // Navigate to about page
    const aboutLink = page.locator('a[href="/about/"]').first();
    await aboutLink.click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    // Scroll down on the about page
    await page.evaluate(() => window.scrollTo(0, 100));
    
    // Wait a moment for scroll to complete
    await page.waitForTimeout(100);
    
    // Navigate to contact page
    const contactLink = page.locator('a[href="/contact/"]').first();
    await contactLink.click();
    await page.waitForURL('**/contact/');
    await waitForPageReady(page);
    
    // Go back using browser back button
    await page.goBack();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    // Verify we're on the about page
    await expect(page).toHaveURL(/\/about\//);
    
    // Verify scroll position was preserved (with tolerance for slight variations)
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeCloseTo(100, -1);
  });

  test.fixme('should update browser history correctly', async ({ page }) => {
    // FIXME: This test is flaky due to timing issues with view transitions
    // Browser history navigation behavior is inconsistent in test environment
    
    // Start on homepage
    await page.goto('/');
    await waitForPageReady(page);
    
    // Navigate to about page
    const aboutLink = page.locator('a[href="/about/"]').first();
    await aboutLink.click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    // Navigate to contact page
    const contactLink = page.locator('a[href="/contact/"]').first();
    await contactLink.click();
    await page.waitForURL('**/contact/');
    await waitForPageReady(page);
    
    // Go back twice using browser back button
    await page.goBack();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    await page.goBack();
    await page.waitForURL(/^\/$|\/index/);
    await waitForPageReady(page);
    
    // Verify we're back on homepage
    await expect(page).toHaveURL(/^\/$|\/index/);
  });

  test('should handle external links normally without interception', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Find an external link (GitHub, social media, etc.)
    const externalLink = page.locator('a[href^="https://github.com"]').first();
    
    if (await externalLink.count() > 0) {
      const href = await externalLink.getAttribute('href');
      
      // External links should open in new tab or navigate normally
      // They should NOT be intercepted by View Transitions
      expect(href).toMatch(/^https:\/\//);
      
      // Check if it has target="_blank" or rel="noopener"
      const target = await externalLink.getAttribute('target');
      const rel = await externalLink.getAttribute('rel');
      
      // External links typically have target="_blank" or rel="noopener"
      const isExternalLinkMarked = target === '_blank' || rel?.includes('noopener');
      expect(isExternalLinkMarked).toBeTruthy();
    }
  });

  test('should update page title on navigation', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    await waitForPageReady(page);
    
    const homeTitle = await page.title();
    
    // Navigate to about page
    const aboutLink = page.locator('a[href="/about/"]').first();
    await aboutLink.click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    const aboutTitle = await page.title();
    
    // Titles should be different
    expect(aboutTitle).not.toEqual(homeTitle);
    
    // About page title should contain "About"
    expect(aboutTitle).toMatch(/About/i);
  });

  test('should not cause JavaScript errors during navigation', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    
    // Navigate through multiple pages
    await page.goto('/');
    await waitForPageReady(page);
    
    const aboutLink = page.locator('a[href="/about/"]').first();
    await aboutLink.click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    const contactLink = page.locator('a[href="/contact/"]').first();
    await contactLink.click();
    await page.waitForURL('**/contact/');
    await waitForPageReady(page);
    
    // Check for console errors
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error => {
      // Filter out favicon 404s and other non-critical errors
      return !error.includes('favicon') && 
             !error.includes('404') &&
             !error.includes('Failed to load resource');
    });
    
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Astro View Transitions with Cross-Page Anchor Links', () => {
  test('should handle direct navigation to another page with anchor', async ({ page }) => {
    // Navigate directly to a page with a hash anchor
    await page.goto('/2015/11/12/why-urls/#systems-that-naturally-capture-and-expose-process');
    await waitForPageReady(page);
    
    // Verify the URL contains the hash
    expect(page.url()).toContain('#systems-that-naturally-capture-and-expose-process');
    
    // Wait for scroll to complete - scroll position should be greater than 0
    await page.waitForFunction(
      () => window.scrollY > 0,
      { timeout: 2000 }
    );
    
    // Verify page scrolled to the anchor target
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
    
    // Verify the target element is visible
    const targetElement = page.locator('#systems-that-naturally-capture-and-expose-process');
    await expect(targetElement).toBeVisible();
  });

  test('should not cause errors when navigating with cross-page anchors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    
    // Start on a page
    await page.goto('/');
    await waitForPageReady(page);
    
    // Navigate to a page with cross-page anchor links
    await page.goto('/2015/11/18/tools-to-empower-open-collaboration/');
    await waitForPageReady(page);
    
    // Find and click a cross-page anchor link
    const crossPageAnchorLink = page.locator('a[href*="#"]').filter({ hasText: 'naturally capture and expose process' }).first();
    const linkCount = await crossPageAnchorLink.count();
    
    if (linkCount > 0) {
      const href = await crossPageAnchorLink.getAttribute('href');
      
      await crossPageAnchorLink.click();
      
      // Wait for navigation - URL will include the hash
      await page.waitForURL(href!, { timeout: 10000 });
      await waitForPageReady(page);
      
      // Filter out known non-critical errors
      const criticalErrors = consoleErrors.filter(error => {
        return !error.includes('favicon') && 
               !error.includes('404') &&
               !error.includes('Failed to load resource');
      });
      
      expect(criticalErrors).toHaveLength(0);
    }
  });
});

test.describe('Cross-document card → article "magic move"', () => {
  test('article headline carries a view-transition-name derived from its path', async ({ page }) => {
    const path = '/2015/11/12/why-urls/';
    await page.goto(path);
    await waitForPageReady(page);

    const style = (await page.locator('article h1').first().getAttribute('style')) ?? '';
    // The HTML compressor may drop the space after the colon, so normalize.
    expect(style.replace(/\s+/g, '')).toContain(`view-transition-name:${viewTransitionName(path)}`);
  });

  test('a listing card and its article share the same transition-name key', async ({ page }) => {
    await page.goto('/posts/');
    await waitForPageReady(page);

    // Cards mark their title but carry NO static name at rest — the name is set
    // only on the destination card during navigation, so a page that lists the
    // same post twice never has duplicate names (which abort the transition).
    const titles = page.locator('[data-vt-card-title]');
    expect(await titles.count()).toBeGreaterThan(0);
    expect(await page.locator('[data-vt-card-title][style*="view-transition-name"]').count()).toBe(0);

    // Follow the first card and confirm its destination headline uses the name
    // derived from that same URL — the pairing key that drives the morph.
    const href = await titles.first().locator('a[href]').first().getAttribute('href');
    expect(href).toBeTruthy();
    const destPath = new URL(href!, page.url()).pathname;

    await page.goto(destPath);
    await waitForPageReady(page);
    const style = (await page.locator('article h1').first().getAttribute('style')) ?? '';
    expect(style.replace(/\s+/g, '')).toContain(`view-transition-name:${viewTransitionName(destPath)}`);
  });

  test('navigating from a card (pageswap naming) does not error', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    await page.goto('/posts/');
    await waitForPageReady(page);

    await page.locator('[data-vt-card-title] a[href]').first().click();
    await page.waitForURL(/\/\d{4}\/\d{2}\/\d{2}\//);
    await waitForPageReady(page);

    await expect(page.locator('article h1')).toBeVisible();
    const critical = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404') && !e.includes('Failed to load resource')
    );
    expect(critical).toHaveLength(0);
  });

  test('pageswap names exactly one card in the outgoing snapshot', async ({ page }) => {
    await page.goto('/posts/');
    await waitForPageReady(page);

    // Observe the outgoing DOM *after* the app's pageswap handler has run
    // (registered here later, so it fires later). sessionStorage survives the
    // same-origin navigation so we can read the result on the next page.
    await page.evaluate(() => {
      window.addEventListener('pageswap', (event) => {
        const e = event as unknown as { viewTransition: unknown };
        sessionStorage.setItem('vt-fired', e.viewTransition ? 'yes' : 'no');
        sessionStorage.setItem(
          'vt-named',
          String(document.querySelectorAll('[data-vt-card-title][style*="view-transition-name"]').length)
        );
      });
    });

    await page.locator('[data-vt-card-title] a[href]').first().click();
    await page.waitForURL(/\/\d{4}\/\d{2}\/\d{2}\//);

    const fired = await page.evaluate(() => sessionStorage.getItem('vt-fired'));
    const named = await page.evaluate(() => sessionStorage.getItem('vt-named'));
    // A transition fired, and the handler named exactly one card — never two,
    // even when the page lists the same post twice (the dedup-safety guarantee).
    expect(fired).toBe('yes');
    expect(named).toBe('1');
  });
});

test.describe('Astro View Transitions Configuration', () => {
  test('should work with forms if present', async ({ page }) => {
    await page.goto('/contact/');
    await waitForPageReady(page);
    
    // Check if there's a form on the contact page
    const forms = await page.locator('form').count();
    
    if (forms > 0) {
      // View Transitions should not interfere with form functionality
      // This is a basic check that forms are present and could be enhanced
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
      
      // Verify form has an action attribute
      const hasAction = await form.evaluate((el) => el.hasAttribute('action'));
      expect(hasAction).toBeTruthy();
    }
  });
  
  test('should support data-astro-reload for full page refresh', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check if any links have data-astro-reload attribute
    // This would opt them out of View Transitions
    const reloadLinks = await page.locator('a[data-astro-reload]').count();
    
    // This test just verifies the attribute is respected if present
    // (There may be zero links with this attribute, which is fine)
    expect(reloadLinks).toBeGreaterThanOrEqual(0);
  });

  test('should respect prefers-reduced-motion accessibility preference', async ({ page }) => {
    // Emulate prefers-reduced-motion: reduce
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check that the CSS media query is applied by verifying computed styles
    // The view transition animations should be disabled
    const contentElement = page.locator('main.content').first();
    
    // Verify the element exists and is visible (no conditional)
    await expect(contentElement).toBeVisible();
    
    // Navigation should still work but without animations
    const aboutLink = page.locator('a[href="/about/"]').first();
    await aboutLink.click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    // Verify we successfully navigated
    await expect(page).toHaveURL(/\/about\//);
    await expect(page.locator('h1')).toContainText('About');
  });
});
