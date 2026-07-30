/**
 * E2E for the reading "Dynamic Island" pill (ReadingIsland.astro).
 *
 * The state-selection logic is unit-tested (reading-island-state.test.ts); these
 * tests assert the DOM wiring end to end: the right face shows for scroll,
 * selection, and reaching the subscribe card, and the pill stays on-screen.
 */
import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

const POST = '/2026/06/07/reorgs-happen/';

test.describe('Reading island', () => {
  test('shows "min left" progress once into the article body', async ({ page }) => {
    await page.goto(POST);
    await waitForPageReady(page);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));

    const island = page.locator('#reading-island');
    await expect.poll(() => island.getAttribute('data-state')).toBe('progress');
    await expect(page.locator('.reading-island-time')).toHaveText(/\d+ min left/);
  });

  test('morphs to Share when text is selected, and stays on-screen', async ({ page }) => {
    await page.goto(POST);
    await waitForPageReady(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));

    await page.evaluate(() => {
      const p = document.querySelector('.post-content p')!;
      const range = document.createRange();
      range.selectNodeContents(p);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
    });

    const island = page.locator('#reading-island');
    await expect.poll(() => island.getAttribute('data-state')).toBe('share');

    const pill = page.locator('.reading-island-pill');
    await expect(pill).toBeEnabled();
    await expect(pill).toHaveAttribute('aria-label', /share/i);

    // The pill must not overflow the viewport (regression: wide face clipped).
    const fits = await pill.evaluate(
      (el) => el.getBoundingClientRect().right <= window.innerWidth + 1
    );
    expect(fits).toBe(true);
  });

  test('morphs to the subscribe CTA when the subscribe card is in view', async ({ page }) => {
    await page.goto(POST);
    await waitForPageReady(page);

    await page.evaluate(() => {
      const card = document.querySelector('.subscribe-card')!;
      const y = card.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4;
      window.scrollTo(0, y);
    });

    const island = page.locator('#reading-island');
    await expect.poll(() => island.getAttribute('data-state'), { timeout: 5000 }).toBe('cta');
    await expect(page.locator('.reading-island-pill')).toHaveAttribute('aria-label', /subscribe/i);

    const fits = await page
      .locator('.reading-island-pill')
      .evaluate((el) => el.getBoundingClientRect().right <= window.innerWidth + 1);
    expect(fits).toBe(true);
  });
});
