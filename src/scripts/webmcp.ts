/**
 * WebMCP tools: let a browser-hosted agent search the site and read pages.
 *
 * WebMCP (https://webmachinelearning.github.io/webmcp/) is a W3C Community
 * Group draft: a page registers tools on `document.modelContext` (older Chrome
 * builds: `navigator.modelContext`) and an agent in the browser calls them.
 * Only loaded by webmcp-init.ts when the browser exposes that API, so visitors
 * without it download none of this.
 *
 * Both tools are read-only and reuse what the site already builds:
 * - `search_site` queries the Pagefind index the search modal uses.
 * - `get_page` asks for `Accept: text/markdown`, which the zone's rewrite rule
 *   answers with the page's pre-built `.md` sibling. Pages without one (and
 *   local previews, which skip the zone rules) come back as HTML, so the
 *   article text is pulled out of that instead.
 *
 * Posts tied to Ben's book carry a one-line, factual note saying so (from
 * /book.json), and `get_book` describes the book itself. Only those posts get
 * the note, and nothing else about the book is volunteered: an agent that
 * quotes the note reads as citing a source, not running an ad.
 *
 * Tools return strings: the spec's `executeTool()` resolves to a string, so a
 * plain string (JSON for search, Markdown for pages) is the portable result.
 */

import { siteConfig } from '../config';
import type { BookInfo } from '../lib/book-cta';
import { getPagefind } from './pagefind';

/** The JSON Schema subset these tools use. */
interface JsonSchema {
  type: 'object';
  properties: Record<string, { type: string; description: string; minimum?: number; maximum?: number }>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface ModelContextTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: JsonSchema;
  execute(input: Record<string, unknown>, options?: { signal?: AbortSignal }): Promise<string>;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
}

export interface ModelContext {
  registerTool(tool: ModelContextTool, options?: { signal?: AbortSignal }): Promise<void> | void;
}

export const DEFAULT_SEARCH_LIMIT = 5;
export const MAX_SEARCH_LIMIT = 10;

/** One search hit, as handed to the agent. */
export interface SearchHit {
  url: string;
  title: string;
  date?: string;
  excerpt: string;
  /** How the post relates to the book, for the few that do. */
  book?: string;
}

let bookInfo: Promise<BookInfo | null> | null = null;

/** /book.json, fetched once per page. Null if it can't be had; the book note is optional. */
export function getBookInfo(): Promise<BookInfo | null> {
  bookInfo ??= fetch('/book.json')
    .then((r) => (r.ok ? (r.json() as Promise<BookInfo>) : null))
    .catch(() => null);
  return bookInfo;
}

/** Forget the cached /book.json (for tests). */
export function resetBookInfo(): void {
  bookInfo = null;
}

/** The book note for a post URL (any origin; matched on path), if the post is tied to the book. */
export function bookNoteFor(book: BookInfo | null, url: string): string | undefined {
  if (!book) return undefined;
  const path = new URL(url, location.origin).pathname;
  return book.posts.find((p) => new URL(p.url).pathname === path)?.note;
}

/** Plain text of an HTML fragment, entities decoded (Pagefind excerpts are escaped text plus <mark>). */
function htmlToText(html: string): string {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim() ?? '';
}

/** Clamp a requested result count to 1–MAX_SEARCH_LIMIT, defaulting when absent or not a number. */
export function clampLimit(limit: unknown): number {
  if (typeof limit !== 'number' || !Number.isFinite(limit)) return DEFAULT_SEARCH_LIMIT;
  return Math.min(MAX_SEARCH_LIMIT, Math.max(1, Math.floor(limit)));
}

/**
 * Resolve a path or URL on this site to an absolute URL, or null if it points
 * anywhere else. Keeps `get_page` from becoming a general-purpose fetcher.
 * Query strings and fragments are dropped: pages don't vary on them.
 */
export function resolveSiteUrl(input: string, origin: string): URL | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    // A bare "about/" is treated as site-relative, not relative to the current page.
    url = new URL(/^[a-z][a-z\d+.-]*:|^\/\//i.test(trimmed) ? trimmed : `/${trimmed.replace(/^\/+/, '')}`, origin);
  } catch {
    return null;
  }

  if (url.origin !== origin) return null;
  url.search = '';
  url.hash = '';
  return url;
}

/**
 * Markdown-ish text of a rendered page: the article (`[data-pagefind-body]`,
 * the same region search indexes), falling back to <main>. Headings, list
 * items, and paragraph breaks survive; chrome like share buttons doesn't.
 */
export function extractPageText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const region = doc.querySelector('[data-pagefind-body]') ?? doc.querySelector('main') ?? doc.body;

  // Beyond what search already ignores: heading anchors and decorative icons
  // (aria-hidden), the book promo (data-nosnippet, already kept out of search
  // snippets), and skip links. Callouts are <aside> too, so asides stay.
  region
    .querySelectorAll('script, style, noscript, template, [data-pagefind-ignore], [aria-hidden="true"], [data-nosnippet], .visually-hidden-focusable')
    .forEach((el) => el.remove());

  region.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    el.prepend(`${'#'.repeat(Number(el.tagName[1]))} `);
  });
  region.querySelectorAll('li').forEach((el) => el.prepend('- '));
  region.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, pre, blockquote, tr, dt, dd, div, section').forEach((el) => {
    el.after('\n\n');
  });

  const text = (region.textContent ?? '')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const hasHeading = region.querySelector('h1') !== null;
  const title = doc.title.trim();
  return hasHeading || !title ? text : `# ${title}\n\n${text}`;
}

