import { test, expect } from '@playwright/test';
import { waitForPageReady, isAstroBuild } from './helpers';

test.describe('Related Posts', () => {
  test('should display related posts as an unordered list with bullets', async ({ page }) => {
    // Go to homepage to find a blog post
    await page.goto('/');
    await waitForPageReady(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    // Navigate to the first post
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForPageReady(page);
      
      const astro = await isAstroBuild(page);
      
      if (astro) {
        // Check if related posts section exists
        const relatedPostsSection = page.locator('.related-posts');
        
        if (await relatedPostsSection.count() > 0) {
          // Related posts section exists, verify it's a proper UL
          const relatedPostsList = relatedPostsSection.locator('ul.related-posts-list');
          await expect(relatedPostsList).toBeVisible();
          
          // Check that list items exist
          const listItems = relatedPostsList.locator('li');
          const itemCount = await listItems.count();
          
          if (itemCount > 0) {
            // Verify the list has disc style (bullets)
            const listStyle = await relatedPostsList.evaluate((el) => {
              return window.getComputedStyle(el).listStyleType;
            });
            
            expect(listStyle).toBe('disc');
            
            // Verify padding is applied (so bullets are visible)
            const paddingLeft = await relatedPostsList.evaluate((el) => {
              return window.getComputedStyle(el).paddingLeft;
            });
            
            // Should have meaningful padding (more than 0)
            const paddingValue = parseFloat(paddingLeft);
            expect(paddingValue).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
