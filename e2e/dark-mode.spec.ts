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
      // Use a post with code blocks that are NOT inside collapsed <details> elements
      await page.goto('/2014/03/13/pages-anchor-links/');
      await waitForPageReady(page);

      // Check that code blocks exist
      const codeBlock = page.locator('pre code').first();
      await expect(codeBlock).toBeVisible();

      // Verify the code block is configured for dual themes (Astro 6 uses class-based theming)
      const pre = page.locator('pre.astro-code').first();
      await expect(pre).toBeVisible();
      
      // In Astro 6, dual theme code blocks have the astro-code-themes class
      // and both theme names as classes
      const hasThemeSetup = await pre.evaluate(el => {
        const classes = el.className;
        return classes.includes('github-light') && classes.includes('github-dark');
      });
      expect(hasThemeSetup).toBe(true);
    });

    test('should use appropriate syntax highlighting theme in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      // Use a post with code blocks that are NOT inside collapsed <details> elements
      await page.goto('/2014/03/13/pages-anchor-links/');
      await waitForPageReady(page);

      // Check that code blocks exist
      const codeBlock = page.locator('pre code').first();
      await expect(codeBlock).toBeVisible();

      // Verify the code block is configured for dual themes
      // In Astro 6, dual theme support is indicated by the astro-code-themes class
      // and both theme names (github-light, github-dark) as CSS classes on the pre element
      const hasDualThemeSetup = await codeBlock.evaluate(el => {
        const pre = el.closest('pre');
        if (!pre) return false;
        const classes = pre.className;
        return classes.includes('astro-code-themes') && 
               classes.includes('github-dark');
      });
      
      // The code block should be configured for dual theme support
      expect(hasDualThemeSetup).toBe(true);
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
      
      // Check that callout (aside element with role="note") exists and is visible
      const callout = page.locator('aside[role="note"]').first();
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
      const darkModeCalloutCount = await page.locator('aside[role="note"]').count();
      expect(darkModeCalloutCount).toBeGreaterThan(0);
      
      const darkCallout = page.locator('aside[role="note"]').first();
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
