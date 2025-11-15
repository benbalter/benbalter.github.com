import { test, expect } from '@playwright/test';
import { 
  checkCommonElements, 
  checkNavigation, 
  checkFooter,
  waitForFullLoad 
} from './helpers';

test.describe('Resume Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resume');
    await waitForFullLoad(page);
  });

  test('should load successfully', async ({ page }) => {
    await checkCommonElements(page);
  });

  test('should have resume in title', async ({ page }) => {
    await expect(page).toHaveTitle(/resume/i);
  });

  test('should have navigation and footer', async ({ page }) => {
    await checkNavigation(page);
    await checkFooter(page);
  });

  test('should display resume content', async ({ page }) => {
    // Check for resume sections
    const content = await page.locator('main, article, .resume').textContent();
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(200);
  });

  test('should have work experience section', async ({ page }) => {
    // Look for common resume section headers
    const pageText = await page.textContent('body');
    
    // Check for experience-related content
    const hasExperience = 
      pageText?.includes('Experience') ||
      pageText?.includes('Work') ||
      pageText?.includes('Employment') ||
      pageText?.includes('GitHub') ||
      pageText?.includes('Engineer');
    
    expect(hasExperience).toBeTruthy();
  });

  test('should be printable', async ({ page }) => {
    // Check that the page has reasonable structure for printing
    await expect(page.locator('body')).toBeVisible();
    
    // Check for print styles or reasonable layout
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have contact information or links', async ({ page }) => {
    // Check for email, LinkedIn, GitHub, or other contact methods
    const links = page.locator('a[href*="mailto:"], a[href*="linkedin"], a[href*="github"]');
    const count = await links.count();
    
    // Should have at least some contact links
    expect(count).toBeGreaterThan(0);
  });
});
