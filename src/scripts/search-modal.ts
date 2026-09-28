import { escapeHtml } from '../utils/html-escape';
import { isTypingTarget } from '../utils/is-typing-target';

export interface PagefindResultData {
  url: string;
  meta?: { title?: string };
  excerpt: string;
}

interface PagefindResult {
  data(): Promise<PagefindResultData>;
}

interface PagefindSearch {
  results: PagefindResult[];
}

interface Pagefind {
  init(): Promise<void>;
  search(query: string): Promise<PagefindSearch>;
}

let pagefindLoaded = false;
let pagefind: Pagefind | null = null;
let previouslyFocusedElement: HTMLElement | null = null;

const EMPTY_PROMPT = '<div class="search-empty">Type to search posts, pages, and more…</div>';

function getModal() {
  return document.getElementById('search-modal') as HTMLDialogElement | null;
}

function getInput() {
  return document.getElementById('search-input') as HTMLInputElement | null;
}

/** Screen-reader text for a result count. */
export function resultCountLabel(count: number): string {
  if (count === 0) return 'No results';
  return count === 1 ? '1 result' : `${count} results`;
}

/**
 * Set the visually hidden role="status" region. It carries only a count, so
 * assistive tech hears "5 results" rather than the whole list re-read on
 * every keystroke.
 */
function announce(message: string) {
  const status = document.getElementById('search-status');
  if (status) status.textContent = message;
}

/**
 * Replace the contents of `container` with one link per result. Titles go in
 * as text; excerpts are Pagefind's own markup (only <mark> highlights around
 * escaped page text), so they are trusted as HTML.
 */
export function renderResults(container: HTMLElement, results: PagefindResultData[]) {
  container.innerHTML = '';
  results.forEach((result) => {
    const link = document.createElement('a');
    link.href = result.url;
    link.className = 'search-result';
    link.setAttribute('data-search-close', '');

    const titleSpan = document.createElement('span');
    titleSpan.className = 'search-result-title';
    titleSpan.textContent = result.meta?.title || 'Untitled';
    link.appendChild(titleSpan);

    const excerptSpan = document.createElement('span');
    excerptSpan.className = 'search-result-excerpt';
    excerptSpan.innerHTML = result.excerpt; // Pagefind excerpt contains safe HTML markup
    link.appendChild(excerptSpan);

    container.appendChild(link);
  });
}

