import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// URL patterns for sitemap validation
const BLOG_POST_URL_PATTERN = /<url><loc>https:\/\/ben\.balter\.com\/\d{4}\/\d{2}\/\d{2}\/[^<]+<\/loc>[\s\S]*?<\/url>/;
const HOMEPAGE_URL_PATTERN = /<url><loc>https:\/\/ben\.balter\.com\/<\/loc>[\s\S]*?<\/url>/;
const ABOUT_PAGE_URL_PATTERN = /<url><loc>https:\/\/ben\.balter\.com\/about\/<\/loc>[\s\S]*?<\/url>/;

test.describe('Sitemap Generation', () => {
  const outDir = path.join(process.cwd(), 'out');
  const outDirExists = fs.existsSync(outDir);
  
  const distAstroDir = path.join(process.cwd(), 'dist-astro');
  const distAstroDirExists = fs.existsSync(distAstroDir);
  
  // File-based tests - only run if dist-astro directory exists (after Astro build)
  test.describe('File System Tests (Astro build)', () => {
    test.skip(!distAstroDirExists, 'Skipping Astro tests - dist-astro directory does not exist. Run `npm run astro:build` first.');
    
    test('sitemap-index.xml should exist in dist-astro directory', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-index.xml');
      expect(fs.existsSync(sitemapPath), 'sitemap-index.xml should exist in dist-astro directory').toBeTruthy();
    });

    test('sitemap-index.xml should be valid XML', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-index.xml');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Should start with XML declaration
      expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      
      // Should have sitemapindex root element
      expect(content).toContain('<sitemapindex');
      expect(content).toContain('</sitemapindex>');
    });

    test('sitemap-index.xml should reference sitemap-0.xml', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-index.xml');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      expect(content).toContain('sitemap-0.xml');
    });

    test('sitemap-0.xml should exist', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-0.xml');
      expect(fs.existsSync(sitemapPath), 'sitemap-0.xml should exist').toBeTruthy();
    });

    test('sitemap-0.xml should contain URLs', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-0.xml');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Should have urlset root element
      expect(content).toContain('<urlset');
      expect(content).toContain('</urlset>');
      
      // Should have url entries
      expect(content).toContain('<url>');
      expect(content).toContain('</url>');
      
      // Should have required elements
      expect(content).toContain('<loc>');
      expect(content).toContain('<changefreq>');
      expect(content).toContain('<priority>');
    });

    test('sitemap-0.xml should include homepage with highest priority', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-0.xml');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Homepage should exist
      expect(content).toContain('https://ben.balter.com/</loc>');
      
      // Find the homepage entry and check its priority
      const homepageMatch = content.match(HOMEPAGE_URL_PATTERN);
      expect(homepageMatch, 'Homepage should exist in sitemap').toBeTruthy();
      
      if (homepageMatch) {
        const homepageEntry = homepageMatch[0];
        expect(homepageEntry).toContain('<priority>1');
        expect(homepageEntry).toContain('<changefreq>weekly</changefreq>');
      }
    });

    test('sitemap-0.xml should include blog posts with correct priority', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-0.xml');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Find a blog post URL (format: /YYYY/MM/DD/slug/)
      const blogPostMatch = content.match(BLOG_POST_URL_PATTERN);
      expect(blogPostMatch, 'Should have at least one blog post in sitemap').toBeTruthy();
      
      if (blogPostMatch) {
        const blogPostEntry = blogPostMatch[0];
        expect(blogPostEntry).toContain('<priority>0.8</priority>');
        expect(blogPostEntry).toContain('<changefreq>monthly</changefreq>');
      }
    });

    test('sitemap-0.xml should include static pages with correct priority', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-0.xml');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Check for a static page like /about/
      const staticPageMatch = content.match(ABOUT_PAGE_URL_PATTERN);
      expect(staticPageMatch, 'Should have /about/ page in sitemap').toBeTruthy();
      
      if (staticPageMatch) {
        const staticPageEntry = staticPageMatch[0];
        expect(staticPageEntry).toContain('<priority>0.6</priority>');
        expect(staticPageEntry).toContain('<changefreq>monthly</changefreq>');
      }
    });

    test('sitemap-0.xml should not include excluded paths', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-0.xml');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Check that excluded paths (404, not-found, and pages with sitemap: false) are not in the sitemap
      const excludedPaths = [
        '/404/',
        '/_not-found/',
        '/fine-print/', // Has sitemap: false in front matter
      ];
      
      excludedPaths.forEach(excludedPath => {
        // Be careful with regex special characters
        const escapedPath = excludedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`<loc>https://ben\\.balter\\.com${escapedPath}`, 'i');
        expect(content.match(regex), `Should not include ${excludedPath} in sitemap`).toBeFalsy();
      });
    });

    test('sitemap-0.xml should include all core pages', () => {
      const sitemapPath = path.join(distAstroDir, 'sitemap-0.xml');
      const content = fs.readFileSync(sitemapPath, 'utf-8');
      
      // Core pages that should be in the sitemap
      const corePages = [
        'https://ben.balter.com/',
        'https://ben.balter.com/about/',
        'https://ben.balter.com/resume/',
        'https://ben.balter.com/contact/',
        'https://ben.balter.com/talks/',
      ];
      
      corePages.forEach(pageUrl => {
        expect(content).toContain(`<loc>${pageUrl}</loc>`);
      });
    });

    test('robots.txt should exist in dist-astro directory', () => {
      const robotsPath = path.join(distAstroDir, 'robots.txt');
      expect(fs.existsSync(robotsPath), 'robots.txt should exist in dist-astro directory').toBeTruthy();
    });

    test('robots.txt should have proper content', () => {
      const robotsPath = path.join(distAstroDir, 'robots.txt');
      const content = fs.readFileSync(robotsPath, 'utf-8');
      
      // Should have User-agent directive
      expect(content).toContain('User-agent: *');
      
      // Should have Allow directive
      expect(content).toContain('Allow: /');
      
      // Should reference sitemap
      expect(content).toContain('Sitemap: https://ben.balter.com/sitemap.xml');
      
      // Should have Host directive
      expect(content).toContain('Host: ben.balter.com');
    });

    test('robots.txt should include disallow directives', () => {
      const robotsPath = path.join(distAstroDir, 'robots.txt');
      const content = fs.readFileSync(robotsPath, 'utf-8');
      
      // Should have Disallow directives
      expect(content).toContain('Disallow: /404.html');
      expect(content).toContain('Disallow: /fine-print/');
      
      // Should not contain Jekyll template syntax
      expect(content).not.toContain('{{');
      expect(content).not.toContain('{%');
      expect(content).not.toContain('page.disallows');
    });

    test('humans.txt should exist in dist-astro directory', () => {
      const humansPath = path.join(distAstroDir, 'humans.txt');
      expect(fs.existsSync(humansPath), 'humans.txt should exist in dist-astro directory').toBeTruthy();
    });

    test('humans.txt should have proper content', () => {
      const humansPath = path.join(distAstroDir, 'humans.txt');
      const content = fs.readFileSync(humansPath, 'utf-8');
      
      // Should have SITE section
      expect(content).toContain('/* SITE */');
      expect(content).toContain('Last Updated:');
      expect(content).toContain('Standards: HTML5, CSS3');
      expect(content).toContain('Components:');
      
      // Should have TEAM section
      expect(content).toContain('/* TEAM */');
      expect(content).toContain('Name: benbalter');
      expect(content).toContain('Site: https://github.com/benbalter');
      
      // Should not contain Jekyll template syntax
      expect(content).not.toContain('{{');
      expect(content).not.toContain('{%');
      expect(content).not.toContain('site.time');
    });

    test('security.txt should exist at .well-known/security.txt', () => {
      const securityPath = path.join(distAstroDir, '.well-known', 'security.txt');
      expect(fs.existsSync(securityPath), 'security.txt should exist at .well-known/security.txt').toBeTruthy();
    });

    test('security.txt should have proper content', () => {
      const securityPath = path.join(distAstroDir, '.well-known', 'security.txt');
      const content = fs.readFileSync(securityPath, 'utf-8');
      
      // Should have required fields per RFC 9116
      expect(content).toContain('Contact: mailto:ben@balter.com');
      expect(content).toContain('Expires:');
      expect(content).toContain('Encryption: https://ben.balter.com/key.asc');
      expect(content).toContain('Canonical: https://ben.balter.com/.well-known/security.txt');
      expect(content).toContain('Policy: https://github.com/benbalter/benbalter.github.com/security/policy');
      
      // Should not contain Jekyll template syntax
      expect(content).not.toContain('{{');
      expect(content).not.toContain('{%');
      expect(content).not.toContain('site.email');
      expect(content).not.toContain('page.url');
    });
  });
  
  // File-based tests - only run if out directory exists (after Next.js build)
  test.describe('File System Tests (Next.js build)', () => {
    test.skip(!outDirExists, 'Skipping file system tests - out directory does not exist. Run `npm run next:build` first.');
    
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
      // Note: lastmod omitted - using build time for all URLs defeats the purpose
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
      
      excludedPaths.forEach(excludedPath => {
        // Be careful with regex special characters
        const escapedPath = excludedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`<loc>https://ben\\.balter\\.com${escapedPath}`, 'i');
        expect(content.match(regex), `Should not include ${excludedPath} in sitemap`).toBeFalsy();
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
  });

  // HTTP tests - legacy Jekyll server tests
  // These tests are now covered by seo.spec.ts for both Jekyll and Next.js
  // Keeping skipped as they're redundant with seo.spec.ts tests
  test.describe.skip('HTTP Accessibility Tests (Jekyll server)', () => {
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
});
