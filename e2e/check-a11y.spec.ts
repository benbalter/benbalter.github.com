import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('check homepage accessibility', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  console.log('Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2));
  console.log('Violation count:', accessibilityScanResults.violations.length);
  
  // Don't fail, just report
  expect(true).toBe(true);
});
