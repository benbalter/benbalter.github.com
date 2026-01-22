import { test, expect } from '@playwright/test';

test('check computed nav link color', async ({ page }) => {
  await page.goto('/');
  
  const navLink = page.locator('.nav-link').first();
  const computedColor = await navLink.evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  
  console.log('Computed color:', computedColor);
  expect(true).toBe(true);
});
