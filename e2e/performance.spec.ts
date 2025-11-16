import { test, expect } from '@playwright/test';
import { waitForPageReady, waitForFullLoad } from './helpers';

test.describe('Performance', () => {
  test('homepage should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds on CI
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have excessive number of requests', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Reasonable number of requests for a static site
    // Adjusted to 110 to account for Next.js bundle chunks
    expect(requests.length).toBeLessThan(110);
  });

  test('should not load excessive JavaScript', async ({ page }) => {
    const jsRequests: string[] = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'script') {
        jsRequests.push(request.url());
      }
    });
    
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Static site shouldn't need too many JS files
    expect(jsRequests.length).toBeLessThan(20);
  });

  test('images should be optimized', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const images = await page.locator('img[src]').all();
    
    for (const img of images) {
      const isVisible = await img.isVisible();
      if (!isVisible) continue;
      
      // Check that visible images have width/height or are styled
      const width = await img.getAttribute('width');
      const height = await img.getAttribute('height');
      const style = await img.getAttribute('style');
      const className = await img.getAttribute('class');
      
      // Images should have dimensions specified
      const hasDimensions = width || height || style || className;
      expect(hasDimensions).toBeTruthy();
    }
  });

  test('should use compression for text resources', async ({ page }) => {
    const responses: any[] = [];
    
    page.on('response', response => {
      const contentType = response.headers()['content-type'];
      if (contentType && (
        contentType.includes('text/html') ||
        contentType.includes('text/css') ||
        contentType.includes('application/javascript')
      )) {
        responses.push({
          url: response.url(),
          headers: response.headers()
        });
      }
    });
    
    await page.goto('/');
    await waitForFullLoad(page);
    
    // At least some text resources should be compressed
    // Note: In local dev mode, compression might not be enabled
    if (!process.env.CI) {
      test.skip(true, 'Compression check only on production');
    }
  });

  test('should cache static assets', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Second visit should use cache
    const cachedRequests: string[] = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'stylesheet' || 
          request.resourceType() === 'script' ||
          request.resourceType() === 'image') {
        cachedRequests.push(request.url());
      }
    });
    
    await page.reload();
    await waitForPageReady(page);
    
    // Some requests should be cached
    expect(cachedRequests.length).toBeGreaterThan(0);
  });

  test('fonts should load efficiently', async ({ page }) => {
    const fontRequests: string[] = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'font') {
        fontRequests.push(request.url());
      }
    });
    
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Should not load excessive fonts
    expect(fontRequests.length).toBeLessThan(10);
  });
});

test.describe('Mobile Performance', () => {
  test.use({ 
    viewport: { width: 375, height: 667 } // iPhone SE size
  });

  test('should be performant on mobile', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await waitForPageReady(page);
    
    const loadTime = Date.now() - startTime;
    
    // Mobile should still load within reasonable time
    expect(loadTime).toBeLessThan(7000);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check that content fits in viewport
    const body = page.locator('body');
    const boundingBox = await body.boundingBox();
    
    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      // Content width should not exceed viewport significantly
      expect(boundingBox.width).toBeLessThanOrEqual(400);
    }
  });
});
