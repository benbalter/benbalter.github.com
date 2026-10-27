/**
 * Link Preview Hover Cards
 *
 * Hovering (or focusing) a link in a post shows a card about where it goes.
 * Each kind of link has its own matcher and renderer, tried in this order:
 *
 * 1. Footnote references: the footnote's text, cloned from the page
 * 2. The book and Ben's tools (open-and-async.com, word2md.com, …): a card
 *    cloned from a server-rendered <template data-link-preview-host>
 *    (BookPreviewTemplate.astro, ToolPreviewTemplates.astro)
 * 3. Internet Archive snapshots: the archived site and capture date, parsed
 *    from the URL itself
 * 4. GitHub repos and Wikipedia articles: metadata from /link-previews.json,
 *    cached at build time by script/build-link-previews.ts
 * 5. Internal posts: title and description from /posts-meta.json.
 *    Anchor-aware: deep links (/2023/01/10/post/#heading) also show the section.
 *
 * Every card follows one anatomy: title, description, then a facts line that
 * names the source ("Wikipedia", "GitHub · Ruby · 1.6k stars"). Only the
 * book card carries a label above its title, as part of the book's own look.
 *
 * Touch-only devices get no hover cards; tapping a footnote number there
 * opens its card instead (see openTouchFootnote).
 *
 * - Lazy-loads each JSON file on first need (then caches)
 * - Positions the card intelligently relative to the viewport
 * - Supports keyboard focus for accessibility
 * - Initializes on DOMContentLoaded (or immediately if already loaded)
 */

import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';

import { escapeHtml } from '../utils/html-escape';
import {
  externalPreviewKey,
  parseWaybackUrl,
  type ExternalPreview,
  type WaybackSnapshot,
} from '../utils/link-preview-keys';

/** URL pattern for blog post links: /YYYY/MM/DD/slug/ */
const POST_URL_PATTERN = /^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/?/;

/**
 * Delay before showing the card (ms). Longer for the mouse, so a cursor
 * resting on a link-dense list while reading doesn't keep spawning cards;
 * keyboard focus is deliberate, so it gets the shorter delay.
 */
const SHOW_DELAY_MOUSE = 450;
const SHOW_DELAY_FOCUS = 300;

/** Mouse entries this soon after a scroll are the page moving under a parked cursor (ms) */
const SCROLL_GRACE = 150;

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
type ExternalMap = Record<string, ExternalPreview>;

const META_URL = '/posts-meta.json';
const EXTERNAL_URL = '/link-previews.json';

/** Hostname of the book's marketing site; its links get the book card */
const BOOK_HOSTNAME = 'open-and-async.com';

const CARD_CLASS = 'link-preview-card';

/**
 * Per-URL cache of in-flight or settled fetch promises. Keyed by the URL
 * being fetched so different URLs don't share cache state and concurrent
 * requests for the same URL reuse a single promise.
 */
const fetchCache = new Map<string, Promise<unknown>>();

/** Lazy-load and cache a JSON map, resolving to {} on failure */
function getJson<T extends object>(url: string): Promise<T> {
  const cached = fetchCache.get(url);
  if (cached) return cached as Promise<T>;

  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
      return res.json() as Promise<T>;
    })
    .catch((err) => {
      console.error('[link-previews]', err);
      // Evict the failed entry so a subsequent call retries the fetch
      fetchCache.delete(url);
      return {} as T;
    });

  fetchCache.set(url, promise);
  return promise;
}

const getPostsMeta = () => getJson<MetaMap>(META_URL);
const getExternalMeta = () => getJson<ExternalMap>(EXTERNAL_URL);

