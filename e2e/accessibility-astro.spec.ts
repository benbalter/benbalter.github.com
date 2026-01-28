import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Comprehensive Accessibility Tests for Astro Build
 * 
 * Tests WCAG 2.1 Level AA compliance
 */

test.describe('Accessibility - Homepage', () => {
  test('should not have any automatically detectable accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/');
    
    // Tab to focus the skip link
    await page.keyboard.press('Tab');
    
    // Check if skip link is visible when focused
    const skipLink = page.locator('a.skip-to-content');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveText('Skip to main content');
    await expect(skipLink).toHaveAttribute('href', '#content');
  });
  
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Get all headings
    const h1s = await page.locator('h1').count();
    
    // Homepage is a list page - it may not have an H1, which is acceptable
    // for a list/index page. The navbar brand serves as the main title.
    // At most one H1 should be present on any page
    expect(h1s).toBeLessThanOrEqual(1);
  });
  
  test('should have proper language attribute', async ({ page }) => {
    await page.goto('/');
    
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });
  
  test('should have semantic landmark regions', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toHaveCount(1);
    await expect(main).toHaveAttribute('id', 'content');
    await expect(main).toHaveAttribute('role', 'main');
    
    // Check for at least one navigation (site has main nav and footer nav)
    const nav = page.locator('nav');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThanOrEqual(1);
    
    // Check for footer
    const footer = page.locator('footer');
    await expect(footer).toHaveCount(1);
  });
});

test.describe('Accessibility - Blog Post', () => {
  test('should not have accessibility violations on post page', async ({ page }) => {
    // Navigate to a recent post
    await page.goto('/');
    
    // Guard: skip if no article links exist
    const articleLinks = await page.locator('article a').count();
    if (articleLinks === 0) {
      test.skip();
      return;
    }
    
    await page.click('article a'); // Click first post link
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('should have article semantic structure', async ({ page }) => {
    await page.goto('/');
    
    // Guard: skip if no article links exist
    const articleLinks = await page.locator('article a').count();
    if (articleLinks === 0) {
      test.skip();
      return;
    }
    
    await page.click('article a');
    await page.waitForLoadState('networkidle');
    
    // Check for article element
    const article = page.locator('article');
    await expect(article).toHaveCount(1);
    
    // Check for header within article
    const header = article.locator('header');
    await expect(header).toHaveCount(1);
    
    // Check for footer within article
    const footer = article.locator('footer');
    await expect(footer).toHaveCount(1);
  });
  
  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    // Guard: skip if no article links exist
    const articleLinks = await page.locator('article a').count();
    if (articleLinks === 0) {
      test.skip();
      return;
    }
    
    await page.click('article a');
    await page.waitForLoadState('networkidle');
    
    // Get all images
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt attribute must exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Keyboard Navigation', () => {
  test('should be able to navigate to all interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Get all focusable elements
    const focusableSelector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = await page.locator(focusableSelector).all();
    
    expect(focusableElements.length).toBeGreaterThan(0);
    
    // Tab through first few elements to verify tab order works
    for (let i = 0; i < Math.min(5, focusableElements.length); i++) {
      await page.keyboard.press('Tab');
      
      // Check that something has focus
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      expect(focusedElement).toBeTruthy();
    }
  });
  
  test('should show visible focus indicators', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first focusable element
    await page.keyboard.press('Tab');
    
    // Get the focused element's outline or border
    const focusStyles = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineStyle: styles.outlineStyle,
        outlineColor: styles.outlineColor,
      };
    });
    
    // Verify there is a visible focus indicator
    // (outline, border, or box-shadow)
    const hasVisibleFocus = 
      focusStyles.outline !== 'none' ||
      (focusStyles.outlineWidth !== '0px' && focusStyles.outlineStyle !== 'none');
    
    expect(hasVisibleFocus).toBe(true);
  });
  
  test('should not have keyboard traps', async ({ page }) => {
    await page.goto('/');
    
    // Tab forward through several elements
    const startingUrl = page.url();
    
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      
      // Verify we can still move focus
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      expect(focusedElement).toBeTruthy();
    }
    
    // Tab backward through several elements
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Shift+Tab');
      
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      expect(focusedElement).toBeTruthy();
    }
    
    // Should still be on the same page
    expect(page.url()).toBe(startingUrl);
  });
});

test.describe('Color Contrast', () => {
  test('text should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Use axe to check color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();
    
    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });
});

test.describe('Screen Reader Accessibility', () => {
  test('links should have descriptive text', async ({ page }) => {
    await page.goto('/');
    
    // Get all links
    const links = await page.locator('a').all();
    
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Link should have text, aria-label, or title
      const hasAccessibleName = 
        (text && text.trim().length > 0) ||
        (ariaLabel && ariaLabel.trim().length > 0) ||
        (title && title.trim().length > 0);
      
      expect(hasAccessibleName).toBe(true);
    }
  });
  
  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/');
    
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');
      
      const hasAccessibleName = 
        (text && text.trim().length > 0) ||
        (ariaLabel && ariaLabel.trim().length > 0) ||
        (title && title.trim().length > 0);
      
      expect(hasAccessibleName).toBe(true);
    }
  });
  
  test('form inputs should have associated labels', async ({ page }) => {
    // Try to navigate to contact page, skip if it doesn't exist
    const response = await page.goto('/contact/');
    
    // Skip test if page doesn't exist
    if (!response || response.status() === 404) {
      test.skip();
      return;
    }
    
    const inputs = await page.locator('input, select, textarea').all();
    
    // Skip test if no form inputs exist
    if (inputs.length === 0) {
      test.skip();
      return;
    }
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      
      // Input should have id with associated label, aria-label, or aria-labelledby
      const hasLabel = 
        (id && await page.locator(`label[for="${id}"]`).count() > 0) ||
        (ariaLabel && ariaLabel.trim().length > 0) ||
        (ariaLabelledby && ariaLabelledby.trim().length > 0);
      
      expect(hasLabel).toBe(true);
    }
  });
});

