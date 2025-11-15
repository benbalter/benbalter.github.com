/**
 * Next.js Site E2E Tests
 * 
 * Tests the Next.js site functionality when running with Next.js dev server
 * or serving the static export.
 */

import { test, expect } from '@playwright/test';
import { 
  waitForFullLoad 
} from './helpers';

test.describe('Next.js Site - Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveURL('/');
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Ben Balter/);
  });

  test('should have main heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toContainText('Ben Balter');
  });

  test('should have tagline', async ({ page }) => {
    // Check for tagline text
    const body = page.locator('body');
    const text = await body.textContent();
    expect(text).toContain('Technology');
  });

  test('should display recent posts section', async ({ page }) => {
    const heading = page.locator('h2:has-text("Recent Posts")');
    await expect(heading).toBeVisible();
  });

  test('should have blog post links', async ({ page }) => {
    const postLinks = page.locator('a[href*="/20"]'); // Blog posts have year in URL
    const count = await postLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have responsive meta tags', async ({ page }) => {
    const viewport = page.locator('meta[name="viewport"]');
    // Next.js may add viewport tags, check for at least one
    const count = await viewport.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should have language attribute', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('should have charset meta tag', async ({ page }) => {
    const charset = page.locator('meta[charset]');
    // Check for at least one charset tag
    const count = await charset.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Next.js Site - Navigation', () => {
  test('should navigate to blog post', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Get first blog post link href
    const postLink = page.locator('a[href*="/20"]').first();
    const href = await postLink.getAttribute('href');
    
    // Navigate to the blog post
    await page.goto(href!);
    await waitForFullLoad(page);
    
    // Should have loaded successfully with content
    const body = page.locator('body');
    const text = await body.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(100);
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Navigate to about page
    await page.goto('/about/');
    await waitForFullLoad(page);
    
    // Should be on about page
    await expect(page).toHaveURL('/about/');
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/contact/');
    await waitForFullLoad(page);
    
    // Should be on contact page
    await expect(page).toHaveURL('/contact/');
  });

  test('should handle 404 page', async ({ page }) => {
    await page.goto('/non-existent-page/');
    await waitForFullLoad(page);
    
    // Should show 404 page
    const heading = page.locator('h1, h2');
    await expect(heading.first()).toBeVisible();
  });
});

test.describe('Next.js Site - Blog Posts', () => {
  test('should display blog post content', async ({ page }) => {
    // Navigate to a known blog post
    await page.goto('/2024/01/08/dissenting-voices/');
    await waitForFullLoad(page);
    
    // Should have content
    const body = page.locator('body');
    const text = await body.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(100);
  });

  test('should have post metadata', async ({ page }) => {
    await page.goto('/2024/01/08/dissenting-voices/');
    await waitForFullLoad(page);
    
    // Should have some metadata or content
    const html = await page.content();
    expect(html).toContain('dissenting');
  });
});

test.describe('Next.js Site - Static Pages', () => {
  const staticPages = [
    { path: '/about/', title: 'About' },
    { path: '/contact/', title: 'Contact' },
    { path: '/fine-print/', title: 'Fine Print' },
  ];

  for (const { path: pagePath, title } of staticPages) {
    test(`should load ${title} page`, async ({ page }) => {
      await page.goto(pagePath);
      await waitForFullLoad(page);
      
      await expect(page).toHaveURL(pagePath);
      
      // Should have some content
      const body = page.locator('body');
      await expect(body).toBeVisible();
      const text = await body.textContent();
      expect(text).toBeTruthy();
    });
  }
});

test.describe('Next.js Site - Performance', () => {
  test('should load homepage quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await waitForFullLoad(page);
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (10 seconds)
    expect(loadTime).toBeLessThan(10000);
  });

  test('should not have JavaScript errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', message => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Should not have console errors
    expect(errors).toHaveLength(0);
  });
});

test.describe('Next.js Site - Accessibility', () => {
  test('should have semantic HTML on homepage', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Check for semantic HTML elements
    const main = page.locator('main');
    await expect(main).toHaveCount(1);
  });

  test('should have accessible links', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    // All links should have text or aria-label
    const links = await page.locator('a').all();
    
    for (const link of links) {
      const isVisible = await link.isVisible();
      if (isVisible) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        
        // Link should have text or aria-label
        expect(text || ariaLabel).toBeTruthy();
      }
    }
  });
});

test.describe('Next.js Site - SEO', () => {
  test('should have meta description on homepage', async ({ page }) => {
    await page.goto('/');
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
    
    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(10);
  });

  test('should have viewport meta tag', async ({ page }) => {
    await page.goto('/');
    
    const viewport = page.locator('meta[name="viewport"]');
    // Check for at least one viewport tag
    const count = await viewport.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