/** Normalize a URL path: strip origin, ensure trailing slash */
export function normalizePath(href: string): { path: string; hash: string } {
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
export function isPostLink(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute('href');
  if (!href) return false;

  // Skip links that are themselves inside the preview card
  if (anchor.closest(`.${CARD_CLASS}`)) return false;

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

/** Hostname of a link, or '' if it has none or doesn't parse */
function hostnameOf(anchor: HTMLAnchorElement): string {
  const href = anchor.getAttribute('href');
  if (!href) return '';
  try {
    return new URL(href, window.location.origin).hostname;
  } catch {
    return '';
  }
}

function matchesHost(hostname: string, host: string): boolean {
  return hostname === host || hostname.endsWith(`.${host}`);
}

/**
 * Check if this is a link to the book's site worth previewing. Skips the
 * book CTAs themselves, which already show the cover and price.
 */
export function isBookLink(anchor: HTMLAnchorElement): boolean {
  if (anchor.closest(`.${CARD_CLASS}, .book-cta-inline, .book-cta-featured`)) return false;
  if (anchor.hasAttribute('data-track-book-cta')) return false;
  return matchesHost(hostnameOf(anchor), BOOK_HOSTNAME);
}

/** The server-rendered card template for this link's host, if the page has one */
export function hostTemplateFor(anchor: HTMLAnchorElement): HTMLTemplateElement | null {
  const hostname = hostnameOf(anchor);
  if (!hostname) return null;
  if (matchesHost(hostname, BOOK_HOSTNAME) && !isBookLink(anchor)) return null;

  for (const template of document.querySelectorAll<HTMLTemplateElement>('template[data-link-preview-host]')) {
    if (matchesHost(hostname, template.dataset.linkPreviewHost ?? '')) return template;
  }
  return null;
}

/** The footnote a footnote reference points to, if this is one */
export function footnoteFor(anchor: HTMLAnchorElement): HTMLElement | null {
  if (!anchor.hasAttribute('data-footnote-ref')) return null;
  const id = decodeURIComponent(anchor.hash.slice(1));
  return id ? document.getElementById(id) : null;
}

/** Absolute URL of a link, for the external matchers */
function absoluteHref(anchor: HTMLAnchorElement): string {
  return anchor.getAttribute('href') ? anchor.href : '';
}

/** True for any link that gets a hover card */
function isPreviewable(anchor: HTMLAnchorElement): boolean {
  if (anchor.closest(`.${CARD_CLASS}`)) return false;
  if (footnoteFor(anchor) || hostTemplateFor(anchor)) return true;
  const href = absoluteHref(anchor);
  if (parseWaybackUrl(href) || externalPreviewKey(href)) return true;
  return isPostLink(anchor);
}

// --- Card element management ---

let card: HTMLDivElement | null = null;
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let activeAnchor: HTMLAnchorElement | null = null;
let stopPositioning: (() => void) | null = null;
let lastScroll = 0;

function getOrCreateCard(): HTMLDivElement {
  // Check if card is still in the DOM (View Transitions swap the body)
  if (card && card.isConnected) return card;

  card = document.createElement('div');
  card.className = CARD_CLASS;
  card.style.display = 'none';

  // Keep card visible when hovering over it
  card.addEventListener('mouseenter', () => clearHideTimer());
  card.addEventListener('mouseleave', () => scheduleHide());

  document.body.appendChild(card);
  return card;
}

/**
 * The card, reset to its base class plus an optional variant.
 *
 * Hover cards are a visual shortcut: everything in them is also at the link's
 * destination (or in the footnotes section), so they're hidden from assistive
 * tech rather than announced on every link. Touch footnote cards are the
 * exception (see openTouchFootnote): the reader asked for them with a tap.
 */
function freshCard(variant?: string): HTMLDivElement {
  const el = getOrCreateCard();
  el.className = variant ? `${CARD_CLASS} ${variant}` : CARD_CLASS;
  el.setAttribute('aria-hidden', 'true');
  return el;
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
  stopPositioning?.();
  stopPositioning = null;

  if (card) {
    card.style.display = 'none';
    card.style.visibility = '';
    card.innerHTML = '';
    card.className = CARD_CLASS;
  }
  if (activeAnchor?.hasAttribute('aria-expanded')) {
    // A touch footnote card took focus when it opened; hand it back
    if (card?.contains(document.activeElement)) activeAnchor.focus({ preventScroll: true });
    activeAnchor.removeAttribute('aria-expanded');
    activeAnchor.removeAttribute('aria-controls');
  }
  if (card) {
    card.removeAttribute('role');
    card.removeAttribute('aria-label');
    card.removeAttribute('tabindex');
  }
  activeAnchor = null;
}

function scheduleHide() {
  clearHideTimer();
  hideTimer = setTimeout(hideCard, HIDE_DELAY);
}

async function positionCard(anchor: HTMLAnchorElement) {
  if (!card) return;

  const floating = card;
  floating.style.visibility = 'hidden';
  floating.style.display = 'block';

  const updatePosition = async () => {
    const { x, y, placement } = await computePosition(anchor, floating, {
      strategy: 'fixed',
      placement: 'top',
      middleware: [
        offset(8),
        flip({ padding: 12 }),
        shift({ padding: 12 }),
        size({
          padding: 12,
          apply({ availableWidth, elements }) {
            elements.floating.style.maxWidth = `${Math.max(0, availableWidth)}px`;
          },
        }),
      ],
    });

    if (activeAnchor !== anchor || !floating.isConnected || floating.style.display === 'none') return;
    floating.style.left = `${x}px`;
    floating.style.top = `${y}px`;
    floating.classList.toggle('above', placement.startsWith('top'));
    floating.classList.toggle('below', placement.startsWith('bottom'));
  };

  stopPositioning?.();
  stopPositioning = null;
  await updatePosition();
  if (activeAnchor !== anchor) return;

  floating.style.visibility = '';
  stopPositioning = autoUpdate(anchor, floating, () => {
    void updatePosition();
  });
}

// --- Renderers ---

function renderPostCard(meta: PostMeta, hash: string) {
  const el = freshCard();

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

function renderTemplateCard(template: HTMLTemplateElement) {
  const el = freshCard(template.dataset.linkPreviewClass);
  el.replaceChildren(template.content.cloneNode(true));
}

function renderFootnoteCard(footnote: HTMLElement) {
  const el = freshCard();
  const clone = footnote.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('[data-footnote-backref]').forEach((backref) => backref.remove());
  // The footnote stays on the page, so the copy must not duplicate its ids
  clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
  // Keyboard users read the original in the footnotes section; the copy's
  // links and acronyms stay out of the tab order, and the acronym tooltip
  // script never wires up clones, so drop the markers that promise one
  clone.querySelectorAll<HTMLElement>('a, abbr, [tabindex]').forEach((node) => {
    node.setAttribute('tabindex', '-1');
    for (const attr of [...node.attributes]) {
      if (attr.name.startsWith('data-tooltip')) node.removeAttribute(attr.name);
    }
  });

  const body = document.createElement('div');
  body.className = 'link-preview-footnote';
  body.append(...clone.childNodes);
  el.replaceChildren(body);
}

/** Month spelled out ("April 14, 2015"): unambiguous, and the house date style */
const capturedFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

function renderWaybackCard(snapshot: WaybackSnapshot) {
  const el = freshCard();
  let host = snapshot.original;
  let rest = '';
  try {
    const url = new URL(snapshot.original);
    host = url.hostname.replace(/^www\./, '');
    rest = `${url.pathname}${url.search}`.replace(/^\/$/, '');
  } catch {
    // Show the raw original URL as the title
  }

  el.innerHTML = `
    <div class="link-preview-title">${escapeHtml(host)}</div>
    ${rest ? `<div class="link-preview-description link-preview-url">${escapeHtml(rest)}</div>` : ''}
    <div class="link-preview-meta">Internet Archive snapshot · ${escapeHtml(capturedFormat.format(snapshot.captured))}</div>
  `;
}

/** 1234 → "1.2k"; the cached counts drift, so precision would mislead */
export function formatStars(stars: number): string {
  if (stars < 1000) return String(stars);
  const thousands = stars / 1000;
  return `${thousands < 10 ? thousands.toFixed(1).replace(/\.0$/, '') : Math.round(thousands)}k`;
}

function renderExternalCard(meta: ExternalPreview) {
  const el = freshCard();

  if (meta.kind === 'github') {
    const stars = `${formatStars(meta.stars)} ${meta.stars === 1 ? 'star' : 'stars'}`;
    const facts = ['GitHub', meta.language, stars]
      .filter((fact): fact is string => Boolean(fact))
      .map(escapeHtml);
    // Whether the project is still maintained is the fact a reader most needs
    if (meta.archived) facts.unshift('<strong class="link-preview-flag">Archived</strong>');
    el.innerHTML = `
      <div class="link-preview-title">${escapeHtml(meta.title)}</div>
      ${meta.description ? `<div class="link-preview-description">${escapeHtml(meta.description)}</div>` : ''}
      <div class="link-preview-meta">${facts.join(' · ')}</div>
    `;
    return;
  }

  el.innerHTML = `
    <div class="link-preview-title">${escapeHtml(meta.title)}</div>
    <div class="link-preview-description link-preview-description-long">${escapeHtml(meta.extract)}</div>
    <div class="link-preview-meta">Wikipedia</div>
  `;
}

async function showPreview(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute('href');
  if (!href) return;

  const footnote = footnoteFor(anchor);
  if (footnote) {
    renderFootnoteCard(footnote);
    await positionCard(anchor);
    return;
  }

  const template = hostTemplateFor(anchor);
  if (template) {
    renderTemplateCard(template);
    await positionCard(anchor);
    return;
  }

  const absolute = absoluteHref(anchor);
  const snapshot = parseWaybackUrl(absolute);
  if (snapshot) {
    renderWaybackCard(snapshot);
    await positionCard(anchor);
    return;
  }

  const key = externalPreviewKey(absolute);
  if (key) {
    const external = (await getExternalMeta())[key];
    if (!external || activeAnchor !== anchor) return;
    renderExternalCard(external);
    await positionCard(anchor);
    return;
  }

  const { path, hash } = normalizePath(href);
  const meta = await getPostsMeta();
  const postMeta = meta[path];

  // Bail if link target not found or anchor changed while loading
  if (!postMeta || activeAnchor !== anchor) return;

  renderPostCard(postMeta, hash);
  await positionCard(anchor);
}

// --- Event handlers ---

function onMouseEnter(e: Event) {
  const anchor = (e.target as Element).closest?.('a');
  if (!(anchor instanceof HTMLAnchorElement) || !isPreviewable(anchor)) return;
  if (performance.now() - lastScroll < SCROLL_GRACE) return;

  clearHideTimer();
  clearShowTimer();
  activeAnchor = anchor;

  showTimer = setTimeout(() => showPreview(anchor), SHOW_DELAY_MOUSE);
}

function onMouseLeave(e: Event) {
  const anchor = (e.target as Element).closest?.('a');
  if (!(anchor instanceof HTMLAnchorElement)) return;

  clearShowTimer();
  scheduleHide();
}

function onFocusIn(e: Event) {
  const anchor = e.target as Element;
  if (!(anchor instanceof HTMLAnchorElement) || !isPreviewable(anchor)) return;

  clearHideTimer();
  clearShowTimer();
  activeAnchor = anchor;
  showTimer = setTimeout(() => showPreview(anchor), SHOW_DELAY_FOCUS);
}

function onFocusOut() {
  clearShowTimer();
  scheduleHide();
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && card?.style.display === 'block') hideCard();
}

function onScroll() {
  lastScroll = performance.now();
}

// --- Touch: tap a footnote number to preview it ---
//
// Phones get no hover cards, but footnotes are the one preview worth having
// there: otherwise a tap jumps to the bottom of the page and back. The first
// tap opens the footnote in a card (exposed to assistive tech, since the
// reader asked for it); the card links on to the footnotes section, and a
// second tap, a tap elsewhere, or Escape closes it.
//
// The card stays at the end of <body>: .post-content uses `contain: content`,
// which would clip a fixed-position card placed inside it. So instead of
// relying on reading order, the card takes focus when it opens (screen
// readers follow) and hands it back to the footnote number when it closes.

const TOUCH_CARD_ID = 'footnote-preview';

function openTouchFootnote(anchor: HTMLAnchorElement, footnote: HTMLElement) {
  hideCard();
  activeAnchor = anchor;
  renderFootnoteCard(footnote);

  const el = getOrCreateCard();
  el.removeAttribute('aria-hidden');
  el.id = TOUCH_CARD_ID;
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', `Footnote ${anchor.textContent?.trim() ?? ''}`.trim());
  el.tabIndex = -1;
  const jump = document.createElement('a');
  jump.className = 'link-preview-jump';
  jump.href = anchor.getAttribute('href') ?? '';
  jump.textContent = 'Go to footnote';
  jump.addEventListener('click', () => hideCard());
  el.append(jump);

  anchor.setAttribute('aria-expanded', 'true');
  anchor.setAttribute('aria-controls', TOUCH_CARD_ID);
  void positionCard(anchor).then(() => {
    if (activeAnchor === anchor) el.focus({ preventScroll: true });
  });
}

function onTouchFootnoteClick(e: Event) {
  const anchor = (e.target as Element).closest?.('a');
  if (!(anchor instanceof HTMLAnchorElement)) return;
  const footnote = footnoteFor(anchor);
  if (!footnote) return;

  e.preventDefault();
  if (activeAnchor === anchor) hideCard();
  else openTouchFootnote(anchor, footnote);
}

function onTouchOutside(e: Event) {
  if (!card || card.style.display !== 'block') return;
  const target = e.target as Node;
  if (card.contains(target) || activeAnchor?.contains(target)) return;
  hideCard();
}

// --- Initialization ---

/**
 * Containers whose links get hover previews: post bodies, plus any element
 * that opts in with `data-link-previews` (e.g., the résumé's "Selected
 * writing" list, which isn't a `.post-content` region).
 */
const CONTAINER_SELECTOR = '.post-content, [data-link-previews]';
const LINK_SELECTOR = '.post-content a[href], [data-link-previews] a[href]';

/** Run `warm` once, when the first of `targets` nears the viewport */
function warmWhenNear(targets: Element[], warm: () => void) {
  if (targets.length === 0) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        warm();
        observer.disconnect();
      }
    },
    { rootMargin: '200px' },
  );
  for (const target of targets) observer.observe(target);
}

