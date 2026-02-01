import { test, expect, devices } from '@playwright/test';
import { waitForPageReady, isAstroBuild } from './helpers';

test.describe('TLDR Tooltip - iOS after View Transitions', () => {
  test('should work on iOS Safari after View Transitions navigation', async ({ browser }) => {
    // Create a context with iPhone viewport and user agent
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();
    
    const astro = await isAstroBuild(page);
    
    if (astro) {
      // Start on homepage
      await page.goto('/');
      await waitForPageReady(page);
      
      // Navigate to a post with TLDR using a link (this triggers View Transitions)
      const linkSelector = 'a[href*="/2015/12/08/types-of-pull-requests/"]';
      const linkExists = await page.locator(linkSelector).count();
      console.log(`Link exists on homepage: ${linkExists > 0}`);
      
      if (linkExists > 0) {
        await page.click(linkSelector);
      } else {
        // Try to navigate to a different post that may be on homepage
        const anyPostLink = page.locator('a[href*="/20"]').first();
        if (await anyPostLink.count() > 0) {
          await anyPostLink.click();
        }
      }
      
      await page.waitForURL('**/20**');
      await waitForPageReady(page);
      
      // Wait a moment for Astro View Transitions to complete
      await page.waitForTimeout(500);
      
      // Check if TLDR element exists on this page
      const tldrElement = page.locator('.lead strong abbr.initialism');
      const tldrExists = await tldrElement.count();
      console.log(`TLDR element exists: ${tldrExists > 0}`);
      
      if (tldrExists > 0) {
        await expect(tldrElement).toBeVisible();
        await expect(tldrElement).toHaveText('TL;DR');
        
        // Verify the element has the data-tooltip attribute
        await expect(tldrElement).toHaveAttribute('data-tooltip', 'true');
        
        // Check if it's been initialized after navigation
        const isInitialized = await tldrElement.getAttribute('data-tooltip-initialized');
        console.log(`Tooltip initialized: ${isInitialized}`);
        
        // Tap the element to show tooltip (iOS touch interaction)
        await tldrElement.tap();
        
        // Wait for tooltip to appear
        const tooltip = page.locator('.custom-tooltip.show');
        await expect(tooltip).toBeVisible({ timeout: 2000 });
        await expect(tooltip).toContainText('Too Long');
        
        // Tap again to hide
        await tldrElement.tap();
        
        // Tooltip should be gone
        await expect(tooltip).not.toBeAttached({ timeout: 1000 });
      }
    }
    
    await context.close();
  });
  
  test('should work on iPad Safari after View Transitions navigation', async ({ browser }) => {
    // Create a context with iPad viewport
    const context = await browser.newContext({
      ...devices['iPad Pro 11'],
    });
    const page = await context.newPage();
    
    const astro = await isAstroBuild(page);
    
    if (astro) {
      // Start on homepage
      await page.goto('/');
      await waitForPageReady(page);
      
      // Navigate to a post with TLDR using a link (this triggers View Transitions)
      const linkSelector = 'a[href*="/2015/12/08/types-of-pull-requests/"]';
      const linkExists = await page.locator(linkSelector).count();
      console.log(`Link exists on homepage: ${linkExists > 0}`);
      
      if (linkExists > 0) {
        await page.click(linkSelector);
      } else {
        // Try to navigate to a different post that may be on homepage
        const anyPostLink = page.locator('a[href*="/20"]').first();
        if (await anyPostLink.count() > 0) {
          await anyPostLink.click();
        }
      }
      
      await page.waitForURL('**/20**');
      await waitForPageReady(page);
      
      // Wait a moment for Astro View Transitions to complete
      await page.waitForTimeout(500);
      
      // Check if TLDR element exists on this page
      const tldrElement = page.locator('.lead strong abbr.initialism');
      const tldrExists = await tldrElement.count();
      console.log(`TLDR element exists: ${tldrExists > 0}`);
      
      if (tldrExists > 0) {
        await expect(tldrElement).toBeVisible();
        
        // Tap the element to show tooltip (iPad touch interaction)
        await tldrElement.tap();
        
        // Wait for tooltip to appear
        const tooltip = page.locator('.custom-tooltip.show');
        await expect(tooltip).toBeVisible({ timeout: 2000 });
        await expect(tooltip).toContainText('Too Long');
      }
    }
    
    await context.close();
  });
});
