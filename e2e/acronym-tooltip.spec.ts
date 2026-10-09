import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

test.describe('Acronym Tooltip', () => {
  // A known post whose body has an auto-tooltipped acronym (WIP)
  const testPostUrl = '/2015/12/08/types-of-pull-requests/';

  test('should render body acronyms with tooltip attributes', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    // Check acronym tooltip is visible
    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();
    await expect(acronym).toHaveText('WIP');

    // Check tooltip attributes are present
    await expect(acronym).toHaveAttribute('data-tooltip', 'true');
    await expect(acronym).toHaveAttribute('data-tooltip-text');

    // Verify tooltip text contains expected content
    const tooltipText = await acronym.getAttribute('data-tooltip-text');
    expect(tooltipText).toContain('Work in progress');
  });

  test('should show tooltip on hover (desktop)', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();

    // The acronym is mid-article. Scroll it into view instantly first: hover()
    // would scroll it with the page's smooth scrolling, and the tooltip runtime
    // closes the tooltip on scroll.
    await acronym.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await acronym.hover();

    // Check tooltip is visible (wait up to 1s)
    const tooltip = page.locator('.custom-tooltip.show');
    await expect(tooltip).toBeVisible({ timeout: 1000 });
    await expect(tooltip).toContainText('Work in progress');

    // Move mouse away
    await page.mouse.move(0, 0);

    // Tooltip should be gone (wait up to 1s for removal)
    await expect(tooltip).not.toBeAttached({ timeout: 1000 });
  });

  test('should toggle tooltip on click/tap (mobile)', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();

    // Dispatch click event to simulate pure tap without mouse events
    await acronym.dispatchEvent('click');

    // Check tooltip is visible (wait up to 1s)
    const tooltip = page.locator('.custom-tooltip.show');
    await expect(tooltip).toBeVisible({ timeout: 1000 });
    await expect(tooltip).toContainText('Work in progress');

    // Dispatch click again to hide tooltip
    await acronym.dispatchEvent('click');

    // Tooltip should be completely gone from DOM (wait up to 1s)
    const anyTooltip = page.locator('.custom-tooltip');
    await expect(anyTooltip).not.toBeAttached({ timeout: 1000 });
  });

  test('should close tooltip when clicking outside', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();

    // Dispatch a bare click to show the tooltip. Playwright's click() also
    // hovers, and on hover-capable devices that shows it first, so the click
    // would toggle it straight back off.
    await acronym.dispatchEvent('click');

    // Check tooltip is visible (wait up to 1s)
    const tooltip = page.locator('.custom-tooltip.show');
    await expect(tooltip).toBeVisible({ timeout: 1000 });

    // Click somewhere else on the page
    await page.locator('body').click({ position: { x: 100, y: 100 } });

    // Tooltip should be completely gone from DOM (wait up to 1s)
    const anyTooltip = page.locator('.custom-tooltip');
    await expect(anyTooltip).not.toBeAttached({ timeout: 1000 });
  });

  test('should close tooltip when scrolling', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();

    // Dispatch a bare click to show the tooltip. Playwright's click() also
    // hovers, and on hover-capable devices that shows it first, so the click
    // would toggle it straight back off.
    await acronym.dispatchEvent('click');

    // Check tooltip is visible (wait up to 1s)
    const tooltip = page.locator('.custom-tooltip.show');
    await expect(tooltip).toBeVisible({ timeout: 1000 });

    // Scroll the page
    await page.evaluate(() => window.scrollBy(0, 100));

    // Tooltip should be completely gone from DOM (wait up to 1s)
    const anyTooltip = page.locator('.custom-tooltip');
    await expect(anyTooltip).not.toBeAttached({ timeout: 1000 });
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();

    // Check for help cursor style
    const cursorStyle = await acronym.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    expect(cursorStyle).toBe('help');

    // Check element is clickable and interactive
    await expect(acronym).toHaveAttribute('data-tooltip', 'true');
    await expect(acronym).toHaveAttribute('data-tooltip-text');
    
    // WAI-ARIA tooltip pattern: an abbreviation with a description, not a
    // button. It's focusable (tabindex) and carries a native title, but has
    // no role/aria-expanded — the tooltip is associated via aria-describedby
    // only while shown (see the keyboard tests below).
    await expect(acronym).toHaveAttribute('tabindex', '0');
    await expect(acronym).toHaveAttribute('title');
    expect(await acronym.getAttribute('role')).toBeNull();
    expect(await acronym.getAttribute('aria-expanded')).toBeNull();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();

    // Focusing the element reveals the tooltip (tooltip pattern shows on
    // hover AND keyboard focus).
    await acronym.focus();

    // Check tooltip is visible and the description is associated via ARIA.
    const tooltip = page.locator('.custom-tooltip[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 1000 });
    await expect(acronym).toHaveAttribute('aria-describedby');

    // Press Escape to hide tooltip
    await page.keyboard.press('Escape');

    // Tooltip should be gone and the association cleared
    await expect(tooltip).not.toBeAttached({ timeout: 1000 });
    expect(await acronym.getAttribute('aria-describedby')).toBeNull();
  });

  test('should handle Space key to toggle tooltip', async ({ page }) => {
    await page.goto(testPostUrl);
    await waitForPageReady(page);

    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();

    // Focusing reveals the tooltip; Space then toggles it.
    await acronym.focus();
    const tooltip = page.locator('.custom-tooltip[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 1000 });

    // Press Space to toggle the tooltip off
    await page.keyboard.press('Space');
    await expect(tooltip).not.toBeAttached({ timeout: 1000 });
    expect(await acronym.getAttribute('aria-describedby')).toBeNull();

    // Press Space again to toggle it back on
    await page.keyboard.press('Space');
    await expect(page.locator('.custom-tooltip[role="tooltip"]')).toBeVisible({ timeout: 1000 });
    await expect(acronym).toHaveAttribute('aria-describedby');
  });

  test('should work after navigation via View Transitions', async ({ page }) => {
    // Start on the posts listing (the test post is too old for the homepage)
    await page.goto('/posts/');
    await waitForPageReady(page);

    // Navigate to a post with an acronym using a link (this triggers View Transitions)
    await page.click('a[href*="/2015/12/08/types-of-pull-requests/"]');
    await page.waitForURL('**/2015/12/08/types-of-pull-requests/');
    await waitForPageReady(page);

    // Check acronym tooltip is visible after navigation
    const acronym = page.locator('.post-content abbr.initialism');
    await expect(acronym).toBeVisible();

    // Wait for the tooltip runtime to wire up the new page's acronym
    await expect(acronym).toHaveAttribute('data-tooltip-initialized', 'true');
    await expect(acronym).toHaveText('WIP');

    // Verify tooltip still works after navigation (bare click; see above)
    await acronym.dispatchEvent('click');

    // Check tooltip is visible
    const tooltip = page.locator('.custom-tooltip.show');
    await expect(tooltip).toBeVisible({ timeout: 1000 });
    await expect(tooltip).toContainText('Work in progress');

    // Clean up - click again to hide
    await acronym.dispatchEvent('click');
    await expect(tooltip).not.toBeAttached({ timeout: 1000 });
  });
});
