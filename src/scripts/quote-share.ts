/**
 * One-tap quote sharing.
 *
 * Inline quotes (:quote[text]{#id}) render as an anchor to their own in-post
 * deep link (#quote-<id>). Without JS, clicking one jumps to and highlights the
 * line (via :target) and leaves the shareable URL in the address bar.
 *
 * This progressively enhances that click into a single tap that shares the deep
 * link — the native share sheet where available (ideal on mobile: LinkedIn, X,
 * Messages, etc.), falling back to copy-to-clipboard with brief confirmation.
 * Either way the URL points back to the highlighted line in context, not to a
 * standalone page.
 */

import { copyToClipboard } from '../utils/copy-to-clipboard';

/** How long the "Copied" confirmation stays visible (ms). */
const CONFIRM_MS = 2000;

/** Absolute URL of a quote's in-post deep link, built from its anchor id. */
function deepLink(anchor: HTMLElement): string {
  return `${location.origin}${location.pathname}#${anchor.id}`;
}

/** The quote's text, read from its highlighted mark (for the share payload). */
function quoteText(anchor: HTMLElement): string {
  return anchor.querySelector('.quote-inline-mark')?.textContent?.trim() ?? '';
}

function flashCopied(anchor: HTMLElement): void {
  anchor.classList.add('is-copied');
  window.setTimeout(() => anchor.classList.remove('is-copied'), CONFIRM_MS);
}

async function share(anchor: HTMLElement): Promise<void> {
  const url = deepLink(anchor);
  const text = quoteText(anchor);

  // Reflect the deep link so :target scrolls to and highlights the line, and
  // the address bar shows the shareable URL — matching the no-JS behavior.
  if (location.hash !== `#${anchor.id}`) location.hash = anchor.id;

  // Native share sheet — the true one-tap path, best on mobile.
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text, url });
      return;
    } catch (err) {
      // User dismissed the sheet — do nothing. Only fall back on real errors.
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }
  }

  // Fallback: copy the deep link and confirm.
  if (await copyToClipboard(url)) flashCopied(anchor);
}

function init(): void {
  document.querySelectorAll<HTMLElement>('a.quote-inline').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      void share(anchor);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
