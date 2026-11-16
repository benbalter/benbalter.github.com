/**
 * Footnotes toggle
 *
 * A post's footnotes list is folded into a closed <details> at build time
 * (src/lib/rehype-footnote-a11y.ts). This makes sure the fold is never a dead
 * end: anything that jumps to a footnote opens the list first. That covers a
 * click on a footnote number, the touch card's "Go to footnote" link, a deep
 * link on page load, and back/forward navigation. Printing opens it too.
 *
 * Chrome opens a <details> for a fragment link on its own; other browsers
 * may scroll nowhere, because a closed <details> gives its content no box.
 *
 * Without JavaScript the <details> still toggles by hand.
 */

import { onPageLoad } from './on-page-load';

const TOGGLE_SELECTOR = 'details.footnotes-toggle';

/**
 * Open the footnotes list if `hash` (with or without "#") names something
 * inside it. Returns the target when the list had to be opened.
 */
export function revealTarget(hash: string): HTMLElement | null {
  let id = hash.replace(/^#/, '');
  if (!id) return null;
  try {
    id = decodeURIComponent(id);
  } catch {
    // Malformed escape: look up the raw id
  }
  const target = document.getElementById(id);
  const toggle = target?.closest<HTMLDetailsElement>(TOGGLE_SELECTOR);
  if (!target || !toggle || toggle.open) return null;
  // Skip the slide-open animation (global.css) for this one opening: the
  // browser scrolls to the target right away, and until the list has its full
  // height the page isn't tall enough to scroll that far.
  toggle.dataset.instant = '';
  toggle.addEventListener('toggle', () => delete toggle.dataset.instant, { once: true });
  toggle.open = true;
  return target;
}

/** Same-page link clicks: open the list before the browser scrolls to the target */
function onClick(e: MouseEvent) {
  // On touch screens a tap on a footnote number opens its card instead of
  // navigating (link-previews.ts cancels the click), so the list stays folded.
  if (e.defaultPrevented) return;
  const anchor = (e.target as Element | null)?.closest?.('a[href]');
  if (!(anchor instanceof HTMLAnchorElement) || !anchor.hash) return;
  if (anchor.pathname !== location.pathname || anchor.host !== location.host) return;
  revealTarget(anchor.hash);
}

/** A hash the browser already tried to scroll to: open the list, then scroll again */
function revealCurrentHash() {
  revealTarget(location.hash)?.scrollIntoView();
}

function openAll() {
  for (const toggle of document.querySelectorAll<HTMLDetailsElement>(TOGGLE_SELECTOR)) {
    toggle.open = true;
  }
}

export function initFootnotes() {
  if (!document.querySelector(TOGGLE_SELECTOR)) return;
  // On the document, in the bubble phase: after any handler that cancels the
  // click, before the browser's default scroll, and it sees the touch card's
  // "Go to footnote" link, which lives at the end of <body>. Re-adding the
  // same listeners is a no-op.
  document.addEventListener('click', onClick);
  window.addEventListener('hashchange', revealCurrentHash);
  window.addEventListener('beforeprint', openAll);
  revealCurrentHash();
}

onPageLoad(initFootnotes);
