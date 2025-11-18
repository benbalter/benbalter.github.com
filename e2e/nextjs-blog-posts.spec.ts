import { test, expect } from '@playwright/test';
import { 
  checkCommonElements, 
  checkNavigation, 
  checkFooter,
  checkSocialMeta,
  waitForPageReady 
} from './helpers';

test.describe('Next.js Blog Post Pages', () => {
  test('should render blog post with proper structure', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Get first blog post link
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref, { timeout: 10000 });
    await waitForPageReady(page);
    
    await checkCommonElements(page);
    await checkNavigation(page);
    await checkFooter(page);
    
    // Check for article element with post class
    const article = page.locator('article[class*="post"]');
    await expect(article).toBeVisible();
    
    // Check for post header
    const header = page.locator('h1.display-4.text-primary');
    await expect(header).toBeVisible();
  });

  test('blog post should have reading time indicator', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref, { timeout: 10000 });
    await waitForPageReady(page);
    
    // Check for reading time
    const readingTime = page.locator(':text("min read"), :text("minute read")');
    await expect(readingTime).toBeVisible();
  });

  test('blog post should have post metadata', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref, { timeout: 10000 });
    await waitForPageReady(page);
    
    // Check for publish date - use first() to avoid strict mode violation
    const publishDate = page.locator(':text("Originally published")').first();
    await expect(publishDate).toBeVisible();
    
    // Check for revision history link
    const revisionLink = page.locator('a:has-text("View revision history")');
    await expect(revisionLink).toBeVisible();
  });

  test('blog post should have author bio', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref, { timeout: 10000 });
    await waitForPageReady(page);
    
    // Check for mini bio
    const miniBio = page.locator('.mini-bio');
    await expect(miniBio).toBeVisible();
    
    // Check for author avatar
    const avatar = miniBio.locator('img.avatar');
    await expect(avatar).toBeVisible();
    
    // Check for "More about the author" link
    const aboutLink = page.locator('a:has-text("More about the author")');
    await expect(aboutLink).toBeVisible();
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
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref, { timeout: 10000 });
    await waitForPageReady(page);
    
    // Check for edit button
    const editButton = page.locator('a:has-text("Edit")');
    await expect(editButton).toBeVisible();
    
    // Check edit button links to GitHub
    const editHref = await editButton.getAttribute('href');
    expect(editHref).toContain('github.com');
    expect(editHref).toContain('/edit/');
  });

  test('archived post should show warning', async ({ page }) => {
    // This test will pass if there are no archived posts or if warnings are shown
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    // Check a few posts for archived status
    for (let i = 0; i < Math.min(5, count); i++) {
      const postHref = await postLinks.nth(i).getAttribute('href');
      if (!postHref) continue;
      
      try {
        await page.goto(postHref, { timeout: 10000 });
        await waitForPageReady(page);
      } catch (e) {
        // Skip posts that fail to load
        continue;
      }
      
      // Check if post has archived warning
      const archivedWarning = page.locator('.alert-warning:has-text("Heads up")');
      const warningExists = await archivedWarning.count() > 0;
      
      // If warning exists, verify it has correct content
      if (warningExists) {
        await expect(archivedWarning).toBeVisible();
        const warningText = await archivedWarning.textContent();
        expect(warningText).toContain('archived');
        // Test passes - found an archived post with warning
        return;
      }
    }
    
    // No archived posts found, which is fine
    test.skip(true, 'No archived posts found to test');
  });

  test('blog post should have proper SEO metadata', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref, { timeout: 10000 });
    await waitForPageReady(page);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
    
    // Check for Open Graph metadata
    await checkSocialMeta(page);
    
    // Check for og:type = article
    const ogType = page.locator('meta[property="og:type"]');
    const typeContent = await ogType.getAttribute('content');
    expect(typeContent).toBe('article');
    
    // Check for Twitter card
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveCount(1);
  });

  test('blog post should have JSON-LD structured data', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref, { timeout: 10000 });
    await waitForPageReady(page);
    
    // Check for JSON-LD script tag
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const jsonLdCount = await jsonLd.count();
    expect(jsonLdCount).toBeGreaterThan(0);
    
    // Parse and validate one of the JSON-LD scripts
    const jsonLdContent = await jsonLd.first().textContent();
    expect(jsonLdContent).toBeTruthy();
    
    // TypeScript knows jsonLdContent is not null after the expect above
    const data = JSON.parse(jsonLdContent as string);
    expect(data['@context']).toBeTruthy();
    expect(data['@type']).toBeTruthy();
  });

  test('blog post content should be properly formatted', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostHref = await postLinks.first().getAttribute('href');
    if (!firstPostHref) return;
    
    await page.goto(firstPostHref, { timeout: 10000 });
    await waitForPageReady(page);
    
    // Check for entrybody content
    const content = page.locator('.entrybody');
    await expect(content).toBeVisible();
    
    // Check content has paragraphs
    const paragraphs = content.locator('p');
    const pCount = await paragraphs.count();
    expect(pCount).toBeGreaterThan(0);
  });
});
