/**
 * Link Preview Hover Cards
 *
 * When a user hovers over an internal post link, shows a card with the
 * linked post's title and description. Anchor-aware: for deep links
 * (e.g., /2023/01/10/post/#heading), also shows the target section name.
 *
 * - Lazy-loads the post metadata JSON on first hover (then caches)
 * - Positions the card intelligently relative to the viewport
 * - Supports keyboard focus for accessibility
 * - Works with Astro View Transitions via astro:page-load
 */

/** URL pattern for blog post links: /YYYY/MM/DD/slug/ */
const POST_URL_PATTERN = /^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/?/;

/** Delay before showing the card (ms) */
const SHOW_DELAY = 300;

/** Delay before hiding the card (ms) — allows hovering over the card itself */
const HIDE_DELAY = 200;

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface PostMeta {
  title: string;
  description: string;
  headings: Heading[];
}

type MetaMap = Record<string, PostMeta>;

let metaCache: MetaMap | null = null;
let fetchPromise: Promise<MetaMap> | null = null;

/** Lazy-load and cache the posts metadata JSON */
async function getPostsMeta(): Promise<MetaMap> {
  if (metaCache) return metaCache;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch('/posts-meta.json')
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load posts metadata: ${res.status}`);
      return res.json() as Promise<MetaMap>;
    })
    .then((data) => {
      metaCache = data;
      return data;
    })
    .catch((err) => {
      console.error('[link-previews]', err);
      fetchPromise = null;
      return {} as MetaMap;
    });

  return fetchPromise;
}

/** Normalize a URL path: strip origin, ensure trailing slash */
function normalizePath(href: string): { path: string; hash: string } {
  try {
    const url = new URL(href, window.location.origin);
    let path = url.pathname;
    if (!path.endsWith('/')) path += '/';
    return { path, hash: url.hash.slice(1) }; // strip leading #
  } catch {
    return { path: '', hash: '' };
  }
}

/** Check if this is an internal post link worth previewing */
function isPostLink(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute('href');
  if (!href) return false;

  // Skip links that are themselves inside the preview card
  if (anchor.closest('.link-preview-card')) return false;

  // Only same-origin links
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;
  } catch {
    return false;
  }

  const { path } = normalizePath(href);

  // Skip self-links (same page)
  const currentPath = normalizePath(window.location.href).path;
  if (path === currentPath) return false;

  return POST_URL_PATTERN.test(path);
}

// --- Card element management ---

let card: HTMLDivElement | null = null;
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let activeAnchor: HTMLAnchorElement | null = null;

function getOrCreateCard(): HTMLDivElement {
  if (card) return card;

  card = document.createElement('div');
  card.className = 'link-preview-card';
  card.setAttribute('role', 'tooltip');
  card.style.display = 'none';

  // Keep card visible when hovering over it
  card.addEventListener('mouseenter', () => clearHideTimer());
  card.addEventListener('mouseleave', () => scheduleHide());

  document.body.appendChild(card);
  return card;
}

function clearShowTimer() {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
}

function clearHideTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function hideCard() {
  clearShowTimer();
  clearHideTimer();

  if (card) {
    card.style.display = 'none';
    card.innerHTML = '';
  }
  activeAnchor = null;
}

function scheduleHide() {
  clearHideTimer();
  hideTimer = setTimeout(hideCard, HIDE_DELAY);
}

function positionCard(anchor: HTMLAnchorElement) {
  if (!card) return;

  const rect = anchor.getBoundingClientRect();
  const cardWidth = 320;
  const gap = 8;

  // Horizontal: center on link, clamp to viewport
  let left = rect.left + rect.width / 2 - cardWidth / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - cardWidth - 12));

  // Vertical: prefer above the link, fall back to below
  card.style.left = `${left + window.scrollX}px`;
  card.style.width = `${cardWidth}px`;

  // Temporarily show off-screen to measure height
  card.style.visibility = 'hidden';
  card.style.display = 'block';
  const cardHeight = card.offsetHeight;
  card.style.visibility = '';

  const spaceAbove = rect.top;
  const spaceBelow = window.innerHeight - rect.bottom;

  if (spaceAbove >= cardHeight + gap || spaceAbove > spaceBelow) {
    // Place above
    card.style.top = `${rect.top + window.scrollY - cardHeight - gap}px`;
    card.classList.add('above');
    card.classList.remove('below');
  } else {
    // Place below
    card.style.top = `${rect.bottom + window.scrollY + gap}px`;
    card.classList.add('below');
    card.classList.remove('above');
  }
}

function renderCard(meta: PostMeta, hash: string) {
  const el = getOrCreateCard();

  // Find the heading matching the anchor
  let sectionHtml = '';
  if (hash) {
    const heading = meta.headings.find((h) => h.slug === hash);
    if (heading) {
      sectionHtml = `<div class="link-preview-section">§ ${escapeHtml(heading.text)}</div>`;
    }
  }

  el.innerHTML = `
    <div class="link-preview-title">${escapeHtml(meta.title)}</div>
    <div class="link-preview-description">${escapeHtml(meta.description)}</div>
    ${sectionHtml}
  `;
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function showPreview(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute('href');
  if (!href) return;

  const { path, hash } = normalizePath(href);
  const meta = await getPostsMeta();
  const postMeta = meta[path];

  // Bail if link target not found or anchor changed while loading
  if (!postMeta || activeAnchor !== anchor) return;

  renderCard(postMeta, hash);
  positionCard(anchor);
  getOrCreateCard().style.display = 'block';
}

// --- Event handlers ---

function onMouseEnter(e: Event) {
  const anchor = (e.target as Element).closest?.('a');
  if (!(anchor instanceof HTMLAnchorElement) || !isPostLink(anchor)) return;

  clearHideTimer();
  clearShowTimer();
  activeAnchor = anchor;

  showTimer = setTimeout(() => showPreview(anchor), SHOW_DELAY);
}

function onMouseLeave(e: Event) {
  const anchor = (e.target as Element).closest?.('a');
  if (!(anchor instanceof HTMLAnchorElement)) return;

  clearShowTimer();
  scheduleHide();
}

function onFocusIn(e: Event) {
  const anchor = e.target as Element;
  if (!(anchor instanceof HTMLAnchorElement) || !isPostLink(anchor)) return;

  clearHideTimer();
  clearShowTimer();
  activeAnchor = anchor;
  showTimer = setTimeout(() => showPreview(anchor), SHOW_DELAY);
}

function onFocusOut() {
  clearShowTimer();
  scheduleHide();
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') hideCard();
}

// --- Initialization ---

function initLinkPreviews() {
  // Only on devices that support hover (skip touch-only)
  if (window.matchMedia('(hover: none)').matches) return;

  const container = document.querySelector('.post-content');
  if (!container) return;

  // Event delegation on the post content container
  container.addEventListener('mouseenter', onMouseEnter, true);
  container.addEventListener('mouseleave', onMouseLeave, true);
  container.addEventListener('focusin', onFocusIn);
  container.addEventListener('focusout', onFocusOut);
  document.addEventListener('keydown', onKeyDown);

  // Pre-warm: start loading metadata when any post link enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        getPostsMeta();
        observer.disconnect();
      }
    },
    { rootMargin: '200px' },
  );

  const firstPostLink = container.querySelector('a[href]');
  if (firstPostLink) observer.observe(firstPostLink);
}

document.addEventListener('astro:page-load', initLinkPreviews);
