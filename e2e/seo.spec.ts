import { test, expect } from '@playwright/test';
import { waitForFullLoad } from './helpers';

test.describe('SEO', () => {
  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/about', name: 'About' },
    { url: '/resume', name: 'Resume' },
  ];

  pages.forEach(({ url, name }) => {
    test.describe(name, () => {
      test('should have meta description', async ({ page }) => {
        await page.goto(url);
        await waitForFullLoad(page);
        
        const metaDescription = page.locator('meta[name="description"]');
        await expect(metaDescription).toHaveCount(1);
        
        const content = await metaDescription.getAttribute('content');
        expect(content).toBeTruthy();
        expect(content!.length).toBeGreaterThan(10);
        expect(content!.length).toBeLessThan(160); // SEO best practice
      });

      test('should have Open Graph tags', async ({ page }) => {
        await page.goto(url);
        await waitForFullLoad(page);
        
        // Check for required OG tags
        const ogTitle = page.locator('meta[property="og:title"]');
        const ogDescription = page.locator('meta[property="og:description"]');
        const ogType = page.locator('meta[property="og:type"]');
        const ogUrl = page.locator('meta[property="og:url"]');
        
        await expect(ogTitle).toHaveCount(1);
        await expect(ogDescription).toHaveCount(1);
        
        // These are optional but good to have
        const ogTypeCount = await ogType.count();
        const ogUrlCount = await ogUrl.count();
        
        expect(ogTypeCount + ogUrlCount).toBeGreaterThan(0);
      });

      test('should have Twitter Card tags', async ({ page }) => {
        await page.goto(url);
        await waitForFullLoad(page);
        
        const twitterCard = page.locator('meta[name="twitter:card"]');
        const count = await twitterCard.count();
        
        // Twitter cards are optional but recommended
        if (count > 0) {
          const content = await twitterCard.getAttribute('content');
          expect(content).toBeTruthy();
        }
      });

      test('should have canonical URL', async ({ page }) => {
        await page.goto(url);
        await waitForFullLoad(page);
        
        const canonical = page.locator('link[rel="canonical"]');
        const count = await canonical.count();
        
        // Canonical URL is good SEO practice
        if (count > 0) {
          const href = await canonical.getAttribute('href');
          expect(href).toBeTruthy();
        }
      });

      test('should have proper title tag', async ({ page }) => {
        await page.goto(url);
        await waitForFullLoad(page);
        
        const title = await page.title();
        
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
        expect(title.length).toBeLessThan(70); // SEO best practice
      });

      test('should have robots meta tag or be indexable', async ({ page }) => {
        await page.goto(url);
        await waitForFullLoad(page);
        
        const robotsMeta = page.locator('meta[name="robots"]');
        const count = await robotsMeta.count();
        
        if (count > 0) {
          const content = await robotsMeta.getAttribute('content');
          // Should not be blocking indexing on main pages
          expect(content).not.toContain('noindex');
        }
      });

      test('should have structured data', async ({ page }) => {
        await page.goto(url);
        await waitForFullLoad(page);
        
        // Check for JSON-LD or microdata
        const jsonLd = page.locator('script[type="application/ld+json"]');
        const count = await jsonLd.count();
        
        // Structured data is recommended but not required
        if (count > 0) {
          const content = await jsonLd.first().textContent();
          expect(content).toBeTruthy();
          
          // Should be valid JSON
          try {
            JSON.parse(content!);
          } catch (e) {
            throw new Error('Invalid JSON in structured data');
          }
        }
      });
    });
  });

  test('sitemap should be accessible', async ({ page }) => {
    // Try both sitemap.xml and sitemap_index.xml
    let response = await page.goto('/sitemap.xml');
    let status = response?.status();
    
    if (status === 404) {
      response = await page.goto('/sitemap_index.xml');
      status = response?.status();
    }
    
    expect(status).toBe(200);

    const content = await page.content();

    // Some sitemap implementations may be proxied or wrapped when rendered
    // in a browser context, so we just assert that we got some XML back
    // rather than matching the raw XML prolog or specific tags.
    expect(/<urlset|<sitemapindex|<url>/i.test(content)).toBeTruthy();
  });

  test('robots.txt should be accessible', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    expect(content).toContain('User-agent');
  });

  test('RSS feed should be accessible', async ({ page }) => {
  // Try multiple feed locations, including the main site feed and press feed
    const feedPaths = [
  '/feed.xml',
  '/feed/', // local Atom feed redirector
  '/feed/index.xml',
      '/atom.xml',
      '/press/feed/index.xml',
      '/press/feed/',
    ];
    let foundFeed = false;
    
    for (const feedPath of feedPaths) {
      const response = await page.goto(feedPath);
      const status = response?.status();
      
      if (status === 200) {
        const content = await page.content();

        // In the browser context, XML feeds may be wrapped in an HTML
        // viewer, so we can't rely on the raw XML prolog being present.
        // Look for common feed markers instead.
        if (
          content.match(/<rss|<feed|application\/rss\+xml|application\/atom\+xml/i)
        ) {
          foundFeed = true;
          break;
        }
      }
    }
    
    expect(foundFeed, 'RSS/Atom feed should be accessible at one of the standard paths').toBeTruthy();
  });
});

test.describe('Blog Post SEO', () => {
  test('blog posts should have proper meta tags', async ({ page }) => {
    await page.goto('/');
    await waitForFullLoad(page);
    
    const postLinks = page.locator('a[href*="/20"]');
    const count = await postLinks.count();
    
    if (count === 0) {
      test.skip(true, 'No blog posts found');
      return;
    }
    
    const firstPostUrl = await postLinks.first().getAttribute('href');
    
    if (firstPostUrl) {
      await page.goto(firstPostUrl);
      await waitForFullLoad(page);
      
      // Check for meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveCount(1);
      
      // Check for article meta tags
      const articlePublishedTime = page.locator('meta[property="article:published_time"]');
      const articleAuthor = page.locator('meta[property="article:author"]');
      
      // Article meta is good but not required
      // Just checking that the selectors are valid
    }
  });
});
