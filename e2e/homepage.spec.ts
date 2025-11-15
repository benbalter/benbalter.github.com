import { test, expect } from '@playwright/test';
import { 
  checkCommonElements, 
  checkNavigation, 
  checkFooter,
  checkResponsiveMeta,
  checkSocialMeta,
  waitForFullLoad 
} from './helpers';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await checkCommonElements(page);
  });

  test('should have correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Ben Balter/);
  });

  test('should have navigation', async ({ page }) => {
    await checkNavigation(page);
  });

  test('should have footer', async ({ page }) => {
    await checkFooter(page);
  });

  test('should have responsive meta tags', async ({ page }) => {
    await checkResponsiveMeta(page);
  });

  test('should have social media meta tags', async ({ page }) => {
    await checkSocialMeta(page);
  });

  test('should display blog posts', async ({ page }) => {
    // Check for post listings or content
    // Posts are displayed in rows with links
    const postLinks = page.locator('a[href*="/20"]'); // Blog posts have year in URL
    const count = await postLinks.count();
    
    // Should have at least some blog post links
    expect(count).toBeGreaterThan(0);
  });

  test('should have working links in navigation', async ({ page }) => {
    const navLinks = page.locator('nav a[href], header a[href]');
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Check first few links are valid
    const firstLink = navLinks.first();
    await expect(firstLink).toHaveAttribute('href');
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Skip on desktop browsers
      test.skip();
    }
    
    // Page should be usable on mobile
    await checkCommonElements(page);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have valid semantic HTML', async ({ page }) => {
    // Check for semantic HTML5 elements
    const header = page.locator('header');
    const main = page.locator('main');
    const footer = page.locator('footer');
    
    await expect(header).toHaveCount(1);
    await expect(main).toHaveCount(1);
    await expect(footer).toHaveCount(1);
  });

  test('should have charset meta tag', async ({ page }) => {
    const charset = page.locator('meta[charset]');
    await expect(charset).toHaveCount(1);
  });
});