function initLinkPreviews() {
  const containers = document.querySelectorAll(CONTAINER_SELECTOR);
  if (containers.length === 0) return;

  // Reset stale state from previous page (View Transitions keep JS memory)
  hideCard();
  activeAnchor = null;

  // Use { once: false } — safe to re-add because duplicate listeners are ignored
  document.addEventListener('keydown', onKeyDown);

  // Touch-only devices: tap-to-preview for footnotes, no hover cards
  if (window.matchMedia('(hover: none)').matches) {
    for (const container of containers) container.addEventListener('click', onTouchFootnoteClick);
    document.addEventListener('pointerdown', onTouchOutside);
    return;
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Event delegation on each opted-in container
  for (const container of containers) {
    container.addEventListener('mouseenter', onMouseEnter, true);
    container.addEventListener('mouseleave', onMouseLeave, true);
    container.addEventListener('focusin', onFocusIn);
    container.addEventListener('focusout', onFocusOut);
  }

  // Pre-warm: start loading each kind's data when its first link nears the viewport
  const links = [...document.querySelectorAll<HTMLAnchorElement>(LINK_SELECTOR)];
  const firstPostLink = links[0];
  warmWhenNear(firstPostLink ? [firstPostLink] : [], () => void getPostsMeta());
  warmWhenNear(
    links.filter((link) => externalPreviewKey(absoluteHref(link))),
    () => void getExternalMeta(),
  );

  // Template cards with images (the book cover): importing the <img> starts the fetch
  for (const template of document.querySelectorAll<HTMLTemplateElement>('template[data-link-preview-host]')) {
    const image = template.content.querySelector('img');
    if (!image) continue;
    warmWhenNear(
      links.filter((link) => hostTemplateFor(link) === template),
      () => void document.importNode(image, true),
    );
  }
}

import { onPageLoad } from './on-page-load';
onPageLoad(initLinkPreviews);
