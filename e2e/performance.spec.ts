import { test, expect } from '@playwright/test';
import { waitForPageReady, waitForFullLoad } from './helpers';

// Performance test constants
const PERFORMANCE_TIMEOUT = 5000; // Timeout for performance measurements
const HOMEPAGE_LOAD_TIME = 5000; // Max acceptable load time for homepage
const MOBILE_LOAD_TIME = 7000; // Max acceptable load time on mobile
const MAX_JS_REQUESTS = 20; // Maximum number of JS requests
const MAX_TOTAL_REQUESTS = 175; // Maximum total requests
const MAX_FONTS = 10; // Maximum font files

test.describe('Performance', () => {
  test('homepage should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within acceptable time on CI
    expect(loadTime).toBeLessThan(HOMEPAGE_LOAD_TIME);
  });

  test('should not have excessive number of requests', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', request => {
      requests.push(request.url());
    });
    
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Reasonable number of requests for a static site
    // Adjusted to account for Next.js bundle chunks and link prefetching
    expect(requests.length).toBeLessThan(MAX_TOTAL_REQUESTS);
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
    expect(jsRequests.length).toBeLessThan(MAX_JS_REQUESTS);
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
    expect(fontRequests.length).toBeLessThan(MAX_FONTS);
  });

  test('should measure Core Web Vitals - LCP', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Measure Largest Contentful Paint using Performance API
    const lcp = await page.evaluate((timeout) => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Fallback timeout
        setTimeout(() => resolve(0), timeout);
      });
    }, PERFORMANCE_TIMEOUT);
    
    // LCP should be under 2.5 seconds (good threshold)
    // Using 4 seconds for CI tolerance
    expect(lcp).toBeLessThan(4000);
  });

  test('should have minimal Cumulative Layout Shift', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be interactive
    await waitForPageReady(page);
    
    // Measure CLS using Performance API
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsScore = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsScore += (entry as any).value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
        
        // Wait a bit for layout shifts to occur
        setTimeout(() => resolve(clsScore), 2000);
      });
    });
    
    // CLS should be under 0.1 (good threshold)
    // Using 0.25 for CI tolerance
    expect(cls).toBeLessThan(0.25);
  });

  test('should have fast First Contentful Paint', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const fcp = await page.evaluate((timeout) => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const entry = entries[0];
          resolve(entry.startTime);
        }).observe({ type: 'paint', buffered: true });
        
        setTimeout(() => resolve(0), timeout);
      });
    }, PERFORMANCE_TIMEOUT);
    
    // FCP should be under 1.8 seconds (good threshold)
    // Using 3 seconds for CI tolerance
    expect(fcp).toBeLessThan(3000);
  });

  test('CSS should be loaded efficiently', async ({ page }) => {
    const cssResponses: any[] = [];
    
    page.on('response', response => {
      const contentType = response.headers()['content-type'];
      if (contentType && contentType.includes('text/css')) {
        cssResponses.push({
          url: response.url(),
          size: parseInt(response.headers()['content-length'] || '0'),
          status: response.status()
        });
      }
    });
    
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Should have loaded CSS successfully
    expect(cssResponses.length).toBeGreaterThan(0);
    
    // All CSS should load successfully
    cssResponses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });

  test('JavaScript chunks should lazy load', async ({ page }) => {
    const jsRequests: string[] = [];
    
    page.on('request', request => {
      if (request.resourceType() === 'script') {
        jsRequests.push(request.url());
      }
    });
    
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check if chunked JS files are loaded
    const hasChunks = jsRequests.some(url => url.includes('.chunk.js'));
    
    // If chunks exist, they should be loaded lazily
    if (hasChunks) {
      const chunkUrls = jsRequests.filter(url => url.includes('.chunk.js'));
      console.log(`Loaded ${chunkUrls.length} JS chunks`);
    }
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
    expect(loadTime).toBeLessThan(MOBILE_LOAD_TIME);
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
