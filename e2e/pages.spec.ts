import { test, expect } from '@playwright/test';
import { 
  checkCommonElements, 
  checkNavigation, 
  checkFooter,
  waitForPageReady 
} from './helpers';

test.describe('Static Pages', () => {
  const pages = [
    { url: '/about', name: 'About' },
    { url: '/contact', name: 'Contact' },
    { url: '/talks', name: 'Talks' },
  ];

  pages.forEach(({ url, name }) => {
    test.describe(name, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await waitForPageReady(page);
      });

      test('should load successfully', async ({ page }) => {
        await checkCommonElements(page);
      });

      test('should have navigation and footer', async ({ page }) => {
        await checkNavigation(page);
        await checkFooter(page);
      });

      test('should have meaningful content', async ({ page }) => {
        const content = await page.locator('main, article, .content').textContent();
        expect(content).toBeTruthy();
        expect(content!.length).toBeGreaterThan(50);
      });

      test('should have proper title', async ({ page }) => {
        await expect(page).toHaveTitle(/.+/);
      });
    });
  });
});

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
    await waitForPageReady(page);
  });

  test('should contain bio information', async ({ page }) => {
    const content = await page.textContent('body');
    
    // Should contain some bio-related content
    const hasBioContent = 
      content?.includes('work') ||
      content?.includes('developer') ||
      content?.includes('engineer') ||
      content?.includes('open source');
    
    expect(hasBioContent).toBeTruthy();
  });

  test('should have social links', async ({ page }) => {
    const socialLinks = page.locator('a[href*="twitter"], a[href*="github"], a[href*="linkedin"]');
    const count = await socialLinks.count();
    
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Contact Page', () => {
  test('should have contact information or form', async ({ page }) => {
    await page.goto('/contact');
    await waitForPageReady(page);
    
    // Check for email link or contact form
    const emailLink = page.locator('a[href^="mailto:"]');
    const contactForm = page.locator('form');
    
    const hasEmail = await emailLink.count() > 0;
    const hasForm = await contactForm.count() > 0;
    
    expect(hasEmail || hasForm).toBeTruthy();
  });
});

test.describe('Talks Page', () => {
  test('should list talks or presentations', async ({ page }) => {
    await page.goto('/talks');
    await waitForPageReady(page);
    
    const content = await page.textContent('body');
    
    // Should contain talk-related content
    const hasTalkContent = 
      content?.includes('talk') ||
      content?.includes('presentation') ||
      content?.includes('conference') ||
      content?.includes('speak');
    
    expect(hasTalkContent).toBeTruthy();
  });
});
