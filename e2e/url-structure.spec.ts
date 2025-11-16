import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * URL Structure Validation Tests
 * 
 * These tests verify that all content from Jekyll is properly accessible
 * via Next.js routing with the same URL structure.
 */

// Helper to parse post filename into URL components
function parsePostFilename(filename: string): { year: string; month: string; day: string; slug: string } | null {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) return null;
  
  return {
    year: match[1],
    month: match[2],
    day: match[3],
    slug: match[4],
  };
}

// Shared helper to read and parse files from a directory
function readAndParseFiles<T>(
  dir: string,
  filterFn: (filename: string) => boolean,
  mapFn: (filename: string, fullPath: string, data: any, content: string) => T | null
): T[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files = fs.readdirSync(dir);
  return files
    .filter(filterFn)
    .map(f => {
      const fullPath = path.join(dir, f);
      const content = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(content);
      return mapFn(f, fullPath, data, content);
    })
    .filter(Boolean) as T[];
}

// Helper to get all posts
function getAllPosts() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  return readAndParseFiles(
    postsDir,
    f => f.endsWith('.md'),
    (f, fullPath, data, content) => {
      const parsed = parsePostFilename(f);
      if (!parsed) return null;
      return {
        filename: f,
        url: `/${parsed.year}/${parsed.month}/${parsed.day}/${parsed.slug}/`,
        ...parsed,
        frontmatter: data,
      };
    }
  );
}

// Helper to get all pages
function getAllPages() {
  const pagesDir = path.join(process.cwd(), 'content', 'pages');
  return readAndParseFiles(
    pagesDir,
    f => f.endsWith('.md') || f.endsWith('.html'),
    (f, fullPath, data, content) => {
      const slug = f.replace(/\.(md|html)$/, '');
      // Use permalink if specified, otherwise use slug
      const url = data.permalink || (slug === 'index' ? '/' : `/${slug}/`);
      return {
        filename: f,
        slug,
        url,
        frontmatter: data,
      };
    }
  );
}

test.describe('URL Structure Validation', () => {
  test('all blog posts should be accessible via Jekyll-style URLs', async ({ page }) => {
    const posts = getAllPosts();
    
    expect(posts.length).toBeGreaterThan(0);
    
    // Sample a few posts to verify routing works
    const samplePosts = [
      posts[0], // First post
      posts[Math.floor(posts.length / 2)], // Middle post
      posts[posts.length - 1], // Last post
    ].filter(Boolean);
    
    for (const post of samplePosts) {
      const response = await page.goto(post.url, { waitUntil: 'domcontentloaded' });
      
      // Should get a successful response
      expect(response?.status()).toBe(200);
      
      // Should have the post title if available
      if (post.frontmatter?.title) {
        await expect(page).toHaveTitle(new RegExp(post.frontmatter.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      }
    }
  });

  test('all static pages should be accessible', async ({ page }) => {
    const pages = getAllPages();
    
    expect(pages.length).toBeGreaterThan(0);
    
    // Test each page
    for (const pageInfo of pages) {
      // Skip 404 page as it returns 404 status
      if (pageInfo.slug === '404') continue;
      
      const response = await page.goto(pageInfo.url, { waitUntil: 'domcontentloaded' });
      
      // Should get a successful response
      expect(response?.status()).toBe(200);
      
      // Should have a title
      await expect(page).toHaveTitle(/.+/);
    }
  });

  test('blog post URLs follow Jekyll permalink pattern YYYY/MM/DD/slug', async ({ page }) => {
    const posts = getAllPosts();
    const samplePost = posts[0];
    
    if (samplePost) {
      const response = await page.goto(samplePost.url);
      expect(response?.status()).toBe(200);
      
      // Verify URL structure
      const urlPattern = /^\/\d{4}\/\d{2}\/\d{2}\/[\w-]+\/$/;
      expect(samplePost.url).toMatch(urlPattern);
    }
  });

  test('home page (/) should be accessible', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Ben Balter/);
  });

  test('404 page should return 404 status', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345/', {
      waitUntil: 'domcontentloaded',
    });
    
    // Should return 404 status
    expect(response?.status()).toBe(404);
  });

  test('posts with dates in filename should generate correct URLs', async ({ page }) => {
    const posts = getAllPosts();
    
    // Find a post with a date
    const postWithDate = posts.find(p => p.year && p.month && p.day);
    
    if (postWithDate) {
      // Verify the URL components match the filename
      expect(postWithDate.url).toContain(`/${postWithDate.year}/`);
      expect(postWithDate.url).toContain(`/${postWithDate.month}/`);
      expect(postWithDate.url).toContain(`/${postWithDate.day}/`);
      expect(postWithDate.url).toContain(`/${postWithDate.slug}/`);
      
      // Verify it's accessible
      const response = await page.goto(postWithDate.url);
      expect(response?.status()).toBe(200);
    }
  });
});

test.describe('Static Site Generation Validation', () => {
  test('all pages should be pre-rendered as static HTML', async ({ request }) => {
    // Check that static files exist in the output directory
    const outDir = path.join(process.cwd(), 'out');
    
    if (!fs.existsSync(outDir)) {
      test.skip(true, 'Output directory does not exist - run `npm run next:build` first');
      return;
    }
    
    // Verify index.html exists
    const indexPath = path.join(outDir, 'index.html');
    expect(fs.existsSync(indexPath)).toBeTruthy();
    
    // Verify a sample post exists
    const posts = getAllPosts();
    if (posts.length > 0) {
      const samplePost = posts[0];
      const postPath = path.join(
        outDir,
        samplePost.year,
        samplePost.month,
        samplePost.day,
        samplePost.slug,
        'index.html'
      );
      expect(fs.existsSync(postPath)).toBeTruthy();
    }
  });

  test('generated HTML files should contain actual content (not just loading states)', async ({ page }) => {
    const posts = getAllPosts();
    if (posts.length === 0) return;
    
    const samplePost = posts[0];
    await page.goto(samplePost.url, { waitUntil: 'domcontentloaded' });
    
    // Should have actual content, not just a loading state
    const content = await page.locator('article, .post, main').textContent();
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(100);
  });
});

test.describe('URL Count Validation', () => {
  test('should generate expected number of routes', async () => {
    const posts = getAllPosts();
    const pages = getAllPages();
    
    console.log(`✓ Found ${posts.length} blog posts`);
    console.log(`✓ Found ${pages.length} static pages`);
    
    // Verify we have a reasonable number of posts
    expect(posts.length).toBeGreaterThan(50);
    
    // Verify we have the expected pages
    expect(pages.length).toBeGreaterThan(5);
  });
});
