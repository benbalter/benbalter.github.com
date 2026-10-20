/**
 * Shared, lazily loaded Pagefind instance.
 *
 * The search modal and the WebMCP tools both search the same index, so they
 * share one loader: the ~100 KB Pagefind bundle is fetched at most once per
 * page, and only when something actually searches.
 */

export interface PagefindResultData {
  url: string;
  meta?: { title?: string; date?: string };
  excerpt: string;
}

interface PagefindResult {
  data(): Promise<PagefindResultData>;
}

interface PagefindSearch {
  results: PagefindResult[];
}

export interface Pagefind {
  init(): Promise<void>;
  search(query: string): Promise<PagefindSearch>;
}

let loading: Promise<Pagefind | null> | null = null;

/**
 * Load and initialize Pagefind, or resolve to null if it can't be loaded
 * (e.g. under `astro dev`, where the index doesn't exist). Concurrent callers
 * share the same in-flight load. A failed load isn't cached, so a later call
 * can retry.
 */
export function getPagefind(): Promise<Pagefind | null> {
  if (!loading) {
    loading = (async () => {
      try {
        // Dynamic import at runtime: path resolved after pagefind indexes the built site
        const pf = '/pagefind/pagefind.js';
        const pagefind = await import(/* @vite-ignore */ pf) as unknown as Pagefind;
        await pagefind.init();
        return pagefind;
      } catch (e) {
        console.error('Failed to load Pagefind:', e);
        loading = null;
        return null;
      }
    })();
  }
  return loading;
}
