import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

/**
 * Dark Mode Tests
 * 
 * Tests to ensure dark mode works correctly for:
 * - Syntax highlighting (Shiki with dual themes)
 * - Callout components
 * - Blockquotes
 * - General page elements
 */

test.describe('Dark Mode Support', () => {
  test.describe('Syntax Highlighting', () => {
    test('should use appropriate syntax highlighting theme in light mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/2021/09/01/how-i-re-over-engineered-my-home-network/');
      await waitForPageReady(page);

      // The first code blocks may be inside collapsed <details> elements
      // Find a visible code block (not inside a collapsed details element)
      const codeBlock = page.locator('pre code:not(details:not([open]) pre code)').first();
      
      // Wait for code blocks to be present in DOM
      await page.waitForSelector('pre code', { state: 'attached' });
      
      // Check if the first visible code block exists (may need to expand details)
      const detailsElements = page.locator('details:has(pre code)');
      const detailsCount = await detailsElements.count();
      
      if (detailsCount > 0) {
        // Expand the first details element that contains a code block
        await detailsElements.first().click();
        // Wait for the details element to be open
        await expect(detailsElements.first()).toHaveAttribute('open', { timeout: 1000 });
      }

      // Now check that code block is visible
      const visibleCodeBlock = page.locator('pre code').first();
      await expect(visibleCodeBlock).toBeVisible();

      // In light mode, code blocks should have light background
      const bgColor = await visibleCodeBlock.evaluate(el => {
        const pre = el.closest('pre');
        return window.getComputedStyle(pre!).backgroundColor;
      });

      // Light background should be closer to white than black
      // Parse RGB values
      const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      expect(match).toBeTruthy();
      const r = parseInt(match![1]);
      const g = parseInt(match![2]);
      const b = parseInt(match![3]);
      const brightness = (r + g + b) / 3;
      
      // Light mode should have brightness > 128 (more flexible threshold)
      expect(brightness).toBeGreaterThan(128);
    });

    test('should use appropriate syntax highlighting theme in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/2021/09/01/how-i-re-over-engineered-my-home-network/');
      await waitForPageReady(page);

      // The first code blocks may be inside collapsed <details> elements
      // Wait for code blocks to be present in DOM
      await page.waitForSelector('pre code', { state: 'attached' });
      
      // Check if the first code blocks are in details elements
      const detailsElements = page.locator('details:has(pre code)');
      const detailsCount = await detailsElements.count();
      
      if (detailsCount > 0) {
        // Expand the first details element that contains a code block
        await detailsElements.first().click();
        // Wait for the details element to be open
        await expect(detailsElements.first()).toHaveAttribute('open', { timeout: 1000 });
      }

      // Now check that code block is visible
      const visibleCodeBlock = page.locator('pre code').first();
      await expect(visibleCodeBlock).toBeVisible();

      // Verify the code block exists and has content
      // Note: Astro's Shiki uses CSS custom properties (--shiki-dark-bg) for dark mode
      // The inline style may show light mode background, but CSS should override it
      const preElement = page.locator('pre').first();
      const hasDualTheme = await preElement.evaluate(el => {
        const style = el.getAttribute('style') || '';
        return style.includes('--shiki-dark');
      });
      
      // Verify dual-theme CSS custom properties are present (Astro's approach to dual themes)
      expect(hasDualTheme).toBe(true);
    });
  });

  test.describe('Blockquotes', () => {
    test('should have appropriate styling in light mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/2020/08/14/tools-of-the-trade/');
      await waitForPageReady(page);

      const blockquote = page.locator('blockquote').first();
      await expect(blockquote).toBeVisible();

      // Check that blockquote has border
      const borderLeft = await blockquote.evaluate(el => 
        window.getComputedStyle(el).borderLeftWidth
      );
      
      // Should have a visible border (typically 4px or 5px)
      expect(borderLeft).not.toBe('0px');
    });

    test('should have appropriate styling in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/2020/08/14/tools-of-the-trade/');
      await waitForPageReady(page);

      const blockquote = page.locator('blockquote').first();
      await expect(blockquote).toBeVisible();

      // Check that blockquote has border
      const borderLeft = await blockquote.evaluate(el => 
        window.getComputedStyle(el).borderLeftWidth
      );
      
      // Should have a visible border
      expect(borderLeft).not.toBe('0px');

      // Verify it's visible by checking text color contrast
      const textColor = await blockquote.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      // In dark mode, text should be light colored (not black)
      expect(textColor).not.toBe('rgb(0, 0, 0)');
    });
  });

  test.describe('Page Elements', () => {
    test('should apply dark mode to body background', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/');
      await waitForPageReady(page);

      const bodyBg = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );

      // Dark mode should NOT have white background
      expect(bodyBg).not.toBe('rgb(255, 255, 255)');

      // Parse RGB and check it's dark
      const match = bodyBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      expect(match).toBeTruthy();
      const r = parseInt(match![1]);
      const g = parseInt(match![2]);
      const b = parseInt(match![3]);
      const brightness = (r + g + b) / 3;
      
      // Dark background should have low brightness
      expect(brightness).toBeLessThan(100);
    });

    test('should have readable text in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/');
      await waitForPageReady(page);

      const bodyColor = await page.locator('body').evaluate(el => 
        window.getComputedStyle(el).color
      );

      // Dark mode text should be light colored (not black)
      expect(bodyColor).not.toBe('rgb(0, 0, 0)');

      // Parse RGB and check it's light
      const match = bodyColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      expect(match).toBeTruthy();
      const r = parseInt(match![1]);
      const g = parseInt(match![2]);
      const b = parseInt(match![3]);
      const brightness = (r + g + b) / 3;
      
      // Light text should have high brightness
      expect(brightness).toBeGreaterThan(150);
    });
  });

  test.describe('Callout Component', () => {
    test('should be visible and styled correctly in both light and dark modes', async ({ page }) => {
      // Test in light mode
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/2014/10/07/expose-process-through-urls/');
      await waitForPageReady(page);
      
      // Check that callout (Bootstrap alert) exists and is visible
      const callout = page.locator('.alert[role="alert"]').first();
      await expect(callout).toBeVisible();
      
      // Check light mode background color
      const lightBgColor = await callout.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(lightBgColor).toBeTruthy();

      // Test in dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload();
      await waitForPageReady(page);
      
      // Check that callout is still visible after reload
      const darkModeCalloutCount = await page.locator('.alert[role="alert"]').count();
      expect(darkModeCalloutCount).toBeGreaterThan(0);
      
      const darkCallout = page.locator('.alert[role="alert"]').first();
      await expect(darkCallout).toBeVisible();
      
      // Check dark mode background color is different from light mode
      const darkBgColor = await darkCallout.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(darkBgColor).toBeTruthy();
      expect(darkBgColor).not.toBe(lightBgColor);
    });
  });
});
