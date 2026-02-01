import { test, expect, type Page } from '@playwright/test';

// Helper function to check pathname - accepts paths with or without trailing slashes
// since Astro's redirect-from plugin generates redirects without trailing slashes
const expectPathname = (page: Page, expectedPath: string) => {
  const currentPath = new URL(page.url()).pathname;
  // Remove trailing slash from both for comparison (Astro redirects don't include trailing slash)
  const normalizedCurrent = currentPath.replace(/\/$/, '');
  const normalizedExpected = expectedPath.replace(/\/$/, '');
  expect(normalizedCurrent).toBe(normalizedExpected);
};

// Helper to wait for URL with or without trailing slash
// Astro's redirect-from plugin generates redirects without trailing slashes
const waitForRedirect = async (page: Page, urlPattern: string) => {
  // Remove trailing slash from pattern if present
  const basePattern = urlPattern.replace(/\/$/, '');
  // Escape special regex characters except * (which we want to replace with .*)
  const escapedPattern = basePattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  // Use regex to match with or without trailing slash
  await page.waitForURL(new RegExp(`${escapedPattern}/?$`), { timeout: 5000 });
};

test.describe('Legacy URL Redirects', () => {
  test.describe('Page Redirects', () => {
    test('should redirect /cv/ to /resume/', async ({ page }) => {
      // Start on the legacy URL - use domcontentloaded for faster test execution
      // since we only need JS to run for the redirect, not all resources to load
      await page.goto('/cv/', { waitUntil: 'domcontentloaded' });
      
      // Wait for redirect to complete (JavaScript replaces location)
      await waitForRedirect(page, '**/resume/');
      
      // Should redirect to the new URL
      expectPathname(page, '/resume/');
    });

    test('should redirect /books/ to /other-recommended-reading/', async ({ page }) => {
      await page.goto('/books/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/other-recommended-reading/');
      expectPathname(page, '/other-recommended-reading/');
    });

    test('should redirect /books-for-geeks/ to /other-recommended-reading/', async ({ page }) => {
      await page.goto('/books-for-geeks/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/other-recommended-reading/');
      expectPathname(page, '/other-recommended-reading/');
    });

    test('should redirect /recommended-reading/ to /other-recommended-reading/', async ({ page }) => {
      await page.goto('/recommended-reading/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/other-recommended-reading/');
      expectPathname(page, '/other-recommended-reading/');
    });
  });

  test.describe('Post URL Corrections - Typos', () => {
    test('should redirect post with typo /2014/01/27/open-collabortion/', async ({ page }) => {
      await page.goto('/2014/01/27/open-collabortion/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2014/01/27/open-collaboration/');
      expectPathname(page, '/2014/01/27/open-collaboration/');
    });

    test('should redirect /2014/09/29/your-code-deserves-better/', async ({ page }) => {
      await page.goto('/2014/09/29/your-code-deserves-better/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2014/09/29/our-code-deserves-better/');
      expectPathname(page, '/2014/09/29/our-code-deserves-better/');
    });

    test('should redirect /2021/03/26/n-things-a-technicalp-program-manager-does/', async ({ page }) => {
      await page.goto('/2021/03/26/n-things-a-technicalp-program-manager-does/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2021/03/26/nine-things-a-technical-program-manager-does/');
      expectPathname(page, '/2021/03/26/nine-things-a-technical-program-manager-does/');
    });
  });

  test.describe('Post URL Corrections - Wrong Dates', () => {
    test('should redirect post with wrong date /2014/12/08/types-of-pull-requests/', async ({ page }) => {
      await page.goto('/2014/12/08/types-of-pull-requests/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2015/12/08/types-of-pull-requests/');
      expectPathname(page, '/2015/12/08/types-of-pull-requests/');
    });

    test('should redirect /2013/02/13/what-is-a-hacker/ to correct date', async ({ page }) => {
      await page.goto('/2013/02/13/what-is-a-hacker/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2013/02/04/what-is-a-hacker/');
      expectPathname(page, '/2013/02/04/what-is-a-hacker/');
    });

    test('should redirect /2013/02/16/what-is-a-hacker/ to correct date', async ({ page }) => {
      await page.goto('/2013/02/16/what-is-a-hacker/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2013/02/04/what-is-a-hacker/');
      expectPathname(page, '/2013/02/04/what-is-a-hacker/');
    });

    test('should redirect /2014/11/03/rules-of-communicating-at-github/ to correct date', async ({ page }) => {
      await page.goto('/2014/11/03/rules-of-communicating-at-github/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2014/11/06/rules-of-communicating-at-github/');
      expectPathname(page, '/2014/11/06/rules-of-communicating-at-github/');
    });

    test('should redirect /2014/11/17/open-source-policy/ to correct date', async ({ page }) => {
      await page.goto('/2014/11/17/open-source-policy/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2014/11/24/open-source-policy/');
      expectPathname(page, '/2014/11/24/open-source-policy/');
    });

    test('should redirect /2023/12/07/cathedral-bazaar-management/ to correct date', async ({ page }) => {
      await page.goto('/2023/12/07/cathedral-bazaar-management/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2023/12/08/cathedral-bazaar-management/');
      expectPathname(page, '/2023/12/08/cathedral-bazaar-management/');
    });
  });

  test.describe('Post URL Corrections - Special Characters', () => {
    test('should redirect source-disclosed--open-source with double dash', async ({ page }) => {
      await page.goto('/2014/09/29/source-disclosed--open-source/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
      expectPathname(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
    });

    test('should redirect source-disclosed with not-equal symbol', async ({ page }) => {
      await page.goto('/2014/09/29/source-disclosed-≠-open-source/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
      expectPathname(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
    });

    test('should redirect source-disclosed with != symbol', async ({ page }) => {
      await page.goto('/2014/09/29/source-disclosed-!=-open-source/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
      expectPathname(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
    });

    test('should redirect why-government-contractors-should-<3-open-source', async ({ page }) => {
      await page.goto('/2014/10/08/why-government-contractors-should-<3-open-source/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2014/10/08/why-government-contractors-should-embrace-open-source/');
      expectPathname(page, '/2014/10/08/why-government-contractors-should-embrace-open-source/');
    });

    test('should redirect why-government-contractors-should-%3C3-open-source (URL encoded)', async ({ page }) => {
      await page.goto('/2014/10/08/why-government-contractors-should-%3C3-open-source/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '**/2014/10/08/why-government-contractors-should-embrace-open-source/');
      expectPathname(page, '/2014/10/08/why-government-contractors-should-embrace-open-source/');
    });
  });

  test.describe('External Redirects', () => {
    test('should show external redirect for github.blog post', async ({ request }) => {
      // Fetch the redirect page HTML directly without JavaScript execution
      const response = await request.get('/2023/10/04/how-to-communicate-like-a-github-engineer/');
      const content = await response.text();
      
      // Check for redirect message and link to external site
      expect(content).toContain('github.blog');
      expect(content).toContain('Redirecting');
    });

    test('should show external redirect for old GitHub blog post', async ({ request }) => {
      const response = await request.get('/2015/04/27/eight-lessons-learned-hacking-on-github-pages-for-six-months/');
      const content = await response.text();
      
      expect(content).toContain('github.com/blog');
      expect(content).toContain('Redirecting');
    });

    test('should show external redirect for TechCrunch article', async ({ request }) => {
      const response = await request.get('/2012/04/23/enterprise-open-source-usage-is-up-but-challenges-remain/');
      const content = await response.text();
      
      expect(content).toContain('techcrunch.com');
      expect(content).toContain('Redirecting');
    });
  });



  test.describe('Redirect HTML Structure', () => {
    test('should have all required HTML elements and proper structure', async ({ request }) => {
      const response = await request.get('/cv/', { 
        maxRedirects: 0,
        failOnStatusCode: false 
      });
      
      const content = await response.text();
      
      // Check meta refresh tag (with or without quotes around attribute values)
      expect(content).toMatch(/meta\s+(?:content="[^"]*"\s+)?http-equiv=["']?refresh["']?|meta\s+http-equiv=["']?refresh["']?(?:\s+content="[^"]*")?/);
      // Accept both relative and absolute URLs (with various hosts for local testing, with or without quotes)
      // Note: Astro's redirect-from plugin doesn't add trailing slashes to redirect URLs
      expect(content).toMatch(/content=["']?0;\s*url=(https?:\/\/[^\s"'>]+)?\/resume\/?["']?/);

      // Check canonical link (accepts any host for testing, with or without quotes around href)
      // Note: Astro's redirect-from plugin doesn't add trailing slashes to redirect URLs
      expect(content).toMatch(/<link\s+(?:href=["']?https?:\/\/[^\s"'>]+\/resume\/?["']?\s+)?rel=["']?canonical["']?|<link\s+rel=["']?canonical["']?(?:\s+href=["']?https?:\/\/[^\s"'>]+\/resume\/?["']?)?/);
      
      // Check robots noindex meta tag in a maintainable way:
      // find all <meta> tags, then ensure at least one has both name="robots" and content="noindex",
      // regardless of attribute order or quoting
      const metaTags = content.match(/<meta[^>]*>/gi) || [];
      const hasRobotsNoindex = metaTags.some((tag) => {
        const hasNameRobots = /name=["']?robots["']?/i.test(tag);
        const hasContentNoindex = /content=["']?noindex["']?/i.test(tag);
        return hasNameRobots && hasContentNoindex;
      });
      expect(hasRobotsNoindex).toBeTruthy();

      
      // Check fallback content for users with JavaScript disabled
      // Astro's redirect-from plugin includes a link with descriptive text
      expect(content).toContain('<a href=/resume/');
      expect(content).toContain('Redirecting from');
    });
  });

  test.describe('Sitemap Redirects', () => {
    test('should have meta refresh redirect from /sitemap.xml to /sitemap-0.xml', async ({ request }) => {
      const response = await request.get('/sitemap.xml', { 
        maxRedirects: 0,
        failOnStatusCode: false 
      });
      
      const content = await response.text();
      
      // Astro static builds use HTML meta refresh redirects
      expect(content).toContain('meta http-equiv="refresh"');
      expect(content).toContain('url=/sitemap-0.xml');
      expect(content).toContain('robots" content="noindex');
    });

    test('should have meta refresh redirect from /sitemap_index.xml to /sitemap-index.xml', async ({ request }) => {
      const response = await request.get('/sitemap_index.xml', { 
        maxRedirects: 0,
        failOnStatusCode: false 
      });
      
      const content = await response.text();
      
      // Astro static builds use HTML meta refresh redirects
      expect(content).toContain('meta http-equiv="refresh"');
      expect(content).toContain('url=/sitemap-index.xml');
      expect(content).toContain('robots" content="noindex');
    });

    test('/sitemap.xml redirect should resolve to valid sitemap', async ({ page, request }) => {
      // Fetch the redirect page directly to avoid XML parsing issues
      const response = await request.get('/sitemap.xml');
      expect(response.status()).toBe(200);
      
      // Astro uses meta refresh redirects - verify it points to the correct destination
      const content = await response.text();
      expect(content).toContain('url=/sitemap-0.xml');
      
      // Now verify the actual sitemap is valid
      const sitemapResponse = await request.get('/sitemap-0.xml');
      expect(sitemapResponse.status()).toBe(200);
      
      // Verify it's a valid sitemap
      const sitemapContent = await sitemapResponse.text();
      expect(sitemapContent).toMatch(/<urlset|<url>/i);
    });

    test('/sitemap_index.xml redirect should resolve to valid sitemap index', async ({ page, request }) => {
      // Fetch the redirect page directly to avoid XML parsing issues
      const response = await request.get('/sitemap_index.xml');
      expect(response.status()).toBe(200);
      
      // Astro uses meta refresh redirects - verify it points to the correct destination
      const content = await response.text();
      expect(content).toContain('url=/sitemap-index.xml');
      
      // Now verify the actual sitemap index is valid
      const sitemapResponse = await request.get('/sitemap-index.xml');
      expect(sitemapResponse.status()).toBe(200);
      
      // Verify it's a valid sitemap index
      const sitemapContent = await sitemapResponse.text();
      expect(sitemapContent).toMatch(/<sitemapindex|<sitemap>/i);
    });
  });
});
