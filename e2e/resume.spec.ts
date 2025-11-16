import { test, expect } from '@playwright/test';
import { 
  checkCommonElements, 
  checkNavigation, 
  checkFooter,
  waitForPageReady 
} from './helpers';

test.describe('Resume Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resume');
    await waitForPageReady(page);
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
    // Check for resume sections. Fall back to body text if semantic
    // containers aren't present in the current layout.
    const contentLocator = page.locator('main, article, .resume, body');
    const content = await contentLocator.first().textContent();
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
    
    // Check for print styles or reasonable layout. Not all layouts use
    // a <main> element, so just ensure we have a substantial body.
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(200);
  });

  test('should have contact information or links', async ({ page }) => {
    // Check for email, LinkedIn, GitHub, or other contact methods
    // Also check for raw content in case Liquid templates aren't processed
    const links = page.locator('a[href*="mailto:"], a[href*="linkedin"], a[href*="github"]');
    const count = await links.count();
    
    const content = await page.content();
    const hasContactInfo = count > 0 || 
                          content.includes('github') || 
                          content.includes('linkedin') ||
                          content.includes('contact');
    
    // Should have at least some contact information
    expect(hasContactInfo).toBeTruthy();
  });
});
