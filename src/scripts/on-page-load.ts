/**
 * Run a callback once the DOM is ready.
 *
 * Replaces `document.addEventListener('astro:page-load', fn)` in call sites
 * that don't rely on Astro's View Transitions (ClientRouter). The
 * `astro:page-load` event only fires when ClientRouter is mounted; after
 * removing it, initialization must run on `DOMContentLoaded` (or
 * immediately if the document is already parsed).
 */
export function onPageLoad(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    // Defer to the next microtask so callers can assume async semantics.
    queueMicrotask(callback);
  }
}
