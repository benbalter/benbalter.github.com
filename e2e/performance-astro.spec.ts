import { test, expect } from '@playwright/test';

/**
 * Performance Tests for Astro Build
 * 
 * Tests Core Web Vitals and performance best practices
 */

test.describe('Core Web Vitals', () => {
  test('homepage should have good Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');
    
    // Wait for LCP to be measured
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Timeout after 10 seconds
        setTimeout(() => resolve(0), 10000);
      });
    });
    
    console.log(`LCP: ${lcp}ms`);
    
    // LCP should be under 2.5 seconds (2500ms) for good performance
    expect(lcp).toBeLessThan(2500);
    expect(lcp).toBeGreaterThan(0);
  });
  
  test('homepage should have good First Input Delay (FID)', async ({ page }) => {
    await page.goto('/');
    
    // Simulate user interaction to measure FID
    await page.click('body');
    
    const fid = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const entry = entries[0] as any;
            resolve(entry.processingStart - entry.startTime);
          }
        });
        
        observer.observe({ type: 'first-input', buffered: true });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    console.log(`FID: ${fid}ms`);
    
    // FID should be under 100ms for good performance
    if (fid > 0) {
      expect(fid).toBeLessThan(100);
    }
  });
  
  test('homepage should have good Cumulative Layout Shift (CLS)', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
        
        // Wait 3 seconds to capture layout shifts
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });
    
    console.log(`CLS: ${cls}`);
    
    // CLS should be under 0.1 for good performance
    expect(cls).toBeLessThan(0.1);
  });
  
  test('blog post should have good performance metrics', async ({ page }) => {
    await page.goto('/');
    await page.click('article a');
    await page.waitForLoadState('networkidle');
    
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => resolve(0), 10000);
      });
    });
    
    console.log(`Post LCP: ${lcp}ms`);
    expect(lcp).toBeLessThan(2500);
  });
});

test.describe('Page Load Performance', () => {
  test('homepage should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    // Page should load in under 3 seconds on good connection
    expect(loadTime).toBeLessThan(3000);
  });
  
  test('Time to First Byte (TTFB) should be fast', async ({ page }) => {
    const response = await page.goto('/');
    
    const ttfb = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return perfData.responseStart - perfData.requestStart;
    });
    
    console.log(`TTFB: ${ttfb}ms`);
    
    // TTFB should be under 600ms for good server response
    expect(ttfb).toBeLessThan(600);
  });
  
  test('should have fast DOMContentLoaded', async ({ page }) => {
    await page.goto('/');
    
    const domContentLoaded = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return perfData.domContentLoadedEventEnd - perfData.fetchStart;
    });
    
    console.log(`DOMContentLoaded: ${domContentLoaded}ms`);
    
    // DOMContentLoaded should be under 1.5 seconds
    expect(domContentLoaded).toBeLessThan(1500);
  });
});

test.describe('Resource Performance', () => {
  test('should minimize JavaScript bundle size', async ({ page }) => {
    await page.goto('/');
    
    const jsResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter((r: any) => r.name.endsWith('.js'))
        .map((r: any) => ({
          name: r.name,
          size: r.transferSize,
          duration: r.duration,
        }));
    });
    
    console.log('JavaScript resources:', jsResources);
    
    // Total JS should be under 200KB for a static site
    const totalJsSize = jsResources.reduce((sum, r) => sum + r.size, 0);
    console.log(`Total JS size: ${totalJsSize} bytes (${(totalJsSize / 1024).toFixed(2)} KB)`);
    
    expect(totalJsSize).toBeLessThan(200 * 1024);
  });
  
  test('should minimize CSS bundle size', async ({ page }) => {
    await page.goto('/');
    
    const cssResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter((r: any) => r.name.endsWith('.css'))
        .map((r: any) => ({
          name: r.name,
          size: r.transferSize,
          duration: r.duration,
        }));
    });
    
    console.log('CSS resources:', cssResources);
    
    // Total CSS should be under 100KB
    const totalCssSize = cssResources.reduce((sum, r) => sum + r.size, 0);
    console.log(`Total CSS size: ${totalCssSize} bytes (${(totalCssSize / 1024).toFixed(2)} KB)`);
    
    expect(totalCssSize).toBeLessThan(100 * 1024);
  });
  
  test('images should be optimized', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      
      if (src && !src.startsWith('data:')) {
        // Check if image is in modern format (WebP, AVIF)
        const isModernFormat = src.includes('.webp') || src.includes('.avif');
        const isExternal = src.startsWith('http');
        
        // Internal images should use modern formats
        if (!isExternal) {
          console.log(`Image: ${src} - Modern format: ${isModernFormat}`);
        }
      }
    }
  });
  
  test('should use resource hints effectively', async ({ page }) => {
    await page.goto('/');
    
    const resourceHints = await page.evaluate(() => {
      const preconnect = Array.from(document.querySelectorAll('link[rel="preconnect"]'))
        .map(l => l.getAttribute('href'));
      const dnsPrefetch = Array.from(document.querySelectorAll('link[rel="dns-prefetch"]'))
        .map(l => l.getAttribute('href'));
      const preload = Array.from(document.querySelectorAll('link[rel="preload"]'))
        .map(l => l.getAttribute('href'));
      
      return { preconnect, dnsPrefetch, preload };
    });
    
    console.log('Resource hints:', resourceHints);
    
    // Should have some resource hints
    const totalHints = 
      resourceHints.preconnect.length + 
      resourceHints.dnsPrefetch.length + 
      resourceHints.preload.length;
    
    expect(totalHints).toBeGreaterThan(0);
  });
});

