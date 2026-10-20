import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Pagefind } from './pagefind';
import type { BookInfo } from '../lib/book-cta';

const getPagefind = vi.fn<() => Promise<Pagefind | null>>();
vi.mock('./pagefind', () => ({ getPagefind: () => getPagefind() }));

const {
  buildTools,
  clampLimit,
  extractPageText,
  registerWebMcpTools,
  resetBookInfo,
  resolveSiteUrl,
  MAX_SEARCH_LIMIT,
  DEFAULT_SEARCH_LIMIT,
} = await import('./webmcp');

const ORIGIN = 'https://ben.balter.com';

function tool(name: string) {
  const found = buildTools().find((t) => t.name === name);
  if (!found) throw new Error(`no tool ${name}`);
  return found;
}

const BOOK: BookInfo = {
  title: 'Open and Async',
  author: 'Ben Balter',
  description: 'A book',
  published: 'July 21, 2026',
  price: { ebook: '$1', paperback: '$2' },
  url: 'https://open-and-async.com/?utm_source=benbalter-webmcp',
  posts: [
    // Production URL: matched on path, so it still applies on a preview origin
    { url: 'https://ben.balter.com/2020/01/01/post-0/', title: 'Post 0', relation: 'adapted', note: 'A version of this post appears in the book.' },
  ],
};

const fetchMock = vi.fn<typeof fetch>();

/**
 * Route the fake fetch: /book.json gets `book` (or a 404 when null), anything
 * else gets `page`.
 */
function routeFetch(page: () => Response, book: BookInfo | null = BOOK) {
  fetchMock.mockImplementation(async (input) => {
    if (String(input) === '/book.json') {
      return book ? Response.json(book) : new Response('nope', { status: 404 });
    }
    return page();
  });
}

beforeEach(() => {
  fetchMock.mockReset();
  resetBookInfo();
  vi.stubGlobal('fetch', fetchMock);
  routeFetch(() => new Response('unexpected fetch', { status: 500 }));
});
afterEach(() => vi.unstubAllGlobals());

/** A fake Pagefind index returning `count` hits. */
function fakePagefind(count: number): Pagefind {
  return {
    init: async () => {},
    search: async () => ({
      results: Array.from({ length: count }, (_, i) => ({
        data: async () => ({
          url: `/2020/01/0${i + 1}/post-${i}/`,
          meta: { title: `Post ${i}`, ...(i === 0 ? { date: 'January 1, 2020' } : {}) },
          excerpt: `a <mark>match</mark> &amp; more ${i}`,
        }),
      })),
    }),
  };
}

describe('clampLimit', () => {
  it('defaults when absent or not a number', () => {
    expect(clampLimit(undefined)).toBe(DEFAULT_SEARCH_LIMIT);
    expect(clampLimit('3')).toBe(DEFAULT_SEARCH_LIMIT);
    expect(clampLimit(Number.NaN)).toBe(DEFAULT_SEARCH_LIMIT);
  });

  it('keeps the count between 1 and the max', () => {
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit(3.7)).toBe(3);
    expect(clampLimit(500)).toBe(MAX_SEARCH_LIMIT);
  });
});

describe('resolveSiteUrl', () => {
  it('accepts paths, bare paths, and same-origin URLs', () => {
    expect(resolveSiteUrl('/about/', ORIGIN)?.href).toBe(`${ORIGIN}/about/`);
    expect(resolveSiteUrl('about/', ORIGIN)?.href).toBe(`${ORIGIN}/about/`);
    expect(resolveSiteUrl(`${ORIGIN}/resume/`, ORIGIN)?.href).toBe(`${ORIGIN}/resume/`);
  });

  it('drops query strings and fragments', () => {
    expect(resolveSiteUrl('/about/?x=1#bio', ORIGIN)?.href).toBe(`${ORIGIN}/about/`);
  });

  it('rejects other origins, protocol-relative URLs, and other schemes', () => {
    expect(resolveSiteUrl('https://example.com/about/', ORIGIN)).toBeNull();
    expect(resolveSiteUrl('//example.com/about/', ORIGIN)).toBeNull();
    expect(resolveSiteUrl('http://ben.balter.com/', ORIGIN)).toBeNull();
    expect(resolveSiteUrl('javascript:alert(1)', ORIGIN)).toBeNull();
    expect(resolveSiteUrl('   ', ORIGIN)).toBeNull();
  });
});

