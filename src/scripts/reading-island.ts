/**
 * Controller for the reading "Dynamic Island" pill (ReadingIsland.astro).
 *
 * Feeds live inputs — scroll progress, text selection, and whether the subscribe
 * card is in view — into the pure state machine (reading-island-state.ts), then
 * applies the resulting state to the DOM: toggles the active face, fills in the
 * time, and fluidly resizes the pill to fit. Reuses the same building blocks as
 * the rest of the site (formatTimeRemaining, copyToClipboard, the quote-share
 * share shape, and track) so behavior stays consistent.
 */
import { subscribeReadingProgress } from './reading-progress-core';
import { selectReadingIslandState, type ReadingIslandState } from './reading-island-state';
import { formatTimeRemaining } from '../utils/time-remaining';
import { copyToClipboard } from '../utils/copy-to-clipboard';
import { track } from './track';

/** How long the "copied" confirmation stays visible (ms). */
const CONFIRM_MS = 2000;

function init(): void {
  const island = document.getElementById('reading-island');
  const body = document.querySelector<HTMLElement>('.post-content');
  if (!island || !body) return;

  const pill = island.querySelector<HTMLButtonElement>('.reading-island-pill');
  const timeEl = island.querySelector<HTMLElement>('.reading-island-time');
  const shareLabel = island.querySelector<HTMLElement>('.reading-island-share-label');
  const status = island.querySelector<HTMLElement>('.reading-island-status');
  const faces = new Map<ReadingIslandState, HTMLElement>();
  island.querySelectorAll<HTMLElement>('.reading-island-face').forEach((f) => {
    faces.set(f.dataset.face as ReadingIslandState, f);
  });
  if (!pill || !timeEl || !shareLabel || !status) return;

  const readingTime = Number(island.dataset.readingTime || 0);

  // Live inputs.
  let ratio = 0;
  let hasSelection = false;
  let selectionText = '';
  let ctaVisible = false;
  let current: ReadingIslandState | null = null;

  /** Absolute URL of the current post, without any hash. */
  const postUrl = (): string => `${location.origin}${location.pathname}`;

  function timeLabel(): string {
    return formatTimeRemaining(readingTime, ratio);
  }

  function render(next: ReadingIslandState): void {
    island!.dataset.state = next;
    island!.toggleAttribute('hidden', next === 'hidden');

    const interactive = next === 'share' || next === 'cta';
    pill!.disabled = !interactive;
    pill!.tabIndex = interactive ? 0 : -1;
    if (next === 'share') pill!.setAttribute('aria-label', 'Share the selected text');
    else if (next === 'cta') pill!.setAttribute('aria-label', 'Subscribe to get new posts by email');
    else pill!.removeAttribute('aria-label');
    pill!.setAttribute('aria-hidden', interactive ? 'false' : 'true');

    // Fluidly resize the pill to the active face's natural width.
    const face = next !== 'hidden' ? faces.get(next) : undefined;
    if (face) pill!.style.width = `${face.offsetWidth}px`;
  }

  function update(): void {
    if (timeEl) timeEl.textContent = timeLabel();

    let next = selectReadingIslandState({ ratio, hasSelection, ctaVisible });
    // Nothing useful to show in the progress state without a time estimate.
    if (next === 'progress' && !timeLabel()) next = 'hidden';

    if (next === current) return;
    current = next;
    render(next);
  }

  function flashCopied(): void {
    if (!shareLabel || !status) return;
    const original = shareLabel.textContent;
    shareLabel.textContent = 'Copied';
    status.textContent = 'Link to selection copied to clipboard';
    if (current === 'share') pill!.style.width = `${faces.get('share')!.offsetWidth}px`;
    window.setTimeout(() => {
      shareLabel.textContent = original;
      status.textContent = '';
      if (current === 'share') pill!.style.width = `${faces.get('share')!.offsetWidth}px`;
    }, CONFIRM_MS);
  }

  async function share(): Promise<void> {
    const url = postUrl();
    const text = selectionText;
    if (!text) return;

    // Native share sheet — the true one-tap path, best on mobile.
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, text, url });
        track('island-share');
        return;
      } catch (err) {
        // User dismissed the sheet — do nothing. Only fall back on real errors.
        if (err instanceof DOMException && err.name === 'AbortError') return;
      }
    }

    if (await copyToClipboard(`${text} — ${url}`)) {
      flashCopied();
      track('island-share');
    }
  }

  function goToSubscribe(): void {
    const card = document.querySelector<HTMLElement>('.subscribe-card');
    if (!card) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    const email = card.querySelector<HTMLInputElement>('input[type="email"]');
    if (email) window.setTimeout(() => email.focus({ preventScroll: true }), reduce ? 0 : 400);
    track('island-subscribe-cta');
  }

  // Share via pointerdown so preventDefault keeps the text selection intact
  // (a plain click would collapse it before the handler runs).
  pill.addEventListener('pointerdown', (event) => {
    if (current === 'share') {
      event.preventDefault();
      void share();
    }
  });
  pill.addEventListener('click', () => {
    if (current === 'cta') goToSubscribe();
  });

  // Inputs → state.
  subscribeReadingProgress((r) => {
    ratio = r;
    update();
  });

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim() ?? '';
    const within =
      !!sel &&
      sel.rangeCount > 0 &&
      !!sel.anchorNode &&
      !!sel.focusNode &&
      body!.contains(sel.anchorNode) &&
      body!.contains(sel.focusNode);
    const next = text.length > 0 && within;
    if (next) selectionText = text;
    if (next !== hasSelection) {
      hasSelection = next;
      update();
    }
  });

  const card = document.querySelector('.subscribe-card');
  if (card && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        ctaVisible = entries.some((e) => e.isIntersecting);
        update();
      },
      { rootMargin: '0px 0px -20% 0px' }
    ).observe(card);
  }

  update();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
