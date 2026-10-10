/**
 * One-tap quote sharing.
 *
 * Inline quotes (:quote[text]{#id}) render as highlighted text followed by a
 * small share link to the quote's own in-post deep link (#quote-<id>). Without
 * JS, the link jumps to and highlights the line (via :target) and leaves the
 * shareable URL in the address bar.
 *
 * This progressively enhances the link into a single tap that shares the deep
 * link: the native share sheet where available (ideal on mobile), falling back
 * to copy-to-clipboard with visible and announced confirmation. Either way the
 * URL points back to the highlighted line in context, not to a standalone page.
 */

import { copyToClipboard } from '../utils/copy-to-clipboard';

/** How long the "Copied" confirmation stays visible (ms). */
const CONFIRM_MS = 2000;

/** Absolute URL of a quote's in-post deep link, built from its anchor id. */
function deepLink(quote: HTMLElement): string {
  return `${location.origin}${location.pathname}#${quote.id}`;
}

/** The quote's text, read from its highlighted mark (for the share payload). */
function quoteText(quote: HTMLElement): string {
  return quote.querySelector('.quote-inline-mark')?.textContent?.trim() ?? '';
}

/** One shared polite live region, so the copy fallback is announced. */
function liveRegion(): HTMLElement {
  let region = document.getElementById('quote-share-live');
  if (!region) {
    region = document.createElement('span');
    region.id = 'quote-share-live';
    region.className = 'sr-only';
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  return region;
}

function flashCopied(quote: HTMLElement): void {
  quote.classList.add('is-copied');
  const region = liveRegion();
  region.textContent = 'Link to quote copied';
  window.setTimeout(() => {
    quote.classList.remove('is-copied');
    region.textContent = '';
  }, CONFIRM_MS);
}

async function share(quote: HTMLElement): Promise<void> {
  const url = deepLink(quote);
  const text = quoteText(quote);

  // Show the shareable URL in the address bar without adding a history entry
  // or scrolling: the reader is already looking at the line.
  if (location.hash !== `#${quote.id}`) history.replaceState(history.state, '', `#${quote.id}`);

  // Native share sheet: the true one-tap path, best on mobile.
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text, url });
      return;
    } catch (err) {
      // User dismissed the sheet: do nothing. Only fall back on real errors.
      if (err instanceof DOMException && err.name === 'AbortError') return;
    }
  }

  // Fallback: copy the deep link and confirm.
  if (await copyToClipboard(url)) flashCopied(quote);
}

function init(): void {
  document.querySelectorAll<HTMLAnchorElement>('.quote-inline-share').forEach((link) => {
    const quote = link.closest<HTMLElement>('.quote-inline');
    if (!quote) return;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      void share(quote);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