describe('extractPageText', () => {
  const page = `<!doctype html><html><head><title>Fine print | Ben Balter</title></head><body>
    <nav>Site nav</nav>
    <main>
      <article data-pagefind-body>
        <a href="#toc" class="visually-hidden-focusable">Skip to table of contents</a>
        <h1>Fine print</h1>
        <p>First   paragraph with <a href="/x/">a link</a>.</p>
        <h2 id="details">Details<a href="#details" aria-hidden="true">#</a></h2>
        <aside class="callout"><p>Note this.</p></aside>
        <aside data-nosnippet><p>Buy the book</p></aside>
        <ul><li>One</li><li>Two</li></ul>
        <section data-pagefind-ignore>Share this post</section>
        <script>alert(1)</script>
      </article>
    </main>
    <footer>Footer</footer>
  </body></html>`;

  it('keeps the article as Markdown-ish text and drops page chrome', () => {
    expect(extractPageText(page)).toBe(
      '# Fine print\n\nFirst paragraph with a link.\n\n## Details\n\nNote this.\n\n- One\n\n- Two',
    );
  });

  it('falls back to <main> and adds the document title when there is no <h1>', () => {
    const html = '<html><head><title>Contact</title></head><body><nav>Nav</nav><main><p>Say hi.</p></main></body></html>';
    expect(extractPageText(html)).toBe('# Contact\n\nSay hi.');
  });
});

describe('buildTools', () => {
  it('exposes read-only search_site, get_page, and get_book tools', () => {
    const tools = buildTools();
    expect(tools.map((t) => t.name)).toEqual(['search_site', 'get_page', 'get_book']);
    for (const t of tools) {
      expect(t.annotations?.readOnlyHint).toBe(true);
      expect(t.description.length).toBeGreaterThan(20);
    }
    expect(tool('search_site').inputSchema?.required).toEqual(['query']);
    expect(tool('get_page').inputSchema?.required).toEqual(['path']);
  });
});

describe('search_site', () => {
  beforeEach(() => getPagefind.mockReset());

  it('returns absolute URLs, titles, dates, and plain-text excerpts', async () => {
    getPagefind.mockResolvedValue(fakePagefind(3));
    const out = JSON.parse(await tool('search_site').execute({ query: ' match ', limit: 2 }));

    expect(out.query).toBe('match');
    expect(out.total).toBe(3);
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toEqual({
      url: `${location.origin}/2020/01/01/post-0/`,
      title: 'Post 0',
      date: 'January 1, 2020',
      excerpt: 'a match & more 0',
      book: 'A version of this post appears in the book.',
    });
    expect(out.results[1]).not.toHaveProperty('date');
    expect(out.results[1]).not.toHaveProperty('book');
  });

  it('still returns results when /book.json is unavailable', async () => {
    getPagefind.mockResolvedValue(fakePagefind(1));
    routeFetch(() => new Response('', { status: 500 }), null);
    const out = JSON.parse(await tool('search_site').execute({ query: 'x' }));
    expect(out.results[0]).not.toHaveProperty('book');
  });

  it('caps results at the max even when more are asked for', async () => {
    getPagefind.mockResolvedValue(fakePagefind(20));
    const out = JSON.parse(await tool('search_site').execute({ query: 'x', limit: 50 }));
    expect(out.results).toHaveLength(MAX_SEARCH_LIMIT);
  });

  it('errors on an empty query without loading the index', async () => {
    await expect(tool('search_site').execute({ query: '  ' })).rejects.toThrow(/query/);
    expect(getPagefind).not.toHaveBeenCalled();
  });

  it('errors when the index is unavailable', async () => {
    getPagefind.mockResolvedValue(null);
    await expect(tool('search_site').execute({ query: 'x' })).rejects.toThrow(/unavailable/);
  });
});

