import { test, expect } from '@playwright/test';
import { waitForPageReady, isAstroBuild } from './helpers';

test.describe('Emoji Rendering', () => {
  test('should render standard Unicode emojis in blog posts', async ({ page }) => {
    // Navigate to a post known to contain emoji shortcodes
    await page.goto('/2015/11/18/tools-to-empower-open-collaboration/');
    await waitForPageReady(page);
    
    // Check that the page loaded
    await expect(page).toHaveTitle(/Four characteristics of modern collaboration tools/);
    
    const astro = await isAstroBuild(page);
    
    if (astro) {
      // Astro: emojis should be rendered as Unicode characters in text
      const content = await page.locator('article, main, .post').first().textContent();
      
      // :heavy_check_mark: should be rendered as ✔️ (check mark)
      expect(content).toContain('✔');
      
      // :x: should be rendered as ❌ (cross mark)
      expect(content).toContain('❌');
      
      // Verify that the emoji shortcodes themselves are NOT present in the output
      expect(content).not.toContain(':heavy_check_mark:');
      expect(content).not.toContain(':x:');
    } else {
      // Jekyll: emojis are rendered as <img> tags via jemoji plugin
      const article = page.locator('article, main, .post').first();
      
      // Check for emoji images with correct attributes
      const checkmarkEmoji = article.locator('img.emoji[title=":heavy_check_mark:"]');
      await expect(checkmarkEmoji.first()).toBeVisible();
      
      const xEmoji = article.locator('img.emoji[title=":x:"]');
      await expect(xEmoji.first()).toBeVisible();
      
      // Verify shortcodes are not in visible text (they're in img attributes)
      const content = await article.textContent();
      expect(content).not.toContain(':heavy_check_mark:');
      expect(content).not.toContain(':x:');
    }
  });
  
  test('should render emojis in inline text', async ({ page }) => {
    // Navigate to a post with inline emoji usage
    await page.goto('/2014/11/06/rules-of-communicating-at-github/');
    await waitForPageReady(page);
    
    // Check that the page loaded
    await expect(page).toHaveTitle(/15 rules for communicating at GitHub/);
    
    const astro = await isAstroBuild(page);
    const article = page.locator('article, main, .post').first();
    
    if (astro) {
      // Astro: emojis should be rendered as Unicode characters
      const content = await article.textContent();
      
      // :smile: should be rendered as 😄
      expect(content).toContain('😄');
      
      // :ship: should be rendered as 🚢
      expect(content).toContain('🚢');
      
      // Verify that common emoji shortcodes are NOT present
      expect(content).not.toContain(':smile:');
      expect(content).not.toContain(':ship:');
    } else {
      // Jekyll: emojis are rendered as <img> tags
      // Check for emoji images
      const emojiImages = article.locator('img.emoji');
      const count = await emojiImages.count();
      
      // Should have at least some emoji images
      expect(count).toBeGreaterThan(0);
      
      // Verify shortcodes are not in visible text
      const content = await article.textContent();
      expect(content).not.toContain(':smile:');
      expect(content).not.toContain(':ship:');
    }
  });
  
  test('should preserve GitHub-specific emoji shortcodes that are not in Unicode', async ({ page }) => {
    // Navigate to a post with GitHub-specific emojis
    await page.goto('/2014/11/06/rules-of-communicating-at-github/');
    await waitForPageReady(page);
    
    // Get the page content
    const content = await page.locator('article, main, .post').first().textContent();
    
    // GitHub-specific emojis like :trollface: are not in Unicode emoji set
    // so they should remain as text (this is expected behavior)
    // We're just checking that the page still renders correctly
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(100);
  });
  
  test('emoji table should render correctly', async ({ page }) => {
    // Navigate to the post with emoji table
    await page.goto('/2015/11/18/tools-to-empower-open-collaboration/');
    await waitForPageReady(page);
    
    // Find the table
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
    
    const astro = await isAstroBuild(page);
    
    // Get table content
    const tableHTML = await table.innerHTML();
    
    if (astro) {
      // Astro: emojis should be Unicode in table
      expect(tableHTML).toContain('✔');
      expect(tableHTML).toContain('❌');
      
      // Verify shortcodes are replaced
      expect(tableHTML).not.toContain(':heavy_check_mark:');
      expect(tableHTML).not.toContain(':x:');
    } else {
      // Jekyll: emojis are <img> tags in table
      const emojiImages = table.locator('img.emoji');
      const count = await emojiImages.count();
      
      // Table should have multiple emoji images
      expect(count).toBeGreaterThan(5);
      
      // Verify shortcodes are not in visible text (they're in img title attributes)
      const tableText = await table.textContent();
      expect(tableText).not.toContain(':heavy_check_mark:');
      expect(tableText).not.toContain(':x:');
    }
  });
});
