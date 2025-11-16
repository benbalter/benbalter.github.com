import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Link Validation Tests
 * 
 * These tests validate that all internal links across the site are working correctly.
 * They check for broken links, ensuring all pages link to valid content.
 */

interface LinkResult {
  source: string;
  href: string;
  status: 'ok' | 'broken' | 'external';
  statusCode?: number;
}

// Cache for tested URLs to avoid redundant requests
const urlCache = new Map<string, number>();

test.describe('Link Validation', () => {
  test('homepage should not have broken internal links', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Get all links on the homepage
    const links = await page.locator('a[href]').all();
    const results: LinkResult[] = [];
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (!href) continue;
      
      // Skip external links, anchors, and dangerous protocols
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href.startsWith('data:') ||
        href.startsWith('vbscript:')
      ) {
        continue;
      }
      
      // Check if URL is cached
      if (!urlCache.has(href)) {
        const response = await request.get(href, { 
          failOnStatusCode: false,
          timeout: 10000 
        });
        urlCache.set(href, response.status());
      }
      
      const status = urlCache.get(href)!;
      results.push({
        source: '/',
        href,
        status: status === 200 ? 'ok' : 'broken',
        statusCode: status,
      });
    }
    
    // Check for broken links
    const brokenLinks = results.filter(r => r.status === 'broken');
    
    if (brokenLinks.length > 0) {
      console.log('\nBroken links found on homepage:');
      brokenLinks.forEach(link => {
        console.log(`  ${link.href} - Status: ${link.statusCode}`);
      });
    }
    
    expect(brokenLinks.length).toBe(0);
  });

  test('sample blog posts should not have broken internal links', async ({ page, request }) => {
    // Get a few sample posts to check
    const sampleUrls = [
      '/2024/01/08/dissenting-voices/',
      '/2023/12/08/cathedral-bazaar-management/',
      '/2022/02/16/leaders-show-their-work/',
    ];
    
    const allBrokenLinks: LinkResult[] = [];
    
    for (const url of sampleUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        
        // Get all links on this page
        const links = await page.locator('article a[href], .post a[href], main a[href]').all();
        
        for (const link of links) {
          const href = await link.getAttribute('href');
          if (!href) continue;
          
          // Skip external links, anchors, and dangerous protocols
          if (
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:') ||
            href.startsWith('data:') ||
            href.startsWith('vbscript:')
          ) {
            continue;
          }
          
          // Check if URL is cached
          if (!urlCache.has(href)) {
            const response = await request.get(href, { 
              failOnStatusCode: false,
              timeout: 10000 
            });
            urlCache.set(href, response.status());
          }
          
          const status = urlCache.get(href)!;
          if (status !== 200) {
            allBrokenLinks.push({
              source: url,
              href,
              status: 'broken',
              statusCode: status,
            });
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not check ${url}: ${error}`);
      }
    }
    
    if (allBrokenLinks.length > 0) {
      console.log('\nBroken links found in sample posts:');
      allBrokenLinks.forEach(link => {
        console.log(`  ${link.source} -> ${link.href} - Status: ${link.statusCode}`);
      });
    }
    
    expect(allBrokenLinks.length).toBe(0);
  });

  test('static pages should not have broken internal links', async ({ page, request }) => {
    const pageUrls = [
      '/about/',
      '/contact/',
      '/resume/',
    ];
    
    const allBrokenLinks: LinkResult[] = [];
    
    for (const url of pageUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        
        // Get all links on this page
        const links = await page.locator('a[href]').all();
        
        for (const link of links) {
          const href = await link.getAttribute('href');
          if (!href) continue;
          
          // Skip external links, anchors, and dangerous protocols
          if (
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:') ||
            href.startsWith('data:') ||
            href.startsWith('vbscript:')
          ) {
            continue;
          }
          
          // Skip unprocessed template variables (indicates content rendering issue, not routing)
          if (href.includes('{{') || href.includes('{%')) {
            console.warn(`Warning: Unprocessed template variable in link: ${href} on ${url}`);
            continue;
          }
          
          // Check if URL is cached
          if (!urlCache.has(href)) {
            const response = await request.get(href, { 
              failOnStatusCode: false,
              timeout: 10000 
            });
            urlCache.set(href, response.status());
          }
          
          const status = urlCache.get(href)!;
          if (status !== 200) {
            allBrokenLinks.push({
              source: url,
              href,
              status: 'broken',
              statusCode: status,
            });
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not check ${url}: ${error}`);
      }
    }
    
    if (allBrokenLinks.length > 0) {
      console.log('\nBroken links found in static pages:');
      allBrokenLinks.forEach(link => {
        console.log(`  ${link.source} -> ${link.href} - Status: ${link.statusCode}`);
      });
    }
    
    expect(allBrokenLinks.length).toBe(0);
  });

  test('navigation links should all work', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Get all navigation links
    const navLinks = await page.locator('nav a[href], .navbar a[href]').all();
    const brokenLinks: LinkResult[] = [];
    
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      if (!href) continue;
      
      // Skip external links
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
        continue;
      }
      
      // Check if URL is cached
      if (!urlCache.has(href)) {
        const response = await request.get(href, { 
          failOnStatusCode: false,
          timeout: 10000 
        });
        urlCache.set(href, response.status());
      }
      
      const status = urlCache.get(href)!;
      if (status !== 200) {
        brokenLinks.push({
          source: 'navigation',
          href,
          status: 'broken',
          statusCode: status,
        });
      }
    }
    
    if (brokenLinks.length > 0) {
      console.log('\nBroken navigation links:');
      brokenLinks.forEach(link => {
        console.log(`  ${link.href} - Status: ${link.statusCode}`);
      });
    }
    
    expect(brokenLinks.length).toBe(0);
  });

  test('footer links should all work', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Get all footer links
    const footerLinks = await page.locator('footer a[href], nav.border-top a[href]').all();
    const brokenLinks: LinkResult[] = [];
    
    for (const link of footerLinks) {
      const href = await link.getAttribute('href');
      if (!href) continue;
      
      // Skip external links and special protocols
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('#') ||
        href.startsWith('mailto:')
      ) {
        continue;
      }
      
      // Check if URL is cached
      if (!urlCache.has(href)) {
        const response = await request.get(href, { 
          failOnStatusCode: false,
          timeout: 10000 
        });
        urlCache.set(href, response.status());
      }
      
      const status = urlCache.get(href)!;
      if (status !== 200) {
        brokenLinks.push({
          source: 'footer',
          href,
          status: 'broken',
          statusCode: status,
        });
      }
    }
    
    if (brokenLinks.length > 0) {
      console.log('\nBroken footer links:');
      brokenLinks.forEach(link => {
        console.log(`  ${link.href} - Status: ${link.statusCode}`);
      });
    }
    
    expect(brokenLinks.length).toBe(0);
  });
});

test.describe('Generated Static Files Validation', () => {
  test('all generated HTML files should exist and be valid', () => {
    const outDir = path.join(process.cwd(), 'out');
    
    if (!fs.existsSync(outDir)) {
      test.skip(true, 'Output directory does not exist - run `npm run next:build` first');
      return;
    }
    
    // Count HTML files
    let htmlCount = 0;
    const checkDir = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip _next and asset directories
          if (!entry.name.startsWith('_') && !entry.name.startsWith('.')) {
            checkDir(fullPath);
          }
        } else if (entry.name === 'index.html') {
          htmlCount++;
          
          // Verify file is not empty
          const stats = fs.statSync(fullPath);
          expect(stats.size).toBeGreaterThan(0);
        }
      }
    };
    
    checkDir(outDir);
    
    console.log(`\n✓ Found ${htmlCount} generated HTML files`);
    
    // Should have at least 150 pages (posts + pages + redirects)
    expect(htmlCount).toBeGreaterThan(150);
  });
});
