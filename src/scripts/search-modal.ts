interface PagefindResult {
  data(): Promise<{ url: string; meta?: { title?: string }; excerpt: string }>;
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

const FOCUSABLE_SELECTOR = 'input, button, a[href], [tabindex]:not([tabindex="-1"])';

function getModal() {
  return document.getElementById('search-modal');
}

function getInput() {
  return document.getElementById('search-input') as HTMLInputElement | null;
}

function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab') return;

  const modal = getModal();
  if (!modal || modal.hidden) return;

  const focusable = [...modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (el) => el.offsetParent !== null
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
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

  if (!query.trim()) {
    resultsContainer.innerHTML = '<div class="search-empty">Type to search posts, pages, and more…</div>';
    return;
  }

  if (!pagefindLoaded) {
    resultsContainer.innerHTML = '<div class="search-empty">Loading search…</div>';
    await loadPagefind();
  }

  if (!pagefind) {
    resultsContainer.innerHTML = '<div class="search-empty">Search unavailable</div>';
    return;
  }

  const search = await pagefind.search(query);

  if (search.results.length === 0) {
    resultsContainer.innerHTML = `<div class="search-empty">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
    return;
  }

  const results = await Promise.all(
    search.results.slice(0, 8).map((r) => r.data())
  );

  resultsContainer.innerHTML = '';
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

    resultsContainer.appendChild(link);
  });
}

function escapeHtml(str: string) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function openSearch() {
  const modal = getModal();
  const input = getInput();
  if (!modal) return;

  previouslyFocusedElement = document.activeElement as HTMLElement | null;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  loadPagefind();

  requestAnimationFrame(() => {
    modal.classList.add('open');
    input?.focus();
  });
}

function closeSearch() {
  const modal = getModal();
  const input = getInput();
  if (!modal) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';

  setTimeout(() => {
    modal.hidden = true;
    if (input) input.value = '';
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = '<div class="search-empty">Type to search posts, pages, and more…</div>';
    }
    previouslyFocusedElement?.focus();
    previouslyFocusedElement = null;
  }, 200);
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

  // Search input
  let debounceTimer: ReturnType<typeof setTimeout>;
  input?.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(input.value);
    }, 200);
  });

  // Focus trap
  document.addEventListener('keydown', trapFocus);

  // Keyboard shortcuts — use a stable function reference so duplicate
  // registrations across view transitions are no-ops.
  function handleKeyboardShortcut(e: KeyboardEvent) {
    // ⌘K or Ctrl+K to open
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const m = getModal();
      if (m?.hidden) {
        openSearch();
      } else {
        closeSearch();
      }
    }

    // Escape to close
    if (e.key === 'Escape') {
      const m = getModal();
      if (m && !m.hidden) {
        e.preventDefault();
        closeSearch();
      }
    }
  }
  document.addEventListener('keydown', handleKeyboardShortcut);

  // Close on result click (navigate) and store query for highlighting
  modal.addEventListener('click', (e) => {
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