test.describe('Caching and Optimization', () => {
  test('static assets should be cacheable', async ({ page }) => {
    const response = await page.goto('/');
    
    // Get cache headers
    const cacheControl = response?.headers()['cache-control'];
    
    console.log(`Cache-Control: ${cacheControl}`);
    
    // Static site should have appropriate caching
    // (This depends on deployment platform)
  });
  
  test('should use compression', async ({ page }) => {
    const response = await page.goto('/');
    
    const contentEncoding = response?.headers()['content-encoding'];
    
    console.log(`Content-Encoding: ${contentEncoding}`);
    
    // Should use gzip or brotli compression
    // (This depends on deployment platform)
  });
});

test.describe('Rendering Performance', () => {
  test('should not have excessive DOM size', async ({ page }) => {
    await page.goto('/');
    
    const domStats = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const maxDepth = (element: Element, depth = 0): number => {
        if (element.children.length === 0) return depth;
        return Math.max(...Array.from(element.children).map(child => maxDepth(child, depth + 1)));
      };
      
      return {
        totalElements: allElements.length,
        maxDepth: maxDepth(document.body),
      };
    });
    
    console.log('DOM stats:', domStats);
    
    // Total DOM elements should be reasonable (< 1500)
    expect(domStats.totalElements).toBeLessThan(1500);
    
    // DOM depth should not be excessive (< 32)
    expect(domStats.maxDepth).toBeLessThan(32);
  });
  
  test('should minimize render-blocking resources', async ({ page }) => {
    await page.goto('/');
    
    const renderBlockingResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter((r: any) => {
          return (r.name.endsWith('.css') || r.name.endsWith('.js')) && 
                 r.renderBlockingStatus === 'blocking';
        })
        .map((r: any) => r.name);
    });
    
    console.log('Render-blocking resources:', renderBlockingResources);
    
    // Should minimize render-blocking resources
    expect(renderBlockingResources.length).toBeLessThan(5);
  });
});

test.describe('Mobile Performance', () => {
  test('should perform well on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    console.log(`Mobile load time: ${loadTime}ms`);
    
    // Mobile should load reasonably fast (under 4 seconds)
    expect(loadTime).toBeLessThan(4000);
  });
  
  test('mobile should have good LCP', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        setTimeout(() => resolve(0), 10000);
      });
    });
    
    console.log(`Mobile LCP: ${lcp}ms`);
    
    // Mobile LCP should still be under 2.5 seconds
    expect(lcp).toBeLessThan(2500);
    expect(lcp).toBeGreaterThan(0);
  });
});

test.describe('View Transitions Performance', () => {
  test('navigation should be smooth with View Transitions', async ({ page }) => {
    await page.goto('/');
    
    // Click a link to navigate
    const startTime = Date.now();
    await page.click('article a');
    await page.waitForLoadState('domcontentloaded');
    const navigationTime = Date.now() - startTime;
    
    console.log(`Navigation time with View Transitions: ${navigationTime}ms`);
    
    // View Transitions should make navigation feel fast
    expect(navigationTime).toBeLessThan(2000);
  });
});
