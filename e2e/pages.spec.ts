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
    { url: '/other-recommended-reading', name: 'Other Recommended Reading' },
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

test.describe('Other Recommended Reading Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/other-recommended-reading');
    await waitForPageReady(page);
  });

  test('should display book recommendations', async ({ page }) => {
    const content = await page.textContent('body');
    
    // Should contain book-related content
    const hasBookContent = 
      content?.includes('book') ||
      content?.includes('reading') ||
      content?.includes('recommend');
    
    expect(hasBookContent).toBeTruthy();
  });

  test('should have book categories', async ({ page }) => {
    // Check for some expected category headings
    const categories = page.locator('h3');
    const count = await categories.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have Amazon affiliate links', async ({ page }) => {
    // Check for Amazon links with affiliate tag
    const amazonLinks = page.locator('a[href*="amazon.com"]');
    const count = await amazonLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Verify affiliate tag is present
    const firstLink = amazonLinks.first();
    const href = await firstLink.getAttribute('href');
    expect(href).toContain('tag=benbalter07-20');
  });

  test('should display book images', async ({ page }) => {
    const bookImages = page.locator('img[alt]');
    const count = await bookImages.count();
    
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Other Recommended Reading Redirects', () => {
  const oldUrls = [
    '/books',
    '/books-for-geeks',
    '/recommended-reading',
  ];

  oldUrls.forEach((url) => {
    test(`should redirect from ${url} to /other-recommended-reading`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Should be redirected to the new URL
      expect(page.url()).toContain('/other-recommended-reading');
    });
  });
});
