import { test, expect, type Page } from '@playwright/test';
import { waitForPageReady } from './helpers';

/**
 * WebMCP tools (src/scripts/webmcp.ts). No shipping browser exposes
 * `document.modelContext` to Playwright, so a fake one is installed before any
 * page script runs. It records each registered tool on `window.__webmcpTools`,
 * and the tests call their `execute` against the real built site: the real
 * Pagefind index and the real pages.
 */

// Tagged `bookRelation: adapted`, so it carries the book note.
const POST = '/2014/11/06/rules-of-communicating-at-github/';

async function installFakeModelContext(page: Page) {
  await page.addInitScript(() => {
    const tools: Record<string, { execute(input: unknown): Promise<string> }> = {};
    (window as unknown as { __webmcpTools: typeof tools }).__webmcpTools = tools;
    Object.defineProperty(document, 'modelContext', {
      value: {
        registerTool(tool: { name: string; execute(input: unknown): Promise<string> }) {
          if (tools[tool.name]) throw new Error(`duplicate tool ${tool.name}`);
          tools[tool.name] = tool;
        },
      },
    });
  });
}

/** Call a registered tool in the page and return its string result. */
function callTool(page: Page, name: string, input: Record<string, unknown>) {
  return page.evaluate(
    ([toolName, toolInput]) =>
      (window as unknown as { __webmcpTools: Record<string, { execute(i: unknown): Promise<string> }> })
        .__webmcpTools[toolName].execute(toolInput),
    [name, input] as const,
  );
}

test.describe('WebMCP tools', () => {
  test.beforeEach(async ({ page }) => {
    await installFakeModelContext(page);
    await page.goto('/');
    await waitForPageReady(page);
    await page.waitForFunction(
      () => Object.keys((window as unknown as { __webmcpTools: object }).__webmcpTools).length === 3,
    );
  });

  test('registers search_site, get_page, and get_book', async ({ page }) => {
    const names = await page.evaluate(() =>
      Object.keys((window as unknown as { __webmcpTools: object }).__webmcpTools).sort(),
    );
    expect(names).toEqual(['get_book', 'get_page', 'search_site']);
  });

  test('search_site notes a post tied to the book, and the index skips the book promo', async ({ page }) => {
    const hits = JSON.parse(await callTool(page, 'search_site', { query: 'rules for communicating at GitHub', limit: 10 }));
    const post = hits.results.find((h: { url: string }) => h.url.endsWith(POST));
    expect(post?.book).toContain('Open and Async');

    // This phrase appears only in the book promo, which search now ignores.
    const promo = JSON.parse(await callTool(page, 'search_site', { query: '"drawing on over a decade"' }));
    expect(promo.results).toEqual([]);
  });

  test('get_book describes the book and its posts', async ({ page }) => {
    const book = JSON.parse(await callTool(page, 'get_book', {}));
    expect(book.title).toBe('Open and Async');
    expect(book.url).toContain('utm_source=benbalter-webmcp');
    expect(book.posts.some((p: { url: string }) => p.url.endsWith(POST))).toBe(true);
  });

  test('search_site returns matches from the Pagefind index', async ({ page }) => {
    const out = JSON.parse(await callTool(page, 'search_site', { query: 'communicating', limit: 3 }));

    expect(out.results.length).toBeGreaterThan(0);
    expect(out.results.length).toBeLessThanOrEqual(3);
    for (const hit of out.results) {
      expect(hit.url).toMatch(/^https?:\/\//);
      expect(hit.title).toBeTruthy();
      expect(hit.excerpt).not.toContain('<mark>');
    }
  });

  test('get_page returns a post as text', async ({ page }) => {
    const text = await callTool(page, 'get_page', { path: POST });
    expect(text).toMatch(/^# /);
    expect(text.toLowerCase()).toContain('github');
    // Page chrome stays out
    expect(text).not.toContain('Share this post');
    // One quiet line at the end, not the promo box
    expect(text).not.toContain('Buy it for');
    expect(text.trimEnd().split('\n').at(-1)).toMatch(/^_A version of this post appears in .+\._ <https:\/\/open-and-async\.com\/\S+>$/);
  });

  test('get_page refuses other sites', async ({ page }) => {
    await expect(callTool(page, 'get_page', { path: 'https://example.com/' })).rejects.toThrow(/path/);
  });
});

test('browsers without WebMCP never download the tools', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (req) => {
    if (req.resourceType() === 'script') scripts.push(req.url());
  });

  await page.goto('/');
  await waitForPageReady(page);

  expect(scripts.some((url) => /\/webmcp\.[^/]*\.js$/.test(url))).toBe(false);
  expect(scripts.some((url) => url.includes('/pagefind/'))).toBe(false);
});
