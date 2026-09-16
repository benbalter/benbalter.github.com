/**
 * Site-wide keyboard shortcuts: `?` (cheatsheet), `g h` / `g p` (go to), and
 * `y` (copy link to this page).
 *
 * Search keeps its own handlers in search-modal.ts, since `/`, ⌘K, and the
 * result navigation are scoped to that modal. Everything here is a bare key,
 * so every branch runs behind isTypingTarget and bails on ⌘/Ctrl/Alt.
 *
 * The visible key list lives in src/data/shortcuts.ts and renders in
 * src/components/ShortcutsModal.astro.
 */

import { copyToClipboard } from '../utils/copy-to-clipboard';
import { isTypingTarget } from '../utils/is-typing-target';
import { onPageLoad } from './on-page-load';

/** How long a `g` stays armed waiting for its second key (ms). */
const CHORD_TIMEOUT_MS = 1500;

/** How long the copy confirmation stays on screen (ms). */
const TOAST_MS = 2000;

/** Second key of a `g` chord to its destination. */
const GO_TO_DESTINATIONS: Record<string, string> = {
  h: '/',
  p: '/posts/',
};

let cssPromise: Promise<unknown> | null = null;
let chordTimer: ReturnType<typeof setTimeout> | null = null;
let chordArmed = false;

/**
 * Inject the cheatsheet + toast stylesheet on first use, mirroring the search
 * modal's split: Vite code-splits the dynamic CSS import and appends the
 * <link> at runtime. Note that astro.config's `inlineStylesheets: 'always'`
 * currently folds both chunks back into each page's inline <style>, so the
 * split buys nothing today. It is kept consistent with the search modal so
 * both pay off together if that setting is ever relaxed.
 */
function loadShortcutsCss() {
  if (!cssPromise) {
    cssPromise = import('../styles/shortcuts-modal.css').catch((e) => {
      cssPromise = null;
      console.error('Failed to load shortcuts CSS:', e);
    });
  }
  return cssPromise;
}

function getDialog() {
  return document.getElementById('shortcuts-modal') as HTMLDialogElement | null;
}

/** True when the search modal is open, so its keys win over the global ones. */
function isSearchOpen() {
  const modal = document.getElementById('search-modal');
  return !!modal && !modal.hidden;
}

function disarmChord() {
  chordArmed = false;
  if (chordTimer) {
    clearTimeout(chordTimer);
    chordTimer = null;
  }
}

function openCheatsheet() {
  const dialog = getDialog();
  if (!dialog || dialog.open) return;
  loadShortcutsCss();
  dialog.showModal();
}

function closeCheatsheet() {
  getDialog()?.close();
}

/**
 * Announce a shortcut's result. role="status" so assistive tech hears it
 * without the focus move a dialog would force.
 */
async function toast(message: string) {
  await loadShortcutsCss();

  document.querySelector('.shortcut-toast')?.remove();

  const el = document.createElement('div');
  el.className = 'shortcut-toast';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.textContent = message;
  document.body.appendChild(el);

  requestAnimationFrame(() => el.classList.add('is-visible'));
  setTimeout(() => {
    el.classList.remove('is-visible');
    setTimeout(() => el.remove(), 200);
  }, TOAST_MS);
}

/**
 * The page's canonical URL, so a copied link is the one that should be shared
 * rather than whatever query string or hash the visitor happens to be on.
 */
function canonicalUrl() {
  const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  return link?.href || location.href;
}

async function copyPageLink() {
  const ok = await copyToClipboard(canonicalUrl());
  await toast(ok ? 'Link copied' : 'Could not copy link');
}

function handleShortcut(e: KeyboardEvent) {
  if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e)) {
    disarmChord();
    return;
  }

  // `?` is Shift+/ on US layouts, so match the produced character rather than
  // gating on shiftKey, which would break layouts that place it elsewhere.
  if (e.key === '?') {
    // Search owns the keyboard while its modal is open.
    if (isSearchOpen()) return;
    e.preventDefault();
    disarmChord();
    const dialog = getDialog();
    if (dialog?.open) {
      closeCheatsheet();
    } else {
      openCheatsheet();
    }
    return;
  }

  // Past this point a modal owns the keyboard: Esc and the dialog's own focus
  // trap take over, and `y`/`g` would otherwise fire from a focused result.
  if (isSearchOpen() || getDialog()?.open) {
    disarmChord();
    return;
  }

  // `g` arms a chord; the next key picks the destination. Anything else
  // disarms, so a stray `g` never swallows the following keystroke.
  if (chordArmed) {
    const destination = GO_TO_DESTINATIONS[e.key];
    disarmChord();
    if (destination) {
      e.preventDefault();
      location.href = destination;
    }
    return;
  }

  if (e.key === 'g') {
    e.preventDefault();
    chordArmed = true;
    chordTimer = setTimeout(disarmChord, CHORD_TIMEOUT_MS);
    return;
  }

  if (e.key === 'y') {
    e.preventDefault();
    void copyPageLink();
  }
}

function init() {
  const dialog = getDialog();
  if (!dialog) return;

  dialog.querySelectorAll('[data-shortcuts-close]').forEach((el) => {
    el.addEventListener('click', () => closeCheatsheet());
  });

  // Click outside the panel closes it. A <dialog> stretches its backdrop over
  // the whole viewport but reports clicks on it as clicks on the dialog, so
  // compare against the panel's own box.
  dialog.addEventListener('click', (e) => {
    const box = dialog.getBoundingClientRect();
    const outside =
      e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom;
    // Keyboard-triggered clicks report 0,0; ignore those.
    if (outside && (e.clientX !== 0 || e.clientY !== 0)) closeCheatsheet();
  });

  document.addEventListener('keydown', handleShortcut);
}

onPageLoad(init);
