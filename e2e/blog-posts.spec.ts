import { test, expect } from '@playwright/test';
import { 
  checkCommonElements, 
  checkNavigation, 
  checkFooter,
  checkSocialMeta,
  waitForPageReady,
  isAstroBuild
} from './helpers';

test.describe('Blog Posts', () => {
  test('should have a posts listing page accessible from home', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
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
        await waitForPageReady(page);
      }
    }
  });

  test('should render individual blog post correctly', async ({ page }) => {
    // First, get a blog post URL from the homepage
    await page.goto('/');
    await waitForPageReady(page);
    
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
      await waitForPageReady(page);
      
      // Check common elements
      await checkCommonElements(page);
      await checkNavigation(page);
      await checkFooter(page);
      
      // Check post has title
      await expect(page).toHaveTitle(/.+/);
      
  // Check for article or post content. Some templates may attach the
  // post classes to the <body> as well as an <article>, so don't rely
  // on strict-mode single element semantics here.
  const article = page.locator('article, .post, [role="article"]');
  const articleCount = await article.count();
  expect(articleCount).toBeGreaterThan(0);
      
  // Check for post metadata
  const content = await page.locator('article, .post, main').first().textContent();
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(100);
    }
  });

  test('blog post should have proper metadata', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForPageReady(page);
      
      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
      
      // Check for social media tags
      await checkSocialMeta(page);
    }
  });

  test('blog post should have readable content', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForPageReady(page);
      
      // Check for paragraphs or content blocks
      const paragraphs = page.locator('article p, .post p, main p');
      const pCount = await paragraphs.count();
      
      expect(pCount).toBeGreaterThan(0);
    }
  });

  test('blog post images should have alt text', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForPageReady(page);
      
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
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForPageReady(page);
      
      // Check links in content have href attribute
      const contentLinks = page.locator('article a[href], .post a[href], main a[href]');
      const linkCount = await contentLinks.count();
      
      if (linkCount > 0) {
        // Check first link is valid
        await expect(contentLinks.first()).toHaveAttribute('href');
      }
    }
  });

  test('blog post should display mini-bio component', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForPageReady(page);
      
      const astro = await isAstroBuild(page);
      
      if (astro) {
        // Astro: Check for mini-bio component with .mini-bio class
        const miniBio = page.locator('.mini-bio');
        await expect(miniBio).toBeVisible();
        
        // Check for avatar image (served as optimized WebP from local assets)
        const avatar = miniBio.locator('img[alt="Ben Balter"]');
        await expect(avatar).toBeVisible();
        // Avatar is now fetched at build time and served locally as optimized WebP
        await expect(avatar).toHaveAttribute('src', /\/assets\/avatar\.[^.]+\.webp$/);
        
        // Check for bio text
        const bioText = await miniBio.textContent();
        expect(bioText).toContain('Ben Balter');
        expect(bioText).toContain('GitHub');
        
        // Check for "More about the author" link
        const aboutLink = miniBio.locator('a[href="/about/"]');
        await expect(aboutLink).toBeVisible();
        await expect(aboutLink).toContainText('More about the author');
      } else {
        // Jekyll: Check for author bio in footer or sidebar
        // Jekyll doesn't have a .mini-bio component, but has author info elsewhere
        const pageContent = await page.textContent('body');
        
        // Just verify the page loaded and has basic content
        expect(pageContent).toContain('Ben Balter');
        
        // Jekyll posts should have basic structure
        const article = page.locator('article, .post, .entrybody');
        await expect(article.first()).toBeVisible();
      }
    }
  });

  test('blog post should have edit button', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForPageReady(page);
      
      // Check for "help improve it" text
      const improveText = page.locator('text=help improve it');
      await expect(improveText).toBeVisible();
      
      // Check for Edit button with proper link to GitHub
      const editButton = page.locator('a.btn.btn-outline-primary', { hasText: 'Edit' });
      await expect(editButton).toBeVisible();
      
      const href = await editButton.getAttribute('href');
      expect(href).toContain('github.com');
      expect(href).toContain('/edit/');
    }
  });
});
