import { test, expect, type Page } from '@playwright/test';
import { waitForPageReady } from './helpers';

/** Open search and wait for Pagefind to render a result list. */
async function openSearchWithResults(page: Page) {
  await page.keyboard.press('/');
  await expect(page.locator('#search-modal')).toBeVisible();
  await page.locator('#search-input').fill('open source');
  await expect(page.locator('.search-result').first()).toBeVisible();
}

test.describe('Search keyboard shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
  });

  test('slash opens the search modal and focuses the input', async ({ page }) => {
    const modal = page.locator('#search-modal');
    await expect(modal).toBeHidden();

    await page.keyboard.press('/');

    await expect(modal).toBeVisible();
    await expect(page.locator('#search-input')).toBeFocused();
  });

  test('slash typed inside the search field stays a literal slash', async ({ page }) => {
    await page.keyboard.press('/');
    const input = page.locator('#search-input');
    await expect(input).toBeFocused();

    await input.pressSequentially('and/or');

    // Open-only, not toggle: the modal stays open and the slash is part of the query
    await expect(page.locator('#search-modal')).toBeVisible();
    await expect(input).toHaveValue('and/or');
  });

  test('slash does not hijack typing in other page inputs', async ({ page }) => {
    const field = page.locator('input[type="text"], input[type="email"]').first();
    test.skip((await field.count()) === 0, 'no non-search text input on the homepage');

    await field.focus();
    await field.pressSequentially('a/b');

    await expect(page.locator('#search-modal')).toBeHidden();
    await expect(field).toHaveValue('a/b');
  });

  test('escape closes the modal', async ({ page }) => {
    await page.keyboard.press('/');
    await expect(page.locator('#search-modal')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#search-modal')).toBeHidden();
  });
});

test.describe('Search result navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    await openSearchWithResults(page);
  });

  test('arrow keys walk the result list', async ({ page }) => {
    const results = page.locator('.search-result');

    await page.keyboard.press('ArrowDown');
    await expect(results.nth(0)).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(results.nth(1)).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(results.nth(0)).toBeFocused();
  });

  test('arrowing up past the first result returns focus to the input', async ({ page }) => {
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.search-result').first()).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(page.locator('#search-input')).toBeFocused();
  });

  test('j and k walk the list once focus has left the input', async ({ page }) => {
    const results = page.locator('.search-result');

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('j');
    await expect(results.nth(1)).toBeFocused();

    await page.keyboard.press('k');
    await expect(results.nth(0)).toBeFocused();
  });

  test('j and k stay literal characters while typing a query', async ({ page }) => {
    const input = page.locator('#search-input');
    await input.fill('');
    await input.pressSequentially('jk');

    await expect(input).toHaveValue('jk');
    await expect(input).toBeFocused();
  });

  test('enter from the input opens the top result', async ({ page }) => {
    const href = await page.locator('.search-result').first().getAttribute('href');

    await page.locator('#search-input').press('Enter');

    await page.waitForURL(`**${href}`);
    expect(new URL(page.url()).pathname).toBe(href);
  });

  test('enter inside the debounce does not open a stale result', async ({ page }) => {
    const input = page.locator('#search-input');

    // Results on screen still belong to "open source"; the query no longer does.
    await input.fill('zzzznotathing');
    await input.press('Enter');

    await expect(page.locator('#search-modal')).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/');
  });

  test('a late re-render does not strand focus outside the list', async ({ page }) => {
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('.search-result').first()).toBeFocused();

    // Re-running the query destroys the focused anchor; focus should land back
    // on the input rather than falling through to <body>.
    await page.locator('#search-input').fill('remote work');
    await expect(page.locator('#search-input')).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(page.locator('#search-modal')).toBeHidden();
  });
});

test.describe('Site-wide keyboard shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
  });

  test('question mark toggles the shortcuts cheatsheet', async ({ page }) => {
    const dialog = page.locator('#shortcuts-modal');
    await expect(dialog).toBeHidden();

    await page.keyboard.press('?');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Keyboard shortcuts');

    await page.keyboard.press('?');
    await expect(dialog).toBeHidden();
  });

  test('escape closes the cheatsheet', async ({ page }) => {
    await page.keyboard.press('?');
    await expect(page.locator('#shortcuts-modal')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#shortcuts-modal')).toBeHidden();
  });

  test('the cheatsheet does not open from inside the search modal', async ({ page }) => {
    await page.keyboard.press('/');
    await expect(page.locator('#search-modal')).toBeVisible();

    await page.keyboard.press('?');

    await expect(page.locator('#shortcuts-modal')).toBeHidden();
    await expect(page.locator('#search-input')).toHaveValue('?');
  });

  test('g p goes to the posts archive and g h returns home', async ({ page }) => {
    await page.keyboard.press('g');
    await page.keyboard.press('p');
    await page.waitForURL('**/posts/');

    await waitForPageReady(page);
    await page.keyboard.press('g');
    await page.keyboard.press('h');
    await page.waitForURL((url) => url.pathname === '/');
  });

  test('a stray g does not swallow the next keystroke or navigate', async ({ page }) => {
    await page.keyboard.press('g');
    await page.keyboard.press('z');

    await expect(page.locator('#shortcuts-modal')).toBeHidden();
    expect(new URL(page.url()).pathname).toBe('/');

    // The chord disarmed, so `?` still works immediately after
    await page.keyboard.press('?');
    await expect(page.locator('#shortcuts-modal')).toBeVisible();
  });

  test('y copies the canonical URL and confirms', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');

    await page.keyboard.press('y');

    const toast = page.locator('.shortcut-toast');
    await expect(toast).toHaveText('Link copied');
    await expect(toast).toHaveAttribute('role', 'status');

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(canonical);
  });

  test('bare-key shortcuts stay inert while typing in a form field', async ({ page }) => {
    const field = page.locator('input[type="text"], input[type="email"]').first();
    test.skip((await field.count()) === 0, 'no non-search text input on the homepage');

    await field.focus();
    await field.pressSequentially('gy?');

    await expect(page.locator('#shortcuts-modal')).toBeHidden();
    await expect(page.locator('.shortcut-toast')).toHaveCount(0);
    await expect(field).toHaveValue('gy?');
    expect(new URL(page.url()).pathname).toBe('/');
  });
});
