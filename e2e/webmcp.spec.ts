import { test, expect, type Page } from '@playwright/test';
import { waitForPageReady } from './helpers';

/**
 * WebMCP tools (src/scripts/webmcp.ts), through Chromium's real WebMCP API:
 * the `WebMCP` feature flag exposes `document.modelContext`, and Playwright's
 * `page.webmcp` lists and calls what the page registered, the way an agent in
 * the browser would. Calls run against the real built site: the real Pagefind
 * index and the real pages.
 */

// Tagged `bookRelation: adapted`, so it carries the book note.
const POST = '/2014/11/06/rules-of-communicating-at-github/';

const TOOLS = ['get_book', 'get_page', 'search_site'];

/** Call a tool whose result is JSON. Chromium hands back JSON strings already parsed. */
async function callJsonTool(page: Page, name: string, input: Record<string, unknown>) {
  const result = await page.webmcp.callTool(name, input);
  return typeof result === 'string' ? JSON.parse(result) : result;
}

// Launch options apply per file, so the no-WebMCP check lives in webmcp-feature-check.spec.ts.
test.use({ launchOptions: { args: ['--enable-features=WebMCP'] } });

test.describe('WebMCP tools', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'WebMCP is Chromium-only');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    // The tools chunk loads after the feature check, so wait for registration.
    await expect.poll(async () => (await page.webmcp.tools()).length).toBe(TOOLS.length);
  });

  test('registers search_site, get_page, and get_book with input schemas', async ({ page }) => {
    const tools = await page.webmcp.tools();
    expect(tools.map((t) => t.name).sort()).toEqual(TOOLS);
    for (const tool of tools) {
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema).toMatchObject({ type: 'object' });
    }
  });

  test('search_site notes a post tied to the book, and the index skips the book promo', async ({ page }) => {
    const hits = await callJsonTool(page, 'search_site', { query: 'rules for communicating at GitHub', limit: 10 });
    const post = hits.results.find((h: { url: string }) => h.url.endsWith(POST));
    expect(post?.book).toContain('Open and Async');

    // This phrase appears only in the book promo, which search now ignores.
    const promo = await callJsonTool(page, 'search_site', { query: '"drawing on over a decade"' });
    expect(promo.results).toEqual([]);
  });

  test('get_book describes the book and its posts', async ({ page }) => {
    const book = await callJsonTool(page, 'get_book', {});
    expect(book.title).toBe('Open and Async');
    expect(book.url).toContain('utm_source=benbalter-webmcp');
    expect(book.posts.some((p: { url: string }) => p.url.endsWith(POST))).toBe(true);
  });

  test('search_site returns matches from the Pagefind index', async ({ page }) => {
    const out = await callJsonTool(page, 'search_site', { query: 'communicating', limit: 3 });

    expect(out.results.length).toBeGreaterThan(0);
    expect(out.results.length).toBeLessThanOrEqual(3);
    for (const hit of out.results) {
      expect(hit.url).toMatch(/^https?:\/\//);
      expect(hit.title).toBeTruthy();
      expect(hit.excerpt).not.toContain('<mark>');
    }
  });

  test('get_page returns a post as text', async ({ page }) => {
    const text = await page.webmcp.callTool('get_page', { path: POST });
    if (typeof text !== 'string') throw new Error(`get_page returned ${typeof text}, not text`);
    expect(text).toMatch(/^# /);
    expect(text.toLowerCase()).toContain('github');
    // Page chrome stays out
    expect(text).not.toContain('Share this post');
    // One quiet line at the end, not the promo box
    expect(text).not.toContain('Buy it for');
    expect(text.trimEnd().split('\n').at(-1)).toMatch(/^_A version of this post appears in .+\._ <https:\/\/open-and-async\.com\/\S+>$/);
  });

  test('get_page refuses other sites', async ({ page }) => {
    // Chromium reports a tool that throws with a generic error, not the tool's message.
    await expect(page.webmcp.callTool('get_page', { path: 'https://example.com/' })).rejects.toThrow();
  });
});