/** Markup for the empty state when a query matches nothing. */
export function noResultsMessage(query: string): string {
  return `<div class="search-empty">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
}

async function loadPagefind() {
  if (pagefindLoaded) return;
  try {
    // Dynamic import at runtime — path resolved after pagefind indexes the built site
    const pf = '/pagefind/pagefind.js';
    pagefind = await import(/* @vite-ignore */ pf) as unknown as Pagefind;
    await pagefind.init();
    pagefindLoaded = true;
  } catch (e) {
    console.error('Failed to load Pagefind:', e);
  }
}

async function performSearch(query: string) {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;

  // Stamp of the query the visible results were rendered for. Cleared up
  // front so that, during the input debounce, the list is marked stale and
  // Enter can't open a result belonging to the previous query.
  delete resultsContainer.dataset.query;

  if (!query.trim()) {
    resultsContainer.innerHTML = EMPTY_PROMPT;
    announce('');
    return;
  }

  if (!pagefindLoaded) {
    resultsContainer.innerHTML = '<div class="search-empty">Loading search…</div>';
    await loadPagefind();
  }

  if (!pagefind) {
    resultsContainer.innerHTML = '<div class="search-empty">Search unavailable</div>';
    announce('Search unavailable');
    return;
  }

  // A pending debounce can land after the user has arrowed into the list. The
  // re-render below destroys the focused anchor, which would drop focus to
  // <body> and kill result navigation. The result set
  // is changing anyway, so the old selection is meaningless: send focus back
  // to the input, where the user can keep typing or arrow down again.
  const focusWasInResults = resultsContainer.contains(document.activeElement);

  const search = await pagefind.search(query);

  if (search.results.length === 0) {
    resultsContainer.innerHTML = noResultsMessage(query);
    announce(resultCountLabel(0));
    if (focusWasInResults) getInput()?.focus();
    return;
  }

  const results = await Promise.all(
    search.results.slice(0, 8).map((r) => r.data())
  );

  renderResults(resultsContainer, results);
  announce(resultCountLabel(results.length));

  resultsContainer.dataset.query = query.trim();

  if (focusWasInResults) getInput()?.focus();
}

/** Result anchors in DOM order — the list arrow keys and j/k walk. */
function getResults(): HTMLAnchorElement[] {
  const container = document.getElementById('search-results');
  return container ? [...container.querySelectorAll<HTMLAnchorElement>('.search-result')] : [];
}

/**
 * Move the selection by `delta` results.
 *
 * Selection is real DOM focus rather than aria-activedescendant: the
 * `.search-result:focus` styling already exists, Enter opens the link with no
 * extra code, and screen readers announce each result without extra ARIA.
 * Stepping up past the first result returns focus to the input so the user can
 * keep refining the query.
 */
export function moveSelection(delta: number) {
  const results = getResults();
  if (results.length === 0) return;

  const input = getInput();
  const active = document.activeElement as HTMLElement | null;
  const current = active instanceof HTMLAnchorElement ? results.indexOf(active) : -1;

  // From the input (current === -1), ArrowDown enters the list at the top and
  // ArrowUp jumps to the bottom, matching a command palette.
  if (current === -1) {
    (delta > 0 ? results[0] : results[results.length - 1]).focus();
    return;
  }

  const next = current + delta;
  if (next < 0) {
    input?.focus();
    return;
  }

  results[Math.min(next, results.length - 1)].focus();
}

/**
 * Arrow keys (anywhere in the modal) and j/k (once focus is in the list) walk
 * the results. j/k stay inert while the input has focus, so they remain
 * ordinary characters in a query — the same split GitHub uses between its
 * palette and its issue lists.
 */
export function handleResultNavigation(e: KeyboardEvent) {
  if (e.metaKey || e.ctrlKey || e.altKey || e.isComposing) return;

  const typing = isTypingTarget(e);

  if (e.key === 'ArrowDown' || (e.key === 'j' && !typing)) {
    e.preventDefault();
    moveSelection(1);
    return;
  }

  if (e.key === 'ArrowUp' || (e.key === 'k' && !typing)) {
    e.preventDefault();
    moveSelection(-1);
    return;
  }

  // Enter from the input opens the top result, so a search is query-then-Enter
  // without reaching for the arrows. Enter on a focused result is the browser's
  // own link activation, so leave it alone.
  if (e.key === 'Enter' && document.activeElement === getInput()) {
    const container = document.getElementById('search-results');
    // Typing and hitting Enter inside the 200ms debounce leaves the previous
    // query's results on screen. Opening one would navigate somewhere the
    // visitor never asked for, so wait for the list to catch up.
    if (container?.dataset.query !== getInput()?.value.trim()) return;

    const first = getResults()[0];
    if (first) {
      e.preventDefault();
      first.click();
    }
  }
}

function openSearch() {
  const modal = getModal();
  if (!modal || modal.open) return;

  previouslyFocusedElement = document.activeElement as HTMLElement | null;
  document.body.style.overflow = 'hidden';
  loadPagefind();

  // showModal() makes the rest of the page inert, contains focus, and focuses
  // the autofocus input. Focus explicitly too, in case an engine skips it.
  modal.showModal();
  getInput()?.focus();
}

function closeSearch() {
  getModal()?.close();
}

/**
 * Reset state after the dialog closes, however it closed: Esc, ⌘K, the close
 * button, a backdrop click, or a result click.
 */
function handleClose() {
  const input = getInput();
  document.body.style.overflow = '';
  if (input) input.value = '';
  const resultsContainer = document.getElementById('search-results');
  if (resultsContainer) {
    resultsContainer.innerHTML = EMPTY_PROMPT;
    delete resultsContainer.dataset.query;
  }
  announce('');
  previouslyFocusedElement?.focus();
  previouslyFocusedElement = null;
}

function initSearch() {
  const modal = getModal();
  const input = getInput();
  if (!modal) return;

  // Open triggers
  document.querySelectorAll('[data-search-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  // Close triggers
  modal.querySelectorAll('[data-search-close]').forEach((el) => {
    el.addEventListener('click', () => closeSearch());
  });

  modal.addEventListener('close', handleClose);

  // Search input
  let debounceTimer: ReturnType<typeof setTimeout>;
  input?.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(input.value);
    }, 200);
  });

  // Result navigation is scoped to the modal so j/k stay free page-wide
  modal.addEventListener('keydown', handleResultNavigation);

  // Keyboard shortcuts
  function handleKeyboardShortcut(e: KeyboardEvent) {
    // ⌘K or Ctrl+K to toggle
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (getModal()?.open) {
        closeSearch();
      } else {
        openSearch();
      }
    }

    // `/` to open — GitHub/GitLab/X/Vim muscle memory. Open-only, so a `/`
    // typed inside the query box stays a literal slash (`and/or`). Not gated
    // on shiftKey: `/` is a shifted key on AZERTY and other layouts, and
    // e.key already reports the produced character.
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTypingTarget(e)) {
      if (!getModal()?.open) {
        // Firefox binds `/` to quick-find; claim it before that happens.
        e.preventDefault();
        openSearch();
      }
    }

    // Escape to close. A <dialog> closes on Esc by itself, but a search input
    // holding a query can spend the first Esc clearing its value; close in one
    // press, as before.
    if (e.key === 'Escape' && getModal()?.open) {
      e.preventDefault();
      closeSearch();
    }
  }
  document.addEventListener('keydown', handleKeyboardShortcut);

  // Close on backdrop or result click; a result click also stores the query
  // for highlighting on the destination page.
  modal.addEventListener('click', (e) => {
    // A <dialog> stretches its backdrop over the whole viewport but reports
    // clicks on it as clicks on the dialog, so compare against the panel's own
    // box. Keyboard-triggered clicks report 0,0; ignore those.
    if (e.target === modal) {
      const box = modal.getBoundingClientRect();
      const outside =
        e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom;
      if (outside && (e.clientX !== 0 || e.clientY !== 0)) closeSearch();
      return;
    }

    const target = e.target as HTMLElement;
    if (target.closest('.search-result')) {
      const query = input?.value?.trim();
      if (query) {
        sessionStorage.setItem('search-highlight', query);
      }
      closeSearch();
    }
  });
}

function highlightSearchTerms() {
  const query = sessionStorage.getItem('search-highlight');
  if (!query) return;
  sessionStorage.removeItem('search-highlight');

  const article = document.querySelector('[data-pagefind-body]');
  if (!article) return;

  const terms = query.toLowerCase().split(/\s+/).filter((t: string) => t.length > 2);
  if (!terms.length) return;

  // Walk text nodes and wrap matches in <mark>
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const text = node.textContent?.toLowerCase() || '';
    if (terms.some((t: string) => text.includes(t))) {
      textNodes.push(node);
    }
  }

  const pattern = new RegExp(`(${terms.map((t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

  textNodes.forEach((node) => {
    const text = node.textContent || '';
    const parts = text.split(pattern);
    if (parts.length <= 1) return;

    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (pattern.test(part)) {
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = part;
        frag.appendChild(mark);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
      pattern.lastIndex = 0;
    });
    node.parentNode?.replaceChild(frag, node);
  });

  // Add dismiss banner
  const firstMark = article.querySelector('mark.search-highlight');
  if (firstMark) {
    const banner = document.createElement('div');
    banner.className = 'search-highlight-banner';
    banner.innerHTML = `Highlighting "<strong>${escapeHtml(query)}</strong>" <button type="button" aria-label="Clear highlights">✕</button>`;
    banner.querySelector('button')?.addEventListener('click', () => {
      article.querySelectorAll('mark.search-highlight').forEach((m) => {
        const parent = m.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(m.textContent || ''), m);
          parent.normalize();
        }
      });
      banner.remove();
    });
    // Insert banner into the prose content area for proper alignment
    const proseContainer = article.querySelector('.entrybody, .prose') || article;
    proseContainer.insertBefore(banner, proseContainer.firstChild);

    // Scroll to first match
    firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Initialize on each page load.
import { onPageLoad } from './on-page-load';
onPageLoad(() => {
  initSearch();
  highlightSearchTerms();
});
