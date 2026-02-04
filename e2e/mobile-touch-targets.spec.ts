import { test, expect, devices } from '@playwright/test';

/**
 * Mobile touch target tests
 * Validates that interactive elements meet WCAG 2.1 Level AA minimum touch target size (44x44px)
 */
test.describe('Mobile Touch Targets', () => {
  test('navigation links should have minimum 44px touch targets', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check navigation links
    const navLinks = await page.locator('.nav-link').all();
    
    for (const link of navLinks) {
      const box = await link.boundingBox();
      if (box) {
        // WCAG 2.1 Level AA requires 44x44px minimum
        expect(box.height).toBeGreaterThanOrEqual(44);
        console.log(`Nav link height: ${box.height}px`);
      }
    }
    
    await context.close();
  });

  test('navigation hamburger should have minimum 44px touch target', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggler = page.locator('.navbar-toggler');
    await expect(toggler).toBeVisible();
    
    const box = await toggler.boundingBox();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
      console.log(`Hamburger menu: ${box.width}x${box.height}px`);
    }
    
    await context.close();
  });

  test('footer social links should have minimum 44px touch targets', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const socialLinks = await page.locator('footer .social-link').all();
    
    for (const link of socialLinks) {
      const box = await link.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
        console.log(`Social link: ${box.width}x${box.height}px`);
      }
    }
    
    await context.close();
  });

  test('buttons should have minimum 44px touch targets', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/contact/');
    await page.waitForLoadState('networkidle');

    const buttons = await page.locator('.btn').all();
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        console.log(`Button height: ${box.height}px`);
      }
    }
    
    await context.close();
  });

  test('interactive elements should have touch-action: manipulation', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check nav links
    const navLink = page.locator('.nav-link').first();
    const navTouchAction = await navLink.evaluate((el) => {
      return window.getComputedStyle(el).touchAction;
    });
    expect(navTouchAction).toBe('manipulation');

    // Check buttons
    const button = page.locator('.btn').first();
    if (await button.count() > 0) {
      const btnTouchAction = await button.evaluate((el) => {
        return window.getComputedStyle(el).touchAction;
      });
      expect(btnTouchAction).toBe('manipulation');
    }
    
    await context.close();
  });

  test('navigation should provide visual feedback when open', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggler = page.locator('.navbar-toggler');
    
    // Initially closed
    await expect(toggler).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    await toggler.click();
    await expect(toggler).toHaveAttribute('aria-expanded', 'true');
    
    // Should have visual feedback (background color change)
    const bgColor = await toggler.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // Should have some background color (not transparent)
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    
    await context.close();
  });

  test('hero unit should be smaller on mobile', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('.hero-unit');
    
    if (await hero.count() > 0) {
      const box = await hero.boundingBox();
      if (box) {
        // Should be 250px on mobile (not 400px)
        expect(box.height).toBeLessThanOrEqual(260); // Allow small tolerance
        expect(box.height).toBeGreaterThanOrEqual(240);
        console.log(`Hero height on mobile: ${box.height}px`);
      }
    }
    
    await context.close();
  });

  test('links should have thicker underlines on mobile', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to a post
    const postLink = page.locator('article a').first();
    await postLink.click();
    await page.waitForLoadState('networkidle');

    // Check content link styling
    const contentLink = page.locator('article a:not(.anchor-link)').first();
    
    if (await contentLink.count() > 0) {
      const textDecorationThickness = await contentLink.evaluate((el) => {
        return window.getComputedStyle(el).textDecorationThickness;
      });
      
      // Should have thicker underline on mobile (0.1em)
      console.log(`Link underline thickness: ${textDecorationThickness}`);
      // Value should be set (not auto)
      expect(textDecorationThickness).not.toBe('auto');
    }
    
    await context.close();
  });

  test('anchor links should be visible on mobile', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to a post with headings
    const postLink = page.locator('article a').first();
    await postLink.click();
    await page.waitForLoadState('networkidle');

    const anchorLink = page.locator('.anchor-link').first();
    
    if (await anchorLink.count() > 0) {
      // Should have some opacity (not completely hidden)
      const opacity = await anchorLink.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });
      
      // Should be visible with reduced opacity (0.6)
      expect(parseFloat(opacity)).toBeGreaterThan(0);
      console.log(`Anchor link opacity on mobile: ${opacity}`);
    }
    
    await context.close();
  });
});

test.describe('Mobile Touch Feedback', () => {
  test('buttons should have active state styling', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/contact/');
    await page.waitForLoadState('networkidle');

    const button = page.locator('.btn').first();
    
    if (await button.count() > 0) {
      // Get initial state
      const initialTransform = await button.evaluate((el) => {
        return window.getComputedStyle(el).transform;
      });
      
      // Simulate press (active state would apply during actual press)
      // We can't easily test :active pseudo-class, but we can verify it's defined in CSS
      const hasTransition = await button.evaluate((el) => {
        return window.getComputedStyle(el).transition.includes('transform');
      });
      
      expect(hasTransition).toBeTruthy();
    }
    
    await context.close();
  });

  test('social links should have active state styling', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['iPhone 12'] });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const socialLink = page.locator('footer .social-link').first();
    
    const hasTransition = await socialLink.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    
    // Should have transition defined
    expect(hasTransition).not.toBe('all 0s ease 0s');
    
    await context.close();
  });
});

test.describe('Mobile Responsive Design', () => {
  test('should be responsive at iPhone 12 viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that content is visible and doesn't overflow
    const body = page.locator('body');
    const bodyWidth = await body.evaluate((el) => el.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 0;
    
    // Content should not cause horizontal scroll
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Small tolerance
  });

  test('should be responsive at smaller viewport (iPhone SE)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigation should be collapsed
    const navCollapse = page.locator('.navbar-collapse');
    await expect(navCollapse).toHaveClass(/collapse/);
  });
});
