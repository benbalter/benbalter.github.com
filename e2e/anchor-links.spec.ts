import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

test.describe('Header Anchor Links', () => {
  test('blog post headings should have anchor links', async ({ page }) => {
    // Navigate to a blog post with headings
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    // Check that h2 headings have anchor links with .anchor-link class
    const h2WithAnchors = page.locator('h2 a.anchor-link');
    const count = await h2WithAnchors.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Check the first anchor link has correct structure
    const firstAnchor = h2WithAnchors.first();
    await expect(firstAnchor).toHaveAttribute('href');
    
    // Check the anchor contains the icon
    const anchorIcon = firstAnchor.locator('.anchor-icon');
    await expect(anchorIcon).toHaveText('#');
  });

  test('anchor links should be functional', async ({ page }) => {
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    // Anchor links have .anchor-link class
    const firstAnchor = page.locator('h2 a.anchor-link').first();
    const href = await firstAnchor.getAttribute('href');
    
    expect(href).toBeTruthy();
    expect(href).toMatch(/^#/); // Should be a fragment identifier
    
    // Click the anchor link
    await firstAnchor.click();
    
    // Verify the URL contains the fragment
    await expect(page).toHaveURL(new RegExp(href!));
  });

  test('h3 headings should also have anchor links', async ({ page }) => {
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    // Check h3 headings have anchor links
    const h3WithAnchors = page.locator('h3 a.anchor-link');
    const count = await h3WithAnchors.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('anchor links are hidden from assistive tech and the tab order', async ({ page }) => {
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);

    // The "#" permalink is for mouse users. Announced inside the heading, it
    // made every heading's name end in "Link to this section" and added a tab
    // stop per section; keyboard and screen-reader users use the TOC instead.
    const anchors = page.locator('h2 a.anchor-link, h3 a.anchor-link, h4 a.anchor-link');
    const count = await anchors.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(3, count); i++) {
      await expect(anchors.nth(i)).toHaveAttribute('aria-hidden', 'true');
      await expect(anchors.nth(i)).toHaveAttribute('tabindex', '-1');
    }

    // The heading's accessible name is just its text.
    const heading = page.locator('h2:has(a.anchor-link)').first();
    const text = (await heading.evaluate((el) => el.firstChild?.textContent ?? '')).trim();
    await expect(page.getByRole('heading', { level: 2, name: text, exact: true })).toHaveCount(1);
  });
});