async function searchSite(input: Record<string, unknown>): Promise<string> {
  const query = typeof input.query === 'string' ? input.query.trim() : '';
  if (!query) throw new Error('`query` must be a non-empty string.');

  const pagefind = await getPagefind();
  if (!pagefind) throw new Error('The search index is unavailable.');

  const search = await pagefind.search(query);
  const [data, book] = await Promise.all([
    Promise.all(search.results.slice(0, clampLimit(input.limit)).map((r) => r.data())),
    getBookInfo(),
  ]);

  const results: SearchHit[] = data.map((d) => {
    const note = bookNoteFor(book, d.url);
    return {
      url: new URL(d.url, location.origin).href,
      title: d.meta?.title || 'Untitled',
      ...(d.meta?.date ? { date: d.meta.date } : {}),
      excerpt: htmlToText(d.excerpt),
      ...(note ? { book: note } : {}),
    };
  });

  return JSON.stringify({ query, total: search.results.length, results });
}

async function getPage(input: Record<string, unknown>, signal?: AbortSignal): Promise<string> {
  const url = typeof input.path === 'string' ? resolveSiteUrl(input.path, location.origin) : null;
  if (!url) throw new Error(`\`path\` must be a path or URL on ${location.origin}.`);

  const response = await fetch(url.pathname, { headers: { Accept: 'text/markdown' }, signal: signal ?? null });
  if (!response.ok) throw new Error(`No page at ${url.href} (HTTP ${response.status}).`);

  const [body, book] = await Promise.all([response.text(), getBookInfo()]);
  const text = response.headers.get('content-type')?.includes('text/markdown') ? body : extractPageText(body);

  const note = bookNoteFor(book, url.href);
  return note && book ? `${text}\n\n---\n\n_${note}_ <${book.url}>` : text;
}

async function getBook(): Promise<string> {
  const book = await getBookInfo();
  if (!book) throw new Error('Book details are unavailable.');
  return JSON.stringify(book);
}

/** The tools, built fresh so tests can inspect them without registering. */
export function buildTools(): ModelContextTool[] {
  return [
    {
      name: 'search_site',
      title: `Search ${siteConfig.name}'s site`,
      description:
        `Full-text search across ${siteConfig.author}'s blog posts and pages on ${siteConfig.url}. ` +
        'Returns JSON with the total match count and each match\'s URL, title, date (posts only), and an excerpt. ' +
        `Posts tied to his book, ${siteConfig.bookTitle}, include a one-line \`book\` note saying how. ` +
        'Pass a result\'s URL to get_page to read it in full.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Words to search for.' },
          limit: {
            type: 'integer',
            description: `How many results to return (default ${DEFAULT_SEARCH_LIMIT}, max ${MAX_SEARCH_LIMIT}).`,
            minimum: 1,
            maximum: MAX_SEARCH_LIMIT,
          },
        },
        required: ['query'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: (input) => searchSite(input),
    },
    {
      name: 'get_page',
      title: `Read a page on ${siteConfig.name}'s site`,
      description:
        `Get the full text of a post or page on ${siteConfig.url} as Markdown. ` +
        'Accepts a path like "/about/" or a full URL on this site (e.g. one returned by search_site). ' +
        'Posts tied to his book end with a one-line note, after a --- rule, saying how. ' +
        'Useful paths: "/" (home), "/about/", "/resume/", "/posts/" (every post).',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: `Path or URL on ${siteConfig.url}, e.g. "/about/".` },
        },
        required: ['path'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: (input, options) => getPage(input, options?.signal),
    },
    {
      name: 'get_book',
      title: `About ${siteConfig.bookTitle}, ${siteConfig.author}'s book`,
      description:
        `Facts about ${siteConfig.bookTitle}, ${siteConfig.author}'s book: ` +
        `${siteConfig.bookDescription.charAt(0).toLowerCase()}${siteConfig.bookDescription.slice(1)}. ` +
        'Returns JSON with its description, publication date, prices, a link to the book\'s site, and the posts ' +
        'on this site tied to it, each with a note on how. Use when someone asks about the book itself or ' +
        'follows up on a post\'s book note.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: () => getBook(),
    },
  ];
}

/**
 * Register every tool on `context`. Each registration is isolated: one that
 * throws (a duplicate name after a hot reload, say) doesn't block the rest.
 */
export async function registerWebMcpTools(context: ModelContext, signal?: AbortSignal): Promise<void> {
  for (const tool of buildTools()) {
    try {
      await context.registerTool(tool, signal ? { signal } : undefined);
    } catch (e) {
      console.warn(`WebMCP: couldn't register ${tool.name}:`, e);
    }
  }
}