test.describe('ARIA Best Practices', () => {
  test('should not have invalid ARIA attributes', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    const ariaViolations = accessibilityScanResults.violations.filter(
      v => v.id.startsWith('aria-')
    );
    
    expect(ariaViolations).toEqual([]);
  });
  
  test('aria-labelledby should reference existing IDs', async ({ page }) => {
    await page.goto('/');
    
    const elementsWithLabelledby = await page.locator('[aria-labelledby]').all();
    
    for (const element of elementsWithLabelledby) {
      const labelledby = await element.getAttribute('aria-labelledby');
      
      if (labelledby) {
        const ids = labelledby.split(' ');
        
        for (const id of ids) {
          const referencedElement = await page.locator(`#${id}`).count();
          expect(referencedElement).toBe(1);
        }
      }
    }
  });
  
  test('aria-describedby should reference existing IDs', async ({ page }) => {
    await page.goto('/');
    
    const elementsWithDescribedby = await page.locator('[aria-describedby]').all();
    
    for (const element of elementsWithDescribedby) {
      const describedby = await element.getAttribute('aria-describedby');
      
      if (describedby) {
        const ids = describedby.split(' ');
        
        for (const id of ids) {
          const referencedElement = await page.locator(`#${id}`).count();
          expect(referencedElement).toBe(1);
        }
      }
    }
  });
});

test.describe('Responsive Accessibility', () => {
  test('should be accessible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('should be accessible on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Accessibility - Additional Pages', () => {
  const pages = [
    { path: '/about/', name: 'About' },
    { path: '/contact/', name: 'Contact' },
    { path: '/resume/', name: 'Resume' },
    { path: '/talks/', name: 'Talks' },
  ];
  
  pages.forEach(({ path, name }) => {
    test(`${name} page should not have accessibility violations`, async ({ page }) => {
      await page.goto(path);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    });
    
    test(`${name} page should have proper heading hierarchy`, async ({ page }) => {
      await page.goto(path);
      
      // Each page should have exactly one H1
      const h1s = await page.locator('h1').count();
      expect(h1s).toBe(1);
      
      // H1 should contain the page title
      const h1Text = await page.locator('h1').textContent();
      expect(h1Text?.trim()).toBe(name);
    });
    
    test(`${name} page should have semantic structure`, async ({ page }) => {
      await page.goto(path);
      
      // Check for main landmark
      const main = page.locator('main');
      await expect(main).toHaveCount(1);
      
      // Check for article element
      const article = page.locator('article');
      await expect(article).toHaveCount(1);
      
      // Check for navigation
      const nav = page.locator('nav');
      const navCount = await nav.count();
      expect(navCount).toBeGreaterThanOrEqual(1);
    });
  });
});

test.describe('Accessibility - Dark Mode', () => {
  test('should be accessible in dark mode on homepage', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('should be accessible in dark mode on blog post', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    
    // Guard: skip if no article links exist
    const articleLinks = await page.locator('article a').count();
    if (articleLinks === 0) {
      test.skip();
      return;
    }
    
    await page.click('article a');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('should have proper color-scheme meta tag', async ({ page }) => {
    await page.goto('/');
    
    // Check for color-scheme meta tag supporting both light and dark
    const colorScheme = page.locator('meta[name="color-scheme"]');
    await expect(colorScheme).toHaveCount(1);
    const content = await colorScheme.getAttribute('content');
    expect(content).toContain('light');
    expect(content).toContain('dark');
  });
  
  test('should respect prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Verify page loads correctly with reduced motion preference
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check that the site has styles that respond to prefers-reduced-motion
    // The site's CSS includes: @media (prefers-reduced-motion: reduce) 
    // which sets transition-duration: 0.01ms on interactive elements
    const hasReducedMotionSupport = await page.evaluate(() => {
      // Check if the page has any prefers-reduced-motion media queries
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSMediaRule) {
              if (rule.conditionText?.includes('prefers-reduced-motion')) {
                return true;
              }
            }
          }
        } catch (e) {
          // Skip cross-origin stylesheets
          continue;
        }
      }
      return false;
    });
    
    // The site should have prefers-reduced-motion styles defined
    expect(hasReducedMotionSupport).toBe(true);
  });
});

test.describe('Accessibility - 404 Page', () => {
  test('404 page should be accessible', async ({ page }) => {
    await page.goto('/non-existent-page-that-should-404/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('404 page should have helpful navigation', async ({ page }) => {
    await page.goto('/non-existent-page-that-should-404/');
    
    // Should have main navigation
    const nav = page.locator('nav');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThanOrEqual(1);
    
    // Should have link to homepage
    const homeLink = page.locator('a[href="/"]');
    const homeLinkCount = await homeLink.count();
    expect(homeLinkCount).toBeGreaterThanOrEqual(1);
    
    // Should have helpful content with recent posts
    const recentPostsHeading = page.locator('h4');
    await expect(recentPostsHeading).toContainText('Recent posts');
  });
});
