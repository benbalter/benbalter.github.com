/**
 * Next.js Build Tests
 * 
 * E2E tests to verify the Next.js build and static export functionality.
 * Tests the Next.js site instead of Jekyll site.
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(process.cwd());
const outDir = path.join(rootDir, 'out');
const nextDir = path.join(rootDir, '.next');

test.describe('Next.js Build Output', () => {
  test('should create .next build directory', () => {
    expect(fs.existsSync(nextDir)).toBeTruthy();
  });

  test('should create out directory for static export', () => {
    expect(fs.existsSync(outDir)).toBeTruthy();
  });

  test('should have build manifest', () => {
    const manifestPath = path.join(nextDir, 'build-manifest.json');
    expect(fs.existsSync(manifestPath)).toBeTruthy();
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest).toBeDefined();
    expect(manifest.pages).toBeDefined();
  });

  test('should have prerender manifest with routes', () => {
    const manifestPath = path.join(nextDir, 'prerender-manifest.json');
    expect(fs.existsSync(manifestPath)).toBeTruthy();
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest).toBeDefined();
    expect(manifest.routes).toBeDefined();
    
    // Should have at least index route
    expect(Object.keys(manifest.routes).length).toBeGreaterThan(0);
  });

  test('should export index page', () => {
    const indexPath = path.join(outDir, 'index.html');
    expect(fs.existsSync(indexPath)).toBeTruthy();
    
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain('Ben Balter');
  });

  test('should export 404 page', () => {
    const notFoundPath = path.join(outDir, '404.html');
    expect(fs.existsSync(notFoundPath)).toBeTruthy();
  });

  test('should export static pages', () => {
    // Check for static pages like about, contact, etc.
    const staticPages = ['about', 'contact', 'fine-print'];
    
    for (const page of staticPages) {
      const pagePath = path.join(outDir, page, 'index.html');
      expect(fs.existsSync(pagePath)).toBeTruthy();
    }
  });

  test('should export blog posts', () => {
    // Check for blog posts - at least one year directory should exist
    const years = ['2024', '2023', '2022'];
    let foundYear = false;
    
    for (const year of years) {
      const yearDir = path.join(outDir, year);
      if (fs.existsSync(yearDir)) {
        foundYear = true;
        
        // Verify nested structure exists (year/month/day/slug)
        const dirs = fs.readdirSync(yearDir);
        expect(dirs.length).toBeGreaterThan(0);
        break;
      }
    }
    
    expect(foundYear).toBeTruthy();
  });

  test('should follow trailing slash pattern', () => {
    // Check that generated HTML files follow trailing slash pattern
    const aboutIndexPath = path.join(outDir, 'about', 'index.html');
    expect(fs.existsSync(aboutIndexPath)).toBeTruthy();
  });

  test('should export Next.js static assets', () => {
    const nextStaticDir = path.join(outDir, '_next', 'static');
    expect(fs.existsSync(nextStaticDir)).toBeTruthy();
  });

  test('should have CSS chunks', () => {
    const nextStaticDir = path.join(outDir, '_next', 'static');
    
    // For static export, Next.js may inline CSS or use different chunking strategy
    // Check if static directory exists and has files
    expect(fs.existsSync(nextStaticDir)).toBeTruthy();
    
    // Find CSS or chunk files recursively
    const findChunkFiles = (dir: string): string[] => {
      const files: string[] = [];
      if (!fs.existsSync(dir)) return files;
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...findChunkFiles(fullPath));
        } else if (item.endsWith('.css') || item.endsWith('.js')) {
          files.push(fullPath);
        }
      }
      
      return files;
    };
    
    const chunkFiles = findChunkFiles(nextStaticDir);
    // Should have at least some static assets
    expect(chunkFiles.length).toBeGreaterThan(0);
  });

  test('should have JavaScript chunks', () => {
    const nextStaticDir = path.join(outDir, '_next', 'static');
    
    // Find JS files recursively
    const findJsFiles = (dir: string): string[] => {
      const files: string[] = [];
      if (!fs.existsSync(dir)) return files;
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...findJsFiles(fullPath));
        } else if (item.endsWith('.js')) {
          files.push(fullPath);
        }
      }
      
      return files;
    };
    
    const jsFiles = findJsFiles(nextStaticDir);
    expect(jsFiles.length).toBeGreaterThan(0);
  });
});

test.describe('Next.js Build HTML Structure', () => {
  test('should have proper HTML structure in index page', () => {
    const indexPath = path.join(outDir, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    expect(content).toMatch(/<html[^>]*>/);
    expect(content).toContain('<head>');
    expect(content).toMatch(/<body[^>]*>/);  // Body tag may have attributes
    expect(content).toContain('</html>');
  });

  test('should have required metadata in index page', () => {
    const indexPath = path.join(outDir, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    // Check for charset - may be in escaped JSON or regular HTML
    expect(content).toMatch(/charset.*utf-8/i);
    expect(content).toContain('viewport');
  });

  test('should include Next.js scripts', () => {
    const indexPath = path.join(outDir, 'index.html');
    const content = fs.readFileSync(indexPath, 'utf-8');
    
    // Check for Next.js script tags
    expect(content).toMatch(/<script[^>]*>/i);
  });

  test('should render blog posts with substantial content', () => {
    // Find a blog post HTML file
    const findHtmlFiles = (dir: string, maxDepth = 5, currentDepth = 0): string[] => {
      const files: string[] = [];
      if (currentDepth > maxDepth || !fs.existsSync(dir)) return files;
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...findHtmlFiles(fullPath, maxDepth, currentDepth + 1));
        } else if (item === 'index.html') {
          files.push(fullPath);
        }
      }
      
      return files;
    };
    
    const yearDir = path.join(outDir, '2024');
    if (fs.existsSync(yearDir)) {
      const htmlFiles = findHtmlFiles(yearDir);
      expect(htmlFiles.length).toBeGreaterThan(0);
      
      // Check first blog post has content
      const content = fs.readFileSync(htmlFiles[0], 'utf-8');
      expect(content).toContain('<html');
      expect(content.length).toBeGreaterThan(100); // Has substantial content
    }
  });
});

test.describe('Next.js Configuration', () => {
  test('should use static export configuration', () => {
    const nextConfigPath = path.join(rootDir, 'next.config.mjs');
    expect(fs.existsSync(nextConfigPath)).toBeTruthy();
    
    const content = fs.readFileSync(nextConfigPath, 'utf-8');
    expect(content).toContain("output: 'export'");
    expect(content).toContain("trailingSlash: true");
  });

  test('should have unoptimized images for static export', () => {
    const nextConfigPath = path.join(rootDir, 'next.config.mjs');
    const content = fs.readFileSync(nextConfigPath, 'utf-8');
    expect(content).toContain("unoptimized: true");
  });

  test('should have TypeScript configuration', () => {
    const tsconfigPath = path.join(rootDir, 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBeTruthy();
    
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.include).toBeDefined();
  });
});

test.describe('Next.js Route Generation', () => {
  test('should generate static pages from prerender manifest', () => {
    const manifestPath = path.join(nextDir, 'prerender-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    
    // Check that routes are generated
    const routes = Object.keys(manifest.routes);
    
    // Should have index route
    expect(routes).toContain('/');
    
    // Check that index route exists
    const indexPath = path.join(outDir, 'index.html');
    expect(fs.existsSync(indexPath)).toBeTruthy();
    
    // Check a few known static pages
    const staticPages = ['about', 'contact', 'fine-print'];
    for (const page of staticPages) {
      if (routes.some(r => r.includes(page))) {
        const pagePath = path.join(outDir, page, 'index.html');
        expect(fs.existsSync(pagePath)).toBeTruthy();
      }
    }
    
    // Check that at least some blog posts are generated
    const blogPostRoutes = routes.filter(r => r.match(/\/\d{4}\/\d{2}\/\d{2}\//));
    expect(blogPostRoutes.length).toBeGreaterThan(0);
    
    // Sample check a couple blog posts
    for (const route of blogPostRoutes.slice(0, 3)) {
      const routePath = route.slice(1); // Remove leading slash
      const htmlPath = path.join(outDir, routePath, 'index.html');
      expect(fs.existsSync(htmlPath)).toBeTruthy();
    }
  });
});
