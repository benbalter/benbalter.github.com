import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Sitemap Generation', () => {
  const outDir = path.join(process.cwd(), 'out');
  
  test('sitemap.xml should exist in out directory', () => {
    const sitemapPath = path.join(outDir, 'sitemap.xml');
    expect(fs.existsSync(sitemapPath), 'sitemap.xml should exist in out directory').toBeTruthy();
  });

  test('sitemap.xml should be valid XML', () => {
    const sitemapPath = path.join(outDir, 'sitemap.xml');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    // Should start with XML declaration
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    
    // Should have sitemapindex root element
    expect(content).toContain('<sitemapindex');
    expect(content).toContain('</sitemapindex>');
  });

  test('sitemap.xml should reference sitemap-0.xml', () => {
    const sitemapPath = path.join(outDir, 'sitemap.xml');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    expect(content).toContain('sitemap-0.xml');
  });

  test('sitemap.xml should reference tweets sitemap', () => {
    const sitemapPath = path.join(outDir, 'sitemap.xml');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    expect(content).toContain('tweets/sitemap.xml');
  });

  test('sitemap-0.xml should exist', () => {
    const sitemapPath = path.join(outDir, 'sitemap-0.xml');
    expect(fs.existsSync(sitemapPath), 'sitemap-0.xml should exist').toBeTruthy();
  });

  test('sitemap-0.xml should contain URLs', () => {
    const sitemapPath = path.join(outDir, 'sitemap-0.xml');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    // Should have urlset root element
    expect(content).toContain('<urlset');
    expect(content).toContain('</urlset>');
    
    // Should have url entries
    expect(content).toContain('<url>');
    expect(content).toContain('</url>');
    
    // Should have required elements
    expect(content).toContain('<loc>');
    expect(content).toContain('<lastmod>');
    expect(content).toContain('<changefreq>');
    expect(content).toContain('<priority>');
  });

  test('sitemap-0.xml should include homepage with highest priority', () => {
    const sitemapPath = path.join(outDir, 'sitemap-0.xml');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    // Homepage should exist
    expect(content).toContain('https://ben.balter.com/</loc>');
    
    // Find the homepage entry and check its priority
    const homepageMatch = content.match(/<url><loc>https:\/\/ben\.balter\.com\/<\/loc>.*?<\/url>/);
    expect(homepageMatch).toBeTruthy();
    
    if (homepageMatch) {
      const homepageEntry = homepageMatch[0];
      expect(homepageEntry).toContain('<priority>1');
      expect(homepageEntry).toContain('<changefreq>weekly</changefreq>');
    }
  });

  test('sitemap-0.xml should include blog posts with correct priority', () => {
    const sitemapPath = path.join(outDir, 'sitemap-0.xml');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    // Find a blog post URL (format: /YYYY/MM/DD/slug/)
    const blogPostMatch = content.match(/<url><loc>https:\/\/ben\.balter\.com\/\d{4}\/\d{2}\/\d{2}\/[^<]+<\/loc>.*?<\/url>/);
    expect(blogPostMatch, 'Should have at least one blog post in sitemap').toBeTruthy();
    
    if (blogPostMatch) {
      const blogPostEntry = blogPostMatch[0];
      expect(blogPostEntry).toContain('<priority>0.8</priority>');
      expect(blogPostEntry).toContain('<changefreq>monthly</changefreq>');
    }
  });

  test('sitemap-0.xml should include static pages with correct priority', () => {
    const sitemapPath = path.join(outDir, 'sitemap-0.xml');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    // Check for a static page like /about/
    const staticPageMatch = content.match(/<url><loc>https:\/\/ben\.balter\.com\/about\/<\/loc>.*?<\/url>/);
    
    if (staticPageMatch) {
      const staticPageEntry = staticPageMatch[0];
      expect(staticPageEntry).toContain('<priority>0.6</priority>');
      expect(staticPageEntry).toContain('<changefreq>monthly</changefreq>');
    }
  });

  test('sitemap-0.xml should not include excluded paths', () => {
    const sitemapPath = path.join(outDir, 'sitemap-0.xml');
    const content = fs.readFileSync(sitemapPath, 'utf-8');
    
    // Check that truly excluded paths (404, not-found) are not in the sitemap
    const excludedPaths = [
      '/404/',
      '/_not-found/',
    ];
    
    excludedPaths.forEach(path => {
      // Be careful with regex special characters
      const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`<loc>https://ben\\.balter\\.com${escapedPath}`, 'i');
      expect(content.match(regex), `Should not include ${path} in sitemap`).toBeFalsy();
    });
  });

  test('robots.txt should exist in out directory', () => {
    const robotsPath = path.join(outDir, 'robots.txt');
    expect(fs.existsSync(robotsPath), 'robots.txt should exist in out directory').toBeTruthy();
  });

  test('robots.txt should have proper content', () => {
    const robotsPath = path.join(outDir, 'robots.txt');
    const content = fs.readFileSync(robotsPath, 'utf-8');
    
    // Should have User-agent directive
    expect(content).toContain('User-agent: *');
    
    // Should have Allow directive
    expect(content).toContain('Allow: /');
    
    // Should reference sitemap
    expect(content).toContain('Sitemap: https://ben.balter.com/sitemap.xml');
    
    // Should reference tweets sitemap
    expect(content).toContain('Sitemap: https://ben.balter.com/tweets/sitemap.xml');
    
    // Should have Host directive
    expect(content).toContain('Host: https://ben.balter.com');
  });

  test('robots.txt should include disallow directives', () => {
    const robotsPath = path.join(outDir, 'robots.txt');
    const content = fs.readFileSync(robotsPath, 'utf-8');
    
    // Check for some of the disallowed paths
    const disallowedPaths = [
      '/404.html',
      '/fine-print/',
      '/tag*',
      '/tags*',
    ];
    
    disallowedPaths.forEach(path => {
      expect(content).toContain(`Disallow: ${path}`);
    });
  });

  test('sitemap should be accessible via HTTP', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('sitemapindex');
  });

  test('robots.txt should be accessible via HTTP', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.textContent('body');
    expect(content).toContain('User-agent');
    expect(content).toContain('Sitemap');
  });
});
