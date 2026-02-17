import { test, expect } from '@playwright/test';
import { 
  checkCommonElements, 
  checkNavigation, 
  checkFooter,
  waitForPageReady 
} from './helpers';

test.describe('Resume LinkedIn Format Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resume/linkedin/');
    await waitForPageReady(page);
  });

  test('should load successfully', async ({ page }) => {
    await checkCommonElements(page);
  });

  test('should have LinkedIn format in title', async ({ page }) => {
    await expect(page).toHaveTitle(/linkedin format/i);
  });

  test('should have navigation and footer', async ({ page }) => {
    await checkNavigation(page);
    await checkFooter(page);
  });

  test('should have noindex meta tag', async ({ page }) => {
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', /noindex/);
  });

  test('should display experience section with LinkedIn fields', async ({ page }) => {
    const pageText = await page.textContent('body');
    
    // Check for experience section
    expect(pageText).toContain('Experience');
    
    // Check for LinkedIn-specific field labels
    expect(pageText).toMatch(/TITLE|Title/);
    expect(pageText).toMatch(/COMPANY|Company/);
    expect(pageText).toMatch(/START DATE|Start date/);
    expect(pageText).toMatch(/END DATE|End date/);
    expect(pageText).toMatch(/DESCRIPTION|Description/);
    
    // Check for actual resume content
    expect(pageText).toContain('GitHub');
  });

  test('should display education section', async ({ page }) => {
    const pageText = await page.textContent('body');
    
    expect(pageText).toContain('Education');
    expect(pageText).toMatch(/SCHOOL|School/);
    expect(pageText).toMatch(/DEGREE|Degree/);
  });

  test('should display certifications section', async ({ page }) => {
    const pageText = await page.textContent('body');
    
    expect(pageText).toContain('Certifications');
    expect(pageText).toMatch(/ISSUING ORGANIZATION|Issuing organization/);
  });

  test('should have copy buttons', async ({ page }) => {
    const copyButtons = page.locator('.copy-btn');
    const count = await copyButtons.count();
    
    // Should have multiple copy buttons (one per field)
    expect(count).toBeGreaterThan(10);
  });

  test('should be linked from main resume page', async ({ page }) => {
    await page.goto('/resume/');
    await waitForPageReady(page);
    
    const linkedInLink = page.locator('a[href="/resume/linkedin/"]');
    await expect(linkedInLink).toBeVisible();
  });
});
