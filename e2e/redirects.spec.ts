import { test, expect, type Page } from '@playwright/test';

const expectPathname = (page: Page, expectedPath: string) => {
  const currentPath = new URL(page.url()).pathname;
  // Normalize trailing slashes for comparison since Astro preview server
  // may not enforce trailing slash redirects consistently
  const normalizedCurrent = currentPath.endsWith('/') ? currentPath : currentPath + '/';
  const normalizedExpected = expectedPath.endsWith('/') ? expectedPath : expectedPath + '/';
  expect(normalizedCurrent).toBe(normalizedExpected);
};

// Helper to wait for redirect by checking if URL contains the expected path
const waitForRedirect = async (page: Page, expectedPathSegment: string, timeout = 5000) => {
  await page.waitForFunction(
    (segment) => window.location.pathname.includes(segment),
    expectedPathSegment,
    { timeout }
  );
};

test.describe('Legacy URL Redirects', () => {
  test.describe('Page Redirects', () => {
    test('should redirect /cv/ to /resume/', async ({ page }) => {
      // Start on the legacy URL - use domcontentloaded for faster test execution
      // since we only need JS to run for the redirect, not all resources to load
      await page.goto('/cv/', { waitUntil: 'domcontentloaded' });
      
      // Wait for redirect to complete (JavaScript replaces location)
      await waitForRedirect(page, '/resume');
      
      // Should redirect to the new URL
      expectPathname(page, '/resume/');
    });

    test('should redirect /books/ to /other-recommended-reading/', async ({ page }) => {
      await page.goto('/books/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/other-recommended-reading');
      expectPathname(page, '/other-recommended-reading/');
    });

    test('should redirect /books-for-geeks/ to /other-recommended-reading/', async ({ page }) => {
      await page.goto('/books-for-geeks/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/other-recommended-reading');
      expectPathname(page, '/other-recommended-reading/');
    });

    test('should redirect /recommended-reading/ to /other-recommended-reading/', async ({ page }) => {
      await page.goto('/recommended-reading/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/other-recommended-reading');
      expectPathname(page, '/other-recommended-reading/');
    });
  });

  test.describe('Post URL Corrections - Typos', () => {
    test('should redirect post with typo /2014/01/27/open-collabortion/', async ({ page }) => {
      await page.goto('/2014/01/27/open-collabortion/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2014/01/27/open-collaboration');
      expectPathname(page, '/2014/01/27/open-collaboration/');
    });

    test('should redirect /2014/09/29/your-code-deserves-better/', async ({ page }) => {
      await page.goto('/2014/09/29/your-code-deserves-better/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2014/09/29/our-code-deserves-better');
      expectPathname(page, '/2014/09/29/our-code-deserves-better/');
    });

    test('should redirect /2021/03/26/n-things-a-technicalp-program-manager-does/', async ({ page }) => {
      await page.goto('/2021/03/26/n-things-a-technicalp-program-manager-does/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2021/03/26/nine-things-a-technical-program-manager-does');
      expectPathname(page, '/2021/03/26/nine-things-a-technical-program-manager-does/');
    });
  });

  test.describe('Post URL Corrections - Wrong Dates', () => {
    test('should redirect post with wrong date /2014/12/08/types-of-pull-requests/', async ({ page }) => {
      await page.goto('/2014/12/08/types-of-pull-requests/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2015/12/08/types-of-pull-requests');
      expectPathname(page, '/2015/12/08/types-of-pull-requests/');
    });

    test('should redirect /2013/02/13/what-is-a-hacker/ to correct date', async ({ page }) => {
      await page.goto('/2013/02/13/what-is-a-hacker/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2013/02/04/what-is-a-hacker');
      expectPathname(page, '/2013/02/04/what-is-a-hacker/');
    });

    test('should redirect /2013/02/16/what-is-a-hacker/ to correct date', async ({ page }) => {
      await page.goto('/2013/02/16/what-is-a-hacker/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2013/02/04/what-is-a-hacker');
      expectPathname(page, '/2013/02/04/what-is-a-hacker/');
    });

    test('should redirect /2014/11/03/rules-of-communicating-at-github/ to correct date', async ({ page }) => {
      await page.goto('/2014/11/03/rules-of-communicating-at-github/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2014/11/06/rules-of-communicating-at-github');
      expectPathname(page, '/2014/11/06/rules-of-communicating-at-github/');
    });

    test('should redirect /2014/11/17/open-source-policy/ to correct date', async ({ page }) => {
      await page.goto('/2014/11/17/open-source-policy/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2014/11/24/open-source-policy');
      expectPathname(page, '/2014/11/24/open-source-policy/');
    });

    test('should redirect /2023/12/07/cathedral-bazaar-management/ to correct date', async ({ page }) => {
      await page.goto('/2023/12/07/cathedral-bazaar-management/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2023/12/08/cathedral-bazaar-management');
      expectPathname(page, '/2023/12/08/cathedral-bazaar-management/');
    });
  });

  test.describe('Post URL Corrections - Special Characters', () => {
    test('should redirect source-disclosed--open-source with double dash', async ({ page }) => {
      await page.goto('/2014/09/29/source-disclosed--open-source/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source');
      expectPathname(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
    });

    test('should redirect source-disclosed with not-equal symbol', async ({ page }) => {
      await page.goto('/2014/09/29/source-disclosed-≠-open-source/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source');
      expectPathname(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
    });

    test('should redirect source-disclosed with != symbol', async ({ page }) => {
      await page.goto('/2014/09/29/source-disclosed-!=-open-source/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source');
      expectPathname(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
    });

    test('should redirect why-government-contractors-should-3-open-source', async ({ page }) => {
      // Tests the actual redirect_from defined in the post (without < character)
      await page.goto('/2014/10/08/why-government-contractors-should-3-open-source/', { waitUntil: 'domcontentloaded' });
      await waitForRedirect(page, '/2014/10/08/why-government-contractors-should-embrace-open-source');
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
      expect(content).toMatch(/content=["']?0;\s*url=(https?:\/\/[^\s"'>]+)?\/resume\/["']?/);

      // Check canonical link (accepts any host for testing, with or without quotes around href)
      expect(content).toMatch(/<link\s+(?:href=["']?https?:\/\/[^\s"'>]+\/resume\/["']?\s+)?rel=["']?canonical["']?|<link\s+rel=["']?canonical["']?(?:\s+href=["']?https?:\/\/[^\s"'>]+\/resume\/["']?)?/);
      
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

      // Check fallback content for users without meta refresh support
      // The astro-redirect-from plugin provides a simple fallback link
      expect(content).toContain('Redirecting');
      expect(content).toMatch(/<a\s+href=/i);
    });
  });

});
