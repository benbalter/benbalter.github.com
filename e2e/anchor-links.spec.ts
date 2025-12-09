import { test, expect } from '@playwright/test';
import { waitForPageReady, isAstroBuild } from './helpers';

test.describe('Header Anchor Links', () => {
  test('blog post headings should have anchor links', async ({ page }) => {
    // Navigate to a blog post with headings
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    const astro = await isAstroBuild(page);
    
    if (astro) {
      // Astro: Check that h2 headings have anchor links with .anchor-link class
      const h2WithAnchors = page.locator('h2 a.anchor-link');
      const count = await h2WithAnchors.count();
      
      expect(count).toBeGreaterThan(0);
      
      // Check the first anchor link has correct structure
      const firstAnchor = h2WithAnchors.first();
      await expect(firstAnchor).toHaveAttribute('href');
      await expect(firstAnchor).toHaveAttribute('aria-label', 'Link to this section');
      
      // Check the anchor contains the icon
      const anchorIcon = firstAnchor.locator('.anchor-icon');
      await expect(anchorIcon).toHaveText('#');
    } else {
      // Jekyll: Headings have IDs but may not have visible anchor links
      // Check that h2 headings have IDs for linking
      const h2WithIds = page.locator('h2[id]');
      const count = await h2WithIds.count();
      
      // Should have at least some headings with IDs
      expect(count).toBeGreaterThan(0);
      
      // Verify IDs are valid (not empty)
      const firstId = await h2WithIds.first().getAttribute('id');
      expect(firstId).toBeTruthy();
      expect(firstId?.length).toBeGreaterThan(0);
    }
  });

  test('anchor links should be functional', async ({ page }) => {
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    const astro = await isAstroBuild(page);
    
    if (astro) {
      // Astro: anchor links have .anchor-link class
      const firstAnchor = page.locator('h2 a.anchor-link').first();
      const href = await firstAnchor.getAttribute('href');
      
      expect(href).toBeTruthy();
      expect(href).toMatch(/^#/); // Should be a fragment identifier
      
      // Click the anchor link
      await firstAnchor.click();
      
      // Verify the URL contains the fragment
      await expect(page).toHaveURL(new RegExp(href!));
    } else {
      // Jekyll: Headings have IDs, test by navigating with hash
      const firstH2 = page.locator('h2[id]').first();
      const id = await firstH2.getAttribute('id');
      
      if (id) {
        // Navigate to the heading with hash
        await page.goto(`/2014/10/07/expose-process-through-urls/#${id}`);
        
        // Verify the URL contains the fragment
        expect(page.url()).toContain(`#${id}`);
      }
    }
  });

  test('h3 headings should also have anchor links', async ({ page }) => {
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    const astro = await isAstroBuild(page);
    
    if (astro) {
      // Astro: Check h3 headings have anchor links
      const h3WithAnchors = page.locator('h3 a.anchor-link');
      const count = await h3WithAnchors.count();
      
      expect(count).toBeGreaterThan(0);
    } else {
      // Jekyll: Check h3 headings have IDs
      const h3WithIds = page.locator('h3[id]');
      const count = await h3WithIds.count();
      
      // Should have at least some headings with IDs
      expect(count).toBeGreaterThan(0);
    }
  });

  test('anchor links should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/2014/10/07/expose-process-through-urls/');
    await waitForPageReady(page);
    
    const astro = await isAstroBuild(page);
    
    if (astro) {
      // Astro: Check all anchor links have aria-label
      const allAnchors = page.locator('h2 a.anchor-link, h3 a.anchor-link, h4 a.anchor-link');
      const count = await allAnchors.count();
      
      if (count > 0) {
        // Check first few anchors have proper aria-label
        for (let i = 0; i < Math.min(3, count); i++) {
          const anchor = allAnchors.nth(i);
          await expect(anchor).toHaveAttribute('aria-label', 'Link to this section');
        }
      }
    } else {
      // Jekyll: Headings have IDs which serve as anchors
      // Just verify headings have IDs for accessibility
      const allHeadings = page.locator('h2[id], h3[id], h4[id]');
      const count = await allHeadings.count();
      
      // Should have headings with IDs
      expect(count).toBeGreaterThan(0);
    }
  });
});
