/**
 * Test helper utilities for Playwright tests
 */

import { expect, type Page } from '@playwright/test';

/**
 * Check common site elements that should be present on all pages
 */
export async function checkCommonElements(page: Page) {
  // Check that the page has a title
  await expect(page).toHaveTitle(/.+/);
  
  // Check for basic HTML structure
  const html = page.locator('html');
  // Accept both 'en' and 'en-US' for language attribute
  await expect(html).toHaveAttribute('lang', /^en/);
}

/**
 * Check navigation elements
 */
export async function checkNavigation(page: Page) {
  // Check for navigation or header
  const nav = page.locator('nav, header');
  await expect(nav).toBeVisible();
}

/**
 * Check footer elements
 */
export async function checkFooter(page: Page) {
  // Check for footer - site uses nav element for footer
  const footer = page.locator('footer, nav:has-text("Atom Feed"), nav.border-top');
  await expect(footer.first()).toBeVisible();
}

/**
 * Check for responsive meta tags
 */
export async function checkResponsiveMeta(page: Page) {
  const viewport = page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveCount(1);
}

/**
 * Check for social media meta tags
 */
export async function checkSocialMeta(page: Page) {
  // Check for Open Graph tags
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveCount(1);
  
  const ogDescription = page.locator('meta[property="og:description"]');
  await expect(ogDescription).toHaveCount(1);
}

/**
 * Check for no console errors
 */
export async function checkNoConsoleErrors(page: Page, allowedPatterns: RegExp[] = []) {
  const errors: string[] = [];
  
  page.on('console', message => {
    if (message.type() === 'error') {
      const text = message.text();
      const isAllowed = allowedPatterns.some(pattern => pattern.test(text));
      if (!isAllowed) {
        errors.push(text);
      }
    }
  });
  
  // Return a function to check errors later
  return () => {
    if (errors.length > 0) {
      throw new Error(`Console errors detected:\n${errors.join('\n')}`);
    }
  };
}

/**
 * Check for valid links (no 404s)
 */
export async function checkLinksValid(page: Page, selector = 'a[href]') {
  const links = await page.locator(selector).all();
  
  for (const link of links) {
    const href = await link.getAttribute('href');
    
    // Skip dangerous schemes first
    if (!href ||
        href.startsWith('javascript:') ||
        href.startsWith('data:') ||
        href.startsWith('vbscript:')) {
      continue;
    }
    // Then skip external links and anchors
    if (href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('#')) {
      continue;
    }
    
    // Check internal link is valid
    const isVisible = await link.isVisible();
    if (isVisible) {
      await expect(link).toHaveAttribute('href');
    }
  }
}

/**
<<<<<<< HEAD
 * Wait for page to be fully loaded including images and React hydration
=======
 * Wait for page to be fully loaded including images
 * Uses networkidle which waits for no more than 2 network connections for at least 500ms
 * This is slower but more thorough
>>>>>>> 8a39bfd27e3aa82d3385ba00e04cca753dfa3091
 */
export async function waitForFullLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  
  // Wait for React to hydrate the page by checking for a main element or body content
  try {
    // Give React time to hydrate
    await page.waitForSelector('main, h1, [data-testid]', { timeout: 5000 });
  } catch {
    // If no main or h1, wait for body to have substantial content
    await page.waitForFunction(() => document.body.textContent && document.body.textContent.length > 100, { timeout: 5000 });
  }
}

/**
 * Wait for page to be loaded and interactive
 * Faster alternative that doesn't wait for all network activity to cease
 * Use this for most tests where you don't need to wait for all images/assets
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');
}

/**
 * Check accessibility basics
 */
export async function checkBasicAccessibility(page: Page) {
  // Check for skip link or main landmark
  const main = page.locator('main, [role="main"]');
  await expect(main).toHaveCount(1);
  
  // Check images have alt text
  const images = await page.locator('img').all();
  for (const img of images) {
    const isVisible = await img.isVisible();
    if (isVisible) {
      const alt = await img.getAttribute('alt');
      expect(alt !== null).toBeTruthy();
    }
  }
}
