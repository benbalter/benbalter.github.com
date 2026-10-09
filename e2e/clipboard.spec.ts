import { test, expect, type Page } from '@playwright/test';

/**
 * Every copy-to-clipboard surface on the site goes through
 * src/utils/copy-to-clipboard.ts. These tests click each one and check what
 * landed on the clipboard, plus which API actually did the copy.
 *
 * Run across engines with: CROSS_BROWSER=1 npx playwright test e2e/clipboard.spec.ts
 *
 * WebKit caveats:
 * - Playwright's WebKit is a desktop WebKit build, not Safari. It exercises the
 *   same code path Safari would take, but can't prove anything about iPadOS
 *   Safari's pasteboard (see #1683).
 * - It rejects `navigator.clipboard.readText()` outright, so the test reads the
 *   clipboard back by pasting into a scratch textarea instead.
 * - The site's CSP includes `upgrade-insecure-requests`. Chromium exempts
 *   127.0.0.1/localhost, but WebKit upgrades every script to https:// on the
 *   plain-http preview server and none of them load. The route below strips
 *   just that directive from the HTML so the scripts under test can run.
 */

const POST = '/2023/12/08/cathedral-bazaar-management/';

interface CopyCall {
  api: 'execCommand' | 'writeText';
  ok: boolean;
}

declare global {
  interface Window {
    __copyCalls: CopyCall[];
  }
}

test.beforeEach(async ({ context, browserName }) => {
  await context.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') return route.continue();
    const response = await route.fetch();
    const body = (await response.text()).replace(/upgrade-insecure-requests;?\s*/g, '');
    return route.fulfill({ response, body });
  });

  // Log which clipboard API ran and whether it reported success.
  await context.addInitScript(() => {
    window.__copyCalls = [];
    const doc = document as unknown as { execCommand: (cmd: string) => boolean };
    const originalExec = doc.execCommand.bind(document);
    doc.execCommand = (cmd: string) => {
      const ok = originalExec(cmd);
      if (cmd === 'copy') window.__copyCalls.push({ api: 'execCommand', ok });
      return ok;
    };
    const clipboard = navigator.clipboard;
    if (clipboard?.writeText) {
      const originalWrite = clipboard.writeText.bind(clipboard);
      clipboard.writeText = (text: string) =>
        originalWrite(text).then(
          () => void window.__copyCalls.push({ api: 'writeText', ok: true }),
          (err: unknown) => {
            window.__copyCalls.push({ api: 'writeText', ok: false });
            throw err;
          },
        );
    }
  });

  if (browserName === 'chromium') {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  }
});

/**
 * Assert the copy call succeeded and the clipboard holds `expected`. Reads it
 * back with `readText()` where the engine allows it (Chromium), otherwise by
 * pasting into a scratch textarea (WebKit). Call after any focus assertions:
 * the paste fallback moves focus.
 */
async function expectClipboard(page: Page, expected: string) {
  const calls = await page.evaluate(() => window.__copyCalls);
  expect(calls.length, 'a clipboard API was called').toBeGreaterThan(0);
  expect(calls.at(-1)?.ok, 'the last clipboard call reported success').toBe(true);

  const read = await page.evaluate(() =>
    navigator.clipboard.readText().then(
      (text) => ({ ok: true as const, text }),
      (err: unknown) => ({ ok: false as const, text: String(err) }),
    ),
  );

  let actual: string;
  let via: string;
  if (read.ok) {
    actual = read.text;
    via = 'readText';
  } else {
    await page.evaluate(() => {
      const scratch = document.createElement('textarea');
      scratch.id = 'clipboard-readback';
      document.body.append(scratch);
    });
    const scratch = page.locator('#clipboard-readback');
    await scratch.focus();
    await page.keyboard.press('ControlOrMeta+V');
    actual = await scratch.inputValue();
    via = `paste (readText: ${read.text})`;
  }

  test.info().annotations.push({
    type: 'clipboard',
    description: `copied via ${calls.map((c) => `${c.api}=${c.ok}`).join(', ')}; read back via ${via}`,
  });
  expect(actual).toBe(expected);
}

async function clearClipboardLog(page: Page) {
  await page.evaluate(() => {
    window.__copyCalls = [];
  });
}

test.describe('clipboard copy buttons', () => {
  test('LinkedIn field copy button', async ({ page }) => {
    await page.goto('/resume/linkedin/');
    const btn = page.locator('.copy-btn:not(.copy-description)').first();
    const expected = (await btn.getAttribute('data-copy')) ?? '';
    expect(expected).not.toBe('');

    await btn.click();
    await expect(btn).toHaveText('✓');
    await expect(btn).toBeFocused();
    await expectClipboard(page, expected);
  });

  test('LinkedIn description copy button keeps line breaks', async ({ page }) => {
    await page.goto('/resume/linkedin/');
    const btn = page.locator('.copy-btn.copy-description').first();
    const expected = await btn.evaluate(
      (el) => (el.parentElement?.querySelector('[data-description]') as HTMLElement | null)?.innerText.trim() ?? '',
    );
    expect(expected).toContain('\n');

    await btn.click();
    await expect(btn).toHaveText('✓');
    await expectClipboard(page, expected);
  });

  test('post share button copies the link when there is no share sheet', async ({ page, context }) => {
    // WebKit exposes navigator.share, which would open the OS sheet instead of
    // copying. Remove it so every engine exercises the copy fallback.
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    });
    await page.goto(POST);
    const btn = page.locator('[data-share-primary]').first();
    await expect(btn).toHaveText('Copy link');
    const expected = (await btn.getAttribute('data-share-url')) ?? '';
    expect(expected).toMatch(/^https?:\/\//);

    await btn.click();
    await expect(btn).toHaveText('Link copied');
    await expectClipboard(page, expected);
  });

  test('inline quote copies its deep link when there is no share sheet', async ({ page, context }) => {
    // WebKit exposes navigator.share, which would open the OS sheet instead of
    // copying. Remove it so every engine exercises the copy fallback.
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    });
    await page.goto(POST);
    const quote = page.locator('a.quote-inline').first();
    const id = await quote.getAttribute('id');
    await clearClipboardLog(page);

    await quote.click();
    await expect(quote).toHaveClass(/is-copied/);
    const expected = await page.evaluate((anchorId) => `${location.origin}${location.pathname}#${anchorId}`, id);
    await expectClipboard(page, expected);
  });

  test('`y` shortcut copies the canonical URL', async ({ page }) => {
    await page.goto(POST);
    const canonical = (await page.locator('link[rel="canonical"]').getAttribute('href')) ?? '';

    await page.keyboard.press('y');
    await expect(page.locator('.shortcut-toast')).toHaveText('Link copied');
    await expectClipboard(page, canonical);
  });
});
