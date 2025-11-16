/**
 * Metadata and SEO validation tests for Next.js static site
 * 
 * Validates that all pages have proper metadata including:
 * - Title tags
 * - Meta descriptions
 * - Open Graph tags
 * - Twitter Card tags
 * - JSON-LD structured data
 * - Canonical URLs
 * - RSS feed links
 * - Sitemaps
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(process.cwd(), 'out');

test.describe('SEO Metadata Validation', () => {
  test.describe('Homepage metadata', () => {
    test('should have complete metadata', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      
      // Title
      await expect(page).toHaveTitle(/Ben Balter/);
      
      // Meta description
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toContain('Technology leadership');
      
      // Open Graph tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toBe('Ben Balter');
      
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      expect(ogDescription).toContain('Technology leadership');
      
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
      expect(ogUrl).toBe('https://ben.balter.com/');
      
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
      expect(ogType).toBe('website');
      
      // Twitter Card tags
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
      expect(twitterCard).toBe('summary');
      
      const twitterCreator = await page.locator('meta[name="twitter:creator"]').getAttribute('content');
      expect(twitterCreator).toBe('@benbalter');
      
      // Robots
      const robots = await page.locator('meta[name="robots"]').getAttribute('content');
      expect(robots).toContain('index');
      expect(robots).toContain('follow');
      
      // RSS feed link
      const rssFeed = page.locator('link[type="application/rss+xml"]');
      await expect(rssFeed).toHaveAttribute('href', 'https://ben.balter.com/feed.xml');
      
      // Canonical URL (should use layout's default or page metadata)
      // Homepage may not have canonical, which is fine
      
      // Icons
      await expect(page.locator('link[rel="shortcut icon"]')).toHaveAttribute('href', '/favicon.ico');
      await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
    });
    
    test('should have JSON-LD structured data', async ({ page }) => {
      await page.goto(`${BASE_URL}/`);
      
      // Get all JSON-LD scripts
      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(jsonLdScripts.length).toBeGreaterThanOrEqual(2);
      
      // Parse and validate WebSite schema
      const websiteScript = jsonLdScripts.find(script => {
        try {
          const parsed = JSON.parse(script);
          return parsed['@type'] === 'WebSite';
        } catch {
          return false;
        }
      });
      expect(websiteScript).toBeDefined();
      const websiteSchema = JSON.parse(websiteScript || '{}');
      expect(websiteSchema['@context']).toBe('https://schema.org');
      expect(websiteSchema['@type']).toBe('WebSite');
      expect(websiteSchema.name).toBe('Ben Balter');
      expect(websiteSchema.url).toBe('https://ben.balter.com');
      
      // Parse and validate Person schema
      const personScript = jsonLdScripts.find(script => {
        try {
          const parsed = JSON.parse(script);
          return parsed['@type'] === 'Person';
        } catch {
          return false;
        }
      });
      expect(personScript).toBeDefined();
      const personSchema = JSON.parse(personScript || '{}');
      expect(personSchema['@context']).toBe('https://schema.org');
      expect(personSchema['@type']).toBe('Person');
      expect(personSchema.name).toBe('Ben Balter');
      expect(personSchema.jobTitle).toBe('Director of Engineering Operations and Culture');
      expect(personSchema.worksFor).toBeDefined();
      expect(personSchema.worksFor.name).toBe('GitHub');
    });
  });
  
  test.describe('Blog post metadata', () => {
    test('should have complete metadata on a blog post', async ({ page }) => {
      await page.goto(`${BASE_URL}/2025/01/30/how-to-run-language-tool-open-source-grammarly-alternative-on-macos/`);
      
      // Title
      await expect(page).toHaveTitle(/How to run LanguageTool on macOS/);
      
      // Meta description
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toContain('grammar');
      
      // Canonical URL
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain('/2025/01/30/how-to-run-language-tool-open-source-grammarly-alternative-on-macos/');
      
      // Open Graph tags
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toContain('LanguageTool');
      
      const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
      expect(ogType).toBe('article');
      
      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(ogImage).toContain('https://ben.balter.com/');
      
      // Article metadata
      const publishedTime = await page.locator('meta[property="article:published_time"]').getAttribute('content');
      expect(publishedTime).toContain('2025-01-30');
      
      const author = await page.locator('meta[property="article:author"]').getAttribute('content');
      expect(author).toBe('Ben Balter');
      
      // Twitter Card
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
      expect(twitterCard).toBe('summary_large_image');
      
      const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');
      expect(twitterImage).toContain('https://ben.balter.com/');
    });
    
    test('should have BlogPosting JSON-LD on blog post', async ({ page }) => {
      await page.goto(`${BASE_URL}/2025/01/30/how-to-run-language-tool-open-source-grammarly-alternative-on-macos/`);
      
      // Get JSON-LD script
      const jsonLdScripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(jsonLdScripts.length).toBeGreaterThanOrEqual(1);
      
      // Parse and validate BlogPosting schema
      const blogSchema = JSON.parse(jsonLdScripts[0]);
      expect(blogSchema['@context']).toBe('https://schema.org');
      expect(blogSchema['@type']).toBe('BlogPosting');
      expect(blogSchema.headline).toContain('LanguageTool');
      expect(blogSchema.description).toBeDefined();
      expect(blogSchema.datePublished).toBe('2025-01-30T00:00:00.000Z');
      expect(blogSchema.author).toBeDefined();
      expect(blogSchema.author['@type']).toBe('Person');
      expect(blogSchema.author.name).toBe('Ben Balter');
      expect(blogSchema.mainEntityOfPage).toBeDefined();
    });
  });
  
  test.describe('Static page metadata', () => {
    test('should have metadata on about page', async ({ page }) => {
      await page.goto(`${BASE_URL}/about/`);
      
      // Title
      await expect(page).toHaveTitle(/About/);
      
      // Meta description
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeDefined();
      
      // Open Graph
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toBeDefined();
      
      // Canonical
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain('/about/');
    });
  });
  
  test.describe('RSS Feeds', () => {
    test('should have valid RSS feed', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/feed.xml`);
      expect(response.ok()).toBeTruthy();
      
      const content = await response.text();
      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain('<rss version="2.0">');
      expect(content).toContain('<title>Ben Balter</title>');
      expect(content).toContain('<link>https://ben.balter.com</link>');
      expect(content).toContain('<item>');
    });
    
    test('should have press feed', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/press/feed/index.xml`);
      expect(response.ok()).toBeTruthy();
      
      const content = await response.text();
      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain('<rss version="2.0">');
      expect(content).toContain('Press');
    });
  });
  
  test.describe('Sitemaps', () => {
    test('should have sitemap', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/sitemap.xml`);
      expect(response.ok()).toBeTruthy();
      
      const content = await response.text();
      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain('<urlset');
      expect(content).toContain('https://ben.balter.com/');
      expect(content).toContain('<loc>');
      expect(content).toContain('<lastmod>');
      expect(content).toContain('<changefreq>');
      expect(content).toContain('<priority>');
    });
    
    test('should have sitemap index', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/sitemap_index.xml`);
      expect(response.ok()).toBeTruthy();
      
      const content = await response.text();
      expect(content).toContain('<?xml version="1.0"');
      expect(content).toContain('<sitemapindex');
      expect(content).toContain('https://ben.balter.com/sitemap.xml');
    });
  });
  
  test.describe('Static export validation', () => {
    test('should have generated feed files in out directory', () => {
      expect(fs.existsSync(path.join(OUT_DIR, 'feed.xml'))).toBeTruthy();
      expect(fs.existsSync(path.join(OUT_DIR, 'press', 'feed', 'index.xml'))).toBeTruthy();
      expect(fs.existsSync(path.join(OUT_DIR, 'sitemap.xml'))).toBeTruthy();
      expect(fs.existsSync(path.join(OUT_DIR, 'sitemap_index.xml'))).toBeTruthy();
    });
  });
});