describe('get_page', () => {
  const markdown = (body: string) => () =>
    new Response(body, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });

  it('asks for Markdown and returns it as-is', async () => {
    routeFetch(markdown('# About\n\nHi.'));
    const out = await tool('get_page').execute({ path: `${location.origin}/about/?ref=x` });

    expect(out).toBe('# About\n\nHi.');
    const [, init] = fetchMock.mock.calls.find(([path]) => path === '/about/') ?? [];
    expect(new Headers(init?.headers).get('accept')).toBe('text/markdown');
  });

  it('ends a post tied to the book with its one-line note and link', async () => {
    routeFetch(markdown('# Post 0\n\nBody.'));
    expect(await tool('get_page').execute({ path: '/2020/01/01/post-0/' })).toBe(
      `# Post 0\n\nBody.\n\n---\n\n_A version of this post appears in the book._ <${BOOK.url}>`,
    );
  });

  it('extracts the article when the server answers with HTML', async () => {
    routeFetch(
      () =>
        new Response('<main><article data-pagefind-body><h1>Contact</h1><p>Say hi.</p></article></main>', {
          headers: { 'content-type': 'text/html' },
        }),
    );
    expect(await tool('get_page').execute({ path: '/contact/' })).toBe('# Contact\n\nSay hi.');
  });

  it('errors on a missing page', async () => {
    routeFetch(() => new Response('nope', { status: 404 }));
    await expect(tool('get_page').execute({ path: '/nope/' })).rejects.toThrow(/404/);
  });

  it('refuses other origins without fetching', async () => {
    await expect(tool('get_page').execute({ path: 'https://example.com/' })).rejects.toThrow(/path/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('get_book', () => {
  it('returns /book.json', async () => {
    expect(JSON.parse(await tool('get_book').execute({}))).toEqual(BOOK);
  });

  it('fetches /book.json once however many tools use it', async () => {
    await tool('get_book').execute({});
    await tool('get_book').execute({});
    expect(fetchMock.mock.calls.filter(([path]) => path === '/book.json')).toHaveLength(1);
  });

  it('errors when /book.json is unavailable', async () => {
    routeFetch(() => new Response(''), null);
    await expect(tool('get_book').execute({})).rejects.toThrow(/unavailable/);
  });
});

describe('registerWebMcpTools', () => {
  it('registers every tool, passing the abort signal through', async () => {
    const registerTool = vi.fn();
    const { signal } = new AbortController();
    await registerWebMcpTools({ registerTool }, signal);

    expect(registerTool.mock.calls.map(([t]) => t.name)).toEqual(['search_site', 'get_page', 'get_book']);
    expect(registerTool.mock.calls[0][1]).toEqual({ signal });
  });

  it('keeps registering after one tool is rejected', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const registerTool = vi.fn().mockRejectedValueOnce(new Error('duplicate')).mockResolvedValue(undefined);
    await registerWebMcpTools({ registerTool });

    expect(registerTool).toHaveBeenCalledTimes(3);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});

describe('webmcp-init', () => {
  afterEach(() => {
    delete (document as { modelContext?: unknown }).modelContext;
    vi.resetModules();
  });

  it('does nothing when the browser has no modelContext', async () => {
    const { getModelContext } = await import('./webmcp-init');
    expect(getModelContext()).toBeUndefined();
  });

  it('registers the tools on document.modelContext when present', async () => {
    const registerTool = vi.fn();
    (document as { modelContext?: unknown }).modelContext = { registerTool };
    await import('./webmcp-init');
    await vi.waitFor(() => expect(registerTool).toHaveBeenCalledTimes(3));
  });
});
