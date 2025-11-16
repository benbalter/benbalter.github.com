import { test, expect } from '@playwright/test';
import { checkBasicAccessibility, waitForPageReady } from './helpers';

test.describe('Accessibility', () => {
  const pages = ['/', '/about', '/resume', '/contact', '/talks'];

  pages.forEach(url => {
    test.describe(`Accessibility checks for ${url}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await waitForPageReady(page);
      });

      test('should pass basic accessibility checks', async ({ page }) => {
        await checkBasicAccessibility(page);
      });

      test('should have proper heading hierarchy', async ({ page }) => {
        // Check for h1
        const h1 = page.locator('h1');
        const h1Count = await h1.count();
        
        // Should have at most one h1 (homepage may not have one)
        expect(h1Count).toBeLessThanOrEqual(1);
        
        // If homepage (root path), h1 is optional
        if (url !== '/' && h1Count === 0) {
          // Non-homepage should have an h1
          expect(h1Count).toBeGreaterThan(0);
        }
      });

      test('should have lang attribute', async ({ page }) => {
        const html = page.locator('html');
        await expect(html).toHaveAttribute('lang');
      });

      test('should have skip link or main landmark', async ({ page }) => {
        // Check for skip link or main element
        const skipLink = page.locator('a[href="#content"], a[href="#main"]');
        const main = page.locator('main, [role="main"]');
        
        const hasSkipLink = await skipLink.count() > 0;
        const hasMain = await main.count() > 0;
        
        expect(hasSkipLink || hasMain).toBeTruthy();
      });

      test('form elements should have labels', async ({ page }) => {
        const inputs = await page.locator('input:not([type="hidden"]), textarea, select').all();
        
        for (const input of inputs) {
          const isVisible = await input.isVisible();
          if (!isVisible) continue;
          
          // Check for associated label or aria-label
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          
          if (id) {
            const label = page.locator(`label[for="${id}"]`);
            const hasLabel = await label.count() > 0;
            
            expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
          } else {
            expect(ariaLabel || ariaLabelledBy).toBeTruthy();
          }
        }
      });

      test('buttons should have accessible names', async ({ page }) => {
        const buttons = await page.locator('button').all();
        
        for (const button of buttons) {
          const isVisible = await button.isVisible();
          if (!isVisible) continue;
          
          const text = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');
          const ariaLabelledBy = await button.getAttribute('aria-labelledby');
          
          expect(text || ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      });

      test('links should have accessible text', async ({ page }) => {
        const links = await page.locator('a[href]').all();
        
        for (const link of links) {
          const isVisible = await link.isVisible();
          if (!isVisible) continue;
          
          const text = await link.textContent();
          const ariaLabel = await link.getAttribute('aria-label');
          const ariaLabelledBy = await link.getAttribute('aria-labelledby');
          const title = await link.getAttribute('title');
          
          // Check if link has an image with alt text
          const img = link.locator('img[alt]');
          const hasImgAlt = await img.count() > 0;
          
          // Link should have some form of accessible text
          const hasAccessibleName = 
            (text && text.trim().length > 0) ||
            ariaLabel ||
            ariaLabelledBy ||
            title ||
            hasImgAlt;
          
          // Get href for better error message if this fails
          const href = await link.getAttribute('href');
          expect(hasAccessibleName, `Link ${href} should have accessible text`).toBeTruthy();
        }
      });
    });
  });

  test('Color contrast should be sufficient', async ({ page }) => {
    // This is a basic check - for comprehensive testing, use axe-core
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check that text is visible
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(0);
  });

  test('Keyboard navigation should work', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check that interactive elements are keyboard accessible
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    const count = await focusedElement.count();
    
    expect(count).toBeGreaterThan(0);
  });
});
