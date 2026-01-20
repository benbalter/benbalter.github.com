import { test, expect, type Page } from '@playwright/test';

const expectPathname = (page: Page, expectedPath: string) => {
  const currentPath = new URL(page.url()).pathname;
  expect(currentPath).toBe(expectedPath);
};

test.describe('Legacy URL Redirects', () => {
  test.describe('Page Redirects', () => {
    test('should redirect /cv/ to /resume/', async ({ page }) => {
      // Start on the legacy URL - use domcontentloaded for faster test execution
      // since we only need JS to run for the redirect, not all resources to load
      await page.goto('/cv/', { waitUntil: 'domcontentloaded' });
      
      // Wait for redirect to complete (JavaScript replaces location)
      await page.waitForURL('**/resume/', { timeout: 5000 });
      
      // Should redirect to the new URL
      expectPathname(page, '/resume/');
    });

    test('should redirect /books/ to /other-recommended-reading/', async ({ page }) => {
      await page.goto('/books/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/other-recommended-reading/', { timeout: 5000 });
      expectPathname(page, '/other-recommended-reading/');
    });

    test('should redirect /books-for-geeks/ to /other-recommended-reading/', async ({ page }) => {
      await page.goto('/books-for-geeks/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/other-recommended-reading/', { timeout: 5000 });
      expectPathname(page, '/other-recommended-reading/');
    });

    test('should redirect /recommended-reading/ to /other-recommended-reading/', async ({ page }) => {
      await page.goto('/recommended-reading/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/other-recommended-reading/', { timeout: 5000 });
      expectPathname(page, '/other-recommended-reading/');
    });
  });

  test.describe('Post URL Corrections - Typos', () => {
    test('should redirect post with typo /2014/01/27/open-collabortion/', async ({ page }) => {
      await page.goto('/2014/01/27/open-collabortion/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2014/01/27/open-collaboration/', { timeout: 5000 });
      expectPathname(page, '/2014/01/27/open-collaboration/');
    });

    test('should redirect /2014/09/29/your-code-deserves-better/', async ({ page }) => {
      await page.goto('/2014/09/29/your-code-deserves-better/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2014/09/29/our-code-deserves-better/', { timeout: 5000 });
      expectPathname(page, '/2014/09/29/our-code-deserves-better/');
    });

    test('should redirect /2021/03/26/n-things-a-technicalp-program-manager-does/', async ({ page }) => {
      await page.goto('/2021/03/26/n-things-a-technicalp-program-manager-does/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2021/03/26/nine-things-a-technical-program-manager-does/', { timeout: 5000 });
      expectPathname(page, '/2021/03/26/nine-things-a-technical-program-manager-does/');
    });
  });

  test.describe('Post URL Corrections - Wrong Dates', () => {
    test('should redirect post with wrong date /2014/12/08/types-of-pull-requests/', async ({ page }) => {
      await page.goto('/2014/12/08/types-of-pull-requests/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2015/12/08/types-of-pull-requests/', { timeout: 5000 });
      expectPathname(page, '/2015/12/08/types-of-pull-requests/');
    });

    test('should redirect /2013/02/13/what-is-a-hacker/ to correct date', async ({ page }) => {
      await page.goto('/2013/02/13/what-is-a-hacker/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2013/02/04/what-is-a-hacker/', { timeout: 5000 });
      expectPathname(page, '/2013/02/04/what-is-a-hacker/');
    });

    test('should redirect /2013/02/16/what-is-a-hacker/ to correct date', async ({ page }) => {
      await page.goto('/2013/02/16/what-is-a-hacker/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2013/02/04/what-is-a-hacker/', { timeout: 5000 });
      expectPathname(page, '/2013/02/04/what-is-a-hacker/');
    });

    test('should redirect /2014/11/03/rules-of-communicating-at-github/ to correct date', async ({ page }) => {
      await page.goto('/2014/11/03/rules-of-communicating-at-github/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2014/11/06/rules-of-communicating-at-github/', { timeout: 5000 });
      expectPathname(page, '/2014/11/06/rules-of-communicating-at-github/');
    });

    test('should redirect /2014/11/17/open-source-policy/ to correct date', async ({ page }) => {
      await page.goto('/2014/11/17/open-source-policy/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2014/11/24/open-source-policy/', { timeout: 5000 });
      expectPathname(page, '/2014/11/24/open-source-policy/');
    });

    test('should redirect /2023/12/07/cathedral-bazaar-management/ to correct date', async ({ page }) => {
      await page.goto('/2023/12/07/cathedral-bazaar-management/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2023/12/08/cathedral-bazaar-management/', { timeout: 5000 });
      expectPathname(page, '/2023/12/08/cathedral-bazaar-management/');
    });
  });

  test.describe('Post URL Corrections - Special Characters', () => {
    test('should redirect source-disclosed--open-source with double dash', async ({ page }) => {
      await page.goto('/2014/09/29/source-disclosed--open-source/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2014/09/29/source-disclosed-is-not-the-same-as-open-source/', { timeout: 5000 });
      expectPathname(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
    });

    test('should redirect source-disclosed with not-equal symbol', async ({ page }) => {
      await page.goto('/2014/09/29/source-disclosed-≠-open-source/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2014/09/29/source-disclosed-is-not-the-same-as-open-source/', { timeout: 5000 });
      expectPathname(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
    });

    test('should redirect source-disclosed with != symbol', async ({ page }) => {
      await page.goto('/2014/09/29/source-disclosed-!=-open-source/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2014/09/29/source-disclosed-is-not-the-same-as-open-source/', { timeout: 5000 });
      expectPathname(page, '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/');
    });

    test('should redirect why-government-contractors-should-<3-open-source', async ({ page }) => {
      await page.goto('/2014/10/08/why-government-contractors-should-<3-open-source/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2014/10/08/why-government-contractors-should-embrace-open-source/', { timeout: 5000 });
      expectPathname(page, '/2014/10/08/why-government-contractors-should-embrace-open-source/');
    });

    test('should redirect why-government-contractors-should-%3C3-open-source (URL encoded)', async ({ page }) => {
      await page.goto('/2014/10/08/why-government-contractors-should-%3C3-open-source/', { waitUntil: 'domcontentloaded' });
      await page.waitForURL('**/2014/10/08/why-government-contractors-should-embrace-open-source/', { timeout: 5000 });
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

      
      // Check JavaScript redirect (Jekyll redirect-from uses location= syntax, with or without quotes)
      expect(content).toMatch(/location\s*=\s*["']?(https?:\/\/[^\s"'>]+)?\/resume\/["']?/);
      
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

      
      // Check fallback content for users with JavaScript disabled
      expect(content).toContain('<h1>Redirecting');
      expect(content).toContain('Click here if you are not redirected');
    });
  });
});
