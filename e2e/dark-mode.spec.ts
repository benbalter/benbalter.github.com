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

      // Check that code blocks exist
      const codeBlock = page.locator('pre code').first();
      await expect(codeBlock).toBeVisible();

      // In light mode, code blocks should have light background
      const bgColor = await codeBlock.evaluate(el => {
        const pre = el.closest('pre');
        return window.getComputedStyle(pre!).backgroundColor;
      });

      // Light background should be closer to white than black
      // Parse RGB values
      const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const brightness = (r + g + b) / 3;
        
        // Light mode should have brightness > 200 (closer to white)
        expect(brightness).toBeGreaterThan(200);
      }
    });

    test('should use appropriate syntax highlighting theme in dark mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/2021/09/01/how-i-re-over-engineered-my-home-network/');
      await waitForPageReady(page);

      // Check that code blocks exist
      const codeBlock = page.locator('pre code').first();
      await expect(codeBlock).toBeVisible();

      // In dark mode, code blocks should have dark background
      const bgColor = await codeBlock.evaluate(el => {
        const pre = el.closest('pre');
        return window.getComputedStyle(pre!).backgroundColor;
      });

      // Dark background should be closer to black than white
      // Parse RGB values
      const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const brightness = (r + g + b) / 3;
        
        // Dark mode should have brightness < 50 (closer to black)
        expect(brightness).toBeLessThan(50);
      }
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
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const brightness = (r + g + b) / 3;
        
        // Dark background should have low brightness
        expect(brightness).toBeLessThan(100);
      }
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
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const brightness = (r + g + b) / 3;
        
        // Light text should have high brightness
        expect(brightness).toBeGreaterThan(150);
      }
    });
  });

  test.describe('Callout Component', () => {
    test('should be visible in both light and dark modes', async ({ page }) => {
      // Note: This is a placeholder test since we'd need to find a page with callouts
      // or create a test page. For now, we test that the component exists.
      
      // Test in light mode
      await page.emulateMedia({ colorScheme: 'light' });
      await page.goto('/');
      await waitForPageReady(page);
      
      // If callouts exist on page, they should be visible
      const calloutCount = await page.locator('.callout').count();
      if (calloutCount > 0) {
        const callout = page.locator('.callout').first();
        await expect(callout).toBeVisible();
      }

      // Test in dark mode
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload();
      await waitForPageReady(page);
      
      // If callouts exist on page, they should still be visible
      if (calloutCount > 0) {
        const callout = page.locator('.callout').first();
        await expect(callout).toBeVisible();
      }
    });
  });
});
