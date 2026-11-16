import { test, expect, devices } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { scrollIntoViewInstantly, waitForPageReady } from './helpers';

/**
 * A post's footnotes list is folded into a closed <details> so it doesn't
 * push the share bar and the book down the page (rehype-footnote-a11y.ts).
 * Anything that jumps to a footnote opens it first (src/scripts/footnotes.ts).
 */
test.describe('Footnotes toggle', () => {
  // A known post with seven footnotes and no off-site images to wait on
  const postUrl = '/2015/04/22/the-difference-between-18f-and-usds/';
  const FOOTNOTES = 7;

  test('is one closed row right above the share bar', async ({ page }) => {
    await page.goto(postUrl);
    await waitForPageReady(page);

    const toggle = page.locator('.footnotes details.footnotes-toggle');
    const summary = toggle.locator('summary');
    await expect(toggle).not.toHaveAttribute('open', /.*/);
    await expect(summary).toHaveText(`Footnotes · ${FOOTNOTES}`);
    await expect(toggle.locator('ol')).toBeHidden();
    // Folded away, not removed: search and hover cards still read the text
    await expect(toggle.locator('ol > li')).toHaveCount(FOOTNOTES);

    const section = await page.locator('.footnotes').boundingBox();
    const share = await page.locator('.post-share').boundingBox();
    expect(section!.height).toBeLessThan(60);
    expect(section!.height).toBeGreaterThanOrEqual(44);
    // The share bar's top rule closes the row: no empty band between them
    expect(share!.y - (section!.y + section!.height)).toBeLessThan(4);
  });

  test('opens and closes from the row, by mouse and keyboard', async ({ page }) => {
    await page.goto(postUrl);
    await waitForPageReady(page);

    const toggle = page.locator('details.footnotes-toggle');
    const summary = toggle.locator('summary');
    await scrollIntoViewInstantly(summary);

    await summary.click();
    await expect(toggle.locator('ol')).toBeVisible();

    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(toggle.locator('ol')).toBeHidden();
  });

  test('clicking a footnote number opens the list at that footnote, and ↩ returns', async ({ page }) => {
    await page.goto(postUrl);
    await waitForPageReady(page);

    const ref = page.locator('.post-content a[data-footnote-ref]').nth(2);
    await scrollIntoViewInstantly(ref);
    await ref.click();

    const footnote = page.locator('#user-content-fn-3');
    await expect(page.locator('details.footnotes-toggle')).toHaveAttribute('open', /.*/);
    await expect(footnote).toBeInViewport();

    await footnote.locator('a[data-footnote-backref]').click();
    await expect(ref).toBeInViewport();
    // The list stays open once the reader has opened it
    await expect(footnote).toBeVisible();
  });

  test('a deep link to a footnote opens the list on load', async ({ page }) => {
    await page.goto(`${postUrl}#user-content-fn-4`);
    await waitForPageReady(page);

    await expect(page.locator('details.footnotes-toggle')).toHaveAttribute('open', /.*/);
    await expect(page.locator('#user-content-fn-4')).toBeInViewport();
  });

  test('a link to something else leaves the list closed', async ({ page }) => {
    await page.goto(`${postUrl}#footnote-label`);
    await waitForPageReady(page);

    await expect(page.locator('details.footnotes-toggle ol')).toBeHidden();
  });

  test('printing opens the list and drops the toggle row', async ({ page }) => {
    await page.goto(postUrl);
    await waitForPageReady(page);

    await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
    await page.emulateMedia({ media: 'print' });

    await expect(page.locator('details.footnotes-toggle ol')).toBeVisible();
    await expect(page.locator('details.footnotes-toggle summary')).toBeHidden();
  });

  test('has no accessibility violations, closed or open', async ({ page }) => {
    await page.goto(postUrl);
    await waitForPageReady(page);

    const scan = () => new AxeBuilder({ page }).include('.footnotes').analyze();
    expect((await scan()).violations).toEqual([]);

    await page.locator('details.footnotes-toggle summary').click();
    await expect(page.locator('details.footnotes-toggle ol')).toBeVisible();
    expect((await scan()).violations).toEqual([]);
  });

  test('on a phone, the tap card’s "Go to footnote" opens the list', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['Pixel 7'] });
    const page = await context.newPage();
    await page.goto(postUrl);
    await waitForPageReady(page);

    const ref = page.locator('.post-content a[data-footnote-ref]').first();
    await scrollIntoViewInstantly(ref);
    await ref.tap();

    const jump = page.locator('.link-preview-jump');
    await expect(jump).toBeVisible();
    // Reading the footnote in the card doesn't unfold the list
    await expect(page.locator('details.footnotes-toggle ol')).toBeHidden();

    await jump.tap();
    await expect(page.locator('details.footnotes-toggle')).toHaveAttribute('open', /.*/);
    await expect(page.locator('#user-content-fn-1')).toBeInViewport();

    await context.close();
  });
});
