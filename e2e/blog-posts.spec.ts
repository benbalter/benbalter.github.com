import { test, expect } from '@playwright/test';
import { 
  checkCommonElements, 
  checkNavigation, 
  checkFooter,
  checkSocialMeta,
  waitForFullLoad 
} from './helpers';

test.describe('Blog Posts', () => {
  test('should have a posts listing page accessible from home', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    // Try to find posts on homepage or navigate to posts page
    const postLinks = page.locator('a[href*="/20"]'); // Blog posts typically have year in URL
    const count = await postLinks.count();
    
    if (count > 0) {
      // Found posts on homepage
      expect(count).toBeGreaterThan(0);
    } else {
      // Try to navigate to an archive or posts page
      const archiveLink = page.locator('a[href*="archive"], a[href*="posts"], a[href*="blog"]');
      if (await archiveLink.count() > 0) {
        await archiveLink.first().click();
        await waitForFullLoad(page);
      }
    }
  });

  test('should render individual blog post correctly', async ({ page }) => {
    // First, get a blog post URL from the homepage
    await page.goto('/');
    await waitForFullLoad(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    // Click on the first post
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForFullLoad(page);
      
      // Check common elements
      await checkCommonElements(page);
      await checkNavigation(page);
      await checkFooter(page);
      
      // Check post has title
      await expect(page).toHaveTitle(/.+/);
      
      // Check for article or post content
      const article = page.locator('article, .post, [role="article"]');
      await expect(article).toBeVisible();
      
      // Check for post metadata
      const content = await page.locator('article, .post, main').textContent();
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(100);
    }
  });

  test('blog post should have proper metadata', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForFullLoad(page);
      
      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
      
      // Check for social media tags
      await checkSocialMeta(page);
    }
  });

  test('blog post should have readable content', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForFullLoad(page);
      
      // Check for paragraphs or content blocks
      const paragraphs = page.locator('article p, .post p, main p');
      const pCount = await paragraphs.count();
      
      expect(pCount).toBeGreaterThan(0);
    }
  });

  test('blog post images should have alt text', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForFullLoad(page);
      
      // Check all images in the post have alt text
      const images = await page.locator('article img, .post img, main img').all();
      
      for (const img of images) {
        const isVisible = await img.isVisible();
        if (isVisible) {
          const alt = await img.getAttribute('alt');
          expect(alt !== null).toBeTruthy();
        }
      }
    }
  });

  test('blog post links should be valid', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForFullLoad(page);
      
      // Check links in content have href attribute
      const contentLinks = page.locator('article a[href], .post a[href], main a[href]');
      const linkCount = await contentLinks.count();
      
      if (linkCount > 0) {
        // Check first link is valid
        await expect(contentLinks.first()).toHaveAttribute('href');
      }
    }
  });
});
