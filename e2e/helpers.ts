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
  await expect(html).toHaveAttribute('lang', /^en(-|$)/);
}

/**
 * Check navigation elements
 */
export async function checkNavigation(page: Page) {
  // Check for navigation or header (use .first() to avoid strict mode when multiple matches)
  const nav = page.locator('nav, header');
  await expect(nav.first()).toBeVisible();
}

/**
 * Check footer elements
 */
export async function checkFooter(page: Page) {
  // Check for footer - site uses nav element containing ul.border-top for footer
  const footer = page.locator('footer, nav:has(ul.border-top)');
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
 * Wait for page to be fully loaded including images
 * Uses networkidle which waits for no more than 2 network connections for at least 500ms
 * This is slower but more thorough
 */
export async function waitForFullLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
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

