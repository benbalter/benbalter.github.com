import { test, expect } from '@playwright/test';
import { 
  checkCommonElements, 
  checkNavigation, 
  checkFooter,
  waitForPageReady 
} from './helpers';

test.describe('Next.js Static Pages', () => {
  test('homepage should render with static generation', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check common elements
    await checkCommonElements(page);
    await checkNavigation(page);
    await checkFooter(page);
    
    // Check for hero image (use first() to avoid strict mode violation)
    const hero = page.locator('.hero-unit').first();
    await expect(hero).toBeVisible();
    
    // Check for posts list
    const postRows = page.locator('.row.mb-2');
    const count = await postRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('about page should render correctly', async ({ page }) => {
    await page.goto('/about/');
    await waitForPageReady(page);
    
    await checkCommonElements(page);
    await checkNavigation(page);
    await checkFooter(page);
    
    // Check for page content (use first() to avoid strict mode violation)
    const content = page.locator('.page-about, main, [role="main"]').first();
    await expect(content).toBeVisible();
    
    // Check for heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('resume page should render correctly', async ({ page }) => {
    await page.goto('/resume/');
    await waitForPageReady(page);
    
    await checkCommonElements(page);
    await checkNavigation(page);
    await checkFooter(page);
    
    // Check for resume content (use first() to avoid strict mode violation)
    const content = page.locator('.page-resume, main, [role="main"]').first();
    await expect(content).toBeVisible();
  });

  test('contact page should render correctly', async ({ page }) => {
    await page.goto('/contact/');
    await waitForPageReady(page);
    
    await checkCommonElements(page);
    await checkNavigation(page);
    await checkFooter(page);
    
    // Check for contact content (use first() to avoid strict mode violation)
    const content = page.locator('.page-contact, main, [role="main"]').first();
    await expect(content).toBeVisible();
  });

  test('static pages should have proper HTML structure', async ({ page }) => {
    const pages = ['/', '/about/', '/resume/', '/contact/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await waitForPageReady(page);
      
      // Check HTML lang attribute
      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', 'en-US');
      
      // Check meta charset
      const charset = page.locator('meta[charset]');
      await expect(charset).toHaveCount(1);
      
      // Check viewport meta
      const viewport = page.locator('meta[name="viewport"]');
      await expect(viewport).toHaveCount(1);
      
      // Check main content area
      const main = page.locator('main, [role="main"]');
      await expect(main).toHaveCount(1);
    }
  });

  test('pages should load Bootstrap styles', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for Bootstrap container
    const container = page.locator('.container');
    await expect(container).toBeVisible();
    
    // Check for Bootstrap navbar
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
    
    // Check navbar has Bootstrap classes
    const navbarClasses = await navbar.getAttribute('class');
    expect(navbarClasses).toContain('navbar');
  });

  test('navigation should work between pages', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Click on About link
    const aboutLink = page.locator('nav a:has-text("About"), a:has-text("About")').first();
    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await waitForPageReady(page);
      
      // Verify we're on the about page (check URL only)
      const url = page.url();
      expect(url).toContain('/about');
      
      // Check content loaded
      await checkCommonElements(page);
    }
  });

  test('footer links should be functional', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check footer exists (look for footer component or footer-like nav)
    const footer = page.locator('footer, nav:has-text("Atom Feed")').first();
    await expect(footer).toBeVisible();
    
    // Check footer has links
    const footerLinks = footer.locator('a[href]');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('pages should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check mobile menu toggle exists
    const toggle = page.locator('.navbar-toggler, button[data-bs-toggle="collapse"]');
    await expect(toggle).toBeVisible();
    
    // Check content is visible
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();
  });
});
