// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import worker from './index.js';

/**
 * Fake ASSETS binding serving a fixed map of pathname -> body.
 * @param {Record<string, string>} [files]
 */
function makeEnv(files = {}) {
  const writeDataPoint = vi.fn();
  return {
    ASSETS: {
      fetch: vi.fn(async (/** @type {RequestInfo | URL} */ input) => {
        const { pathname } = new URL(input instanceof Request ? input.url : input);
        return pathname in files
          ? new Response(files[pathname], {
              status: 200,
              headers: {
                'Content-Type': 'text/html',
                'Content-Security-Policy': "default-src 'self'",
                'Referrer-Policy': 'no-referrer-when-downgrade',
              },
            })
          : new Response('Not found', { status: 404 });
      }),
    },
    ENGAGEMENT: { writeDataPoint },
  };
}

const md = (/** @type {string} */ path, /** @type {RequestInit} */ init = {}) =>
  new Request(`https://ben.balter.com${path}`, {
    ...init,
    headers: { Accept: 'text/markdown', ...(init.headers ?? {}) },
  });

describe('Markdown content negotiation', () => {
  it('serves /index.md for the homepage', async () => {
    const env = makeEnv({ '/index.md': '# Home' });
    const res = await worker.fetch(md('/'), env);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('# Home');
    expect(res.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
  });

  it('maps a trailing-slash page to its .md sibling', async () => {
    const env = makeEnv({ '/2020/01/01/slug.md': '# Post' });
    const res = await worker.fetch(md('/2020/01/01/slug/'), env);
    expect(await res.text()).toBe('# Post');
  });

  it('sets Vary, private caching, and a token estimate', async () => {
    const env = makeEnv({ '/about.md': 'x'.repeat(10) });
    const res = await worker.fetch(md('/about/'), env);
    expect(res.headers.get('Vary')).toBe('Accept');
    expect(res.headers.get('Cache-Control')).toBe('private, max-age=300');
    expect(res.headers.get('x-markdown-tokens')).toBe('3');
  });

  it('keeps the asset headers from _headers', async () => {
    const env = makeEnv({ '/about.md': '# About' });
    const res = await worker.fetch(md('/about/'), env);
    expect(res.headers.get('Content-Security-Policy')).toBe("default-src 'self'");
  });

  it('returns no body for HEAD', async () => {
    const env = makeEnv({ '/about.md': '# About' });
    const res = await worker.fetch(md('/about/', { method: 'HEAD' }), env);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('');
  });

  it('falls back to HTML when no .md sibling exists', async () => {
    const env = makeEnv({ '/tags/': '<html>' });
    const res = await worker.fetch(md('/tags/'), env);
    expect(res.headers.get('Content-Type')).toBe('text/html');
  });

  it('serves HTML to browsers', async () => {
    const env = makeEnv({ '/about/': '<html>', '/about.md': '# About' });
    const req = new Request('https://ben.balter.com/about/', {
      headers: { Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
    });
    const res = await worker.fetch(req, env);
    expect(await res.text()).toBe('<html>');
    expect(res.headers.get('Vary')).toBe('Accept');
  });

  it('serves HTML when text/markdown is refused with q=0', async () => {
    const env = makeEnv({ '/about/': '<html>', '/about.md': '# About' });
    for (const accept of ['text/markdown;q=0', 'text/html, text/markdown; q=0.0', 'TEXT/MARKDOWN ; Q=0']) {
      const res = await worker.fetch(md('/about/', { headers: { Accept: accept } }), env);
      expect(await res.text()).toBe('<html>');
    }
  });

  it('serves Markdown for a non-zero q-value', async () => {
    const env = makeEnv({ '/about/': '<html>', '/about.md': '# About' });
    const res = await worker.fetch(md('/about/', { headers: { Accept: 'text/html;q=0.9, text/markdown;q=0.5' } }), env);
    expect(await res.text()).toBe('# About');
  });

  it('does not treat other media types with a text/markdown prefix as Markdown', async () => {
    const env = makeEnv({ '/about/': '<html>', '/about.md': '# About' });
    const res = await worker.fetch(md('/about/', { headers: { Accept: 'text/markdown-foo' } }), env);
    expect(await res.text()).toBe('<html>');
  });

  it('enforces the recommended referrer policy on page responses', async () => {
    const env = makeEnv({ '/': '<html>' });
    const res = await worker.fetch(new Request('https://ben.balter.com/'), env);
    expect(res.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  });

  it('does not negotiate file assets', async () => {
    const env = makeEnv({ '/feed.xml': '<rss>' });
    const res = await worker.fetch(md('/feed.xml'), env);
    expect(await res.text()).toBe('<rss>');
    expect(res.headers.get('Vary')).toBeNull();
  });
});

describe('POST /api/event', () => {
  const post = (/** @type {unknown} */ body) =>
    new Request('https://ben.balter.com/api/event', {
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });

  it('records an allowed event', async () => {
    const env = makeEnv();
    const res = await worker.fetch(post({ event: 'subscribe', path: '/about/' }), env);
    expect(res.status).toBe(204);
    expect(env.ENGAGEMENT.writeDataPoint).toHaveBeenCalledWith({
      blobs: ['subscribe', '/about/', ''],
      doubles: [1],
      indexes: ['subscribe'],
    });
  });

  it('records only the origin of the inbound referrer', async () => {
    const env = makeEnv();
    const res = await worker.fetch(
      post({
        event: 'book-cta',
        path: '/about/',
        referrer: 'https://www.google.com/search?q=ben+balter',
      }),
      env,
    );
    expect(res.status).toBe(204);
    expect(env.ENGAGEMENT.writeDataPoint).toHaveBeenCalledWith(
      expect.objectContaining({ blobs: ['book-cta', '/about/', 'https://www.google.com'] }),
    );
  });

  it('ignores the request Referer header and non-http referrers', async () => {
    const env = makeEnv();
    const req = post({ event: 'subscribe', path: '/about/', referrer: 'javascript:alert(1)' });
    req.headers.set('Referer', 'https://ben.balter.com/about/?utm_source=email');
    await worker.fetch(req, env);
    expect(env.ENGAGEMENT.writeDataPoint).toHaveBeenCalledWith(
      expect.objectContaining({ blobs: ['subscribe', '/about/', ''] }),
    );
  });

  it('rejects unknown events', async () => {
    const env = makeEnv();
    const res = await worker.fetch(post({ event: 'nope', path: '/' }), env);
    expect(res.status).toBe(400);
    expect(env.ENGAGEMENT.writeDataPoint).not.toHaveBeenCalled();
  });

  it('rejects overlong paths', async () => {
    const env = makeEnv();
    const res = await worker.fetch(post({ event: 'subscribe', path: '/'.repeat(257) }), env);
    expect(res.status).toBe(400);
  });

  it('rejects malformed JSON', async () => {
    const env = makeEnv();
    const res = await worker.fetch(post('{not json'), env);
    expect(res.status).toBe(400);
  });
});

describe('/api/subscribe', () => {
  const EMAIL = 'reader@example.com';
  const IP = '203.0.113.7';
  const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  /** @type {import('vitest').Mock<(url: string, init?: any) => Promise<Response>>} */
  let fetchMock;
  /** @type {Array<import('vitest').MockInstance>} */
  let consoleSpies;

  /**
   * Route outbound fetches: siteverify answers `turnstile`, Kit answers
   * `kitStatus` for every call.
   * @param {{ turnstile?: boolean, kitStatus?: number }} [options]
   */
  function mockUpstreams({ turnstile = true, kitStatus = 201 } = {}) {
    fetchMock = vi.fn(async (/** @type {string} */ url) => {
      if (url === SITEVERIFY) return Response.json({ success: turnstile });
      return new Response('{}', { status: kitStatus });
    });
    vi.stubGlobal('fetch', fetchMock);
  }

  /** @param {Record<string, unknown>} [extra] */
  const subscribeEnv = (extra = {}) => ({
    ...makeEnv(),
    TURNSTILE_SECRET_KEY: 'turnstile-secret',
    KIT_API_KEY: 'kit-key',
    ...extra,
  });

  /**
   * A sign-up request, form-encoded by default (a plain HTML form post).
   * @param {Record<string, string>} fields
   * @param {{ json?: boolean, method?: string }} [options]
   */
  function signup(fields, { json = false, method = 'POST' } = {}) {
    /** @type {Record<string, string>} */
    const headers = { 'CF-Connecting-IP': IP };
    if (json) {
      headers['Content-Type'] = 'application/json';
      headers.Accept = 'application/json';
    }
    /** @type {RequestInit} */
    const init = { method, headers };
    if (method !== 'GET') {
      init.body = json ? JSON.stringify(fields) : new URLSearchParams(fields);
    }
    return new Request('https://ben.balter.com/api/subscribe', init);
  }

  const valid = { email: EMAIL, 'cf-turnstile-response': 'token-123' };

  /** Every argument passed to console.* during the test, as one string. */
  const logged = () =>
    consoleSpies.flatMap((spy) => spy.mock.calls.flat().map((arg) => String(arg))).join('\n');

  beforeEach(() => {
    consoleSpies = [
      vi.spyOn(console, 'log').mockImplementation(() => {}),
      vi.spyOn(console, 'info').mockImplementation(() => {}),
      vi.spyOn(console, 'warn').mockImplementation(() => {}),
      vi.spyOn(console, 'error').mockImplementation(() => {}),
      vi.spyOn(console, 'debug').mockImplementation(() => {}),
    ];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('rejects methods other than POST', async () => {
    mockUpstreams();
    const res = await worker.fetch(signup({}, { method: 'GET' }), subscribeEnv());
    expect(res.status).toBe(405);
    expect(res.headers.get('Allow')).toBe('POST');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a missing Turnstile token without calling siteverify', async () => {
    mockUpstreams();
    const res = await worker.fetch(signup({ email: EMAIL }, { json: true }), subscribeEnv());
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: 'missing-token' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a malformed email', async () => {
    mockUpstreams();
    const res = await worker.fetch(
      signup({ ...valid, email: 'not-an-email' }, { json: true }),
      subscribeEnv(),
    );
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fakes success for a filled honeypot and does nothing', async () => {
    mockUpstreams();
    const res = await worker.fetch(
      signup({ ...valid, website: 'spam' }, { json: true }),
      subscribeEnv(),
    );
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails closed when the Turnstile secret is missing', async () => {
    mockUpstreams();
    const res = await worker.fetch(
      signup(valid, { json: true }),
      subscribeEnv({ TURNSTILE_SECRET_KEY: undefined }),
    );
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the token, client IP, and an idempotency key to siteverify', async () => {
    mockUpstreams();
    await worker.fetch(signup(valid, { json: true }), subscribeEnv());
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe(SITEVERIFY);
    const params = new URLSearchParams(init.body);
    expect(params.get('secret')).toBe('turnstile-secret');
    expect(params.get('response')).toBe('token-123');
    expect(params.get('remoteip')).toBe(IP);
    expect(params.get('idempotency_key')).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('rejects a token Turnstile does not verify, without calling Kit', async () => {
    mockUpstreams({ turnstile: false });
    const res = await worker.fetch(signup(valid, { json: true }), subscribeEnv());
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ ok: false, error: 'turnstile-failed' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('creates an inactive subscriber, then adds it to the form', async () => {
    mockUpstreams();
    const res = await worker.fetch(signup(valid, { json: true }), subscribeEnv());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const kitCalls = fetchMock.mock.calls.slice(1);
    expect(kitCalls.map(([url]) => url)).toEqual([
      'https://api.kit.com/v4/subscribers',
      'https://api.kit.com/v4/forms/9381290/subscribers',
    ]);
    expect(JSON.parse(kitCalls[0]?.[1].body)).toEqual({ email_address: EMAIL, state: 'inactive' });
    expect(JSON.parse(kitCalls[1]?.[1].body)).toEqual({ email_address: EMAIL });
    for (const [, init] of kitCalls) {
      expect(init.headers['X-Kit-Api-Key']).toBe('kit-key');
    }
  });

  it('lets a KIT_FORM_ID secret override the published form ID', async () => {
    mockUpstreams();
    await worker.fetch(signup(valid, { json: true }), subscribeEnv({ KIT_FORM_ID: '42' }));
    expect(fetchMock.mock.calls[2]?.[0]).toBe('https://api.kit.com/v4/forms/42/subscribers');
  });

  it('enqueues the address instead of calling Kit when the queue is bound', async () => {
    mockUpstreams();
    const send = vi.fn(async () => {});
    const res = await worker.fetch(
      signup(valid, { json: true }),
      subscribeEnv({ SUBSCRIBE_QUEUE: { send } }),
    );
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledWith({ email: EMAIL });
    expect(fetchMock).toHaveBeenCalledTimes(1); // siteverify only
  });

  it('reports a Kit failure on the inline path', async () => {
    mockUpstreams({ kitStatus: 500 });
    const res = await worker.fetch(signup(valid, { json: true }), subscribeEnv());
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: 'upstream' });
  });

  it('redirects a plain form post back to the subscribe page', async () => {
    mockUpstreams();
    const ok = await worker.fetch(signup(valid), subscribeEnv());
    expect(ok.status).toBe(303);
    expect(ok.headers.get('Location')).toBe('https://ben.balter.com/subscribe/#subscribe-thanks');

    mockUpstreams({ turnstile: false });
    const bad = await worker.fetch(signup(valid), subscribeEnv());
    expect(bad.status).toBe(303);
    expect(bad.headers.get('Location')).toBe('https://ben.balter.com/subscribe/#subscribe-error');
  });

  it('never logs the email address or IP', async () => {
    mockUpstreams({ kitStatus: 503 });
    await worker.fetch(signup(valid, { json: true }), subscribeEnv());
    mockUpstreams({ kitStatus: 422 });
    await worker.fetch(signup(valid, { json: true }), subscribeEnv());
    await worker.fetch(signup(valid, { json: true }), subscribeEnv({ TURNSTILE_SECRET_KEY: '' }));

    expect(logged()).not.toBe('');
    expect(logged()).not.toContain(EMAIL);
    expect(logged()).not.toContain(IP);
  });

  describe('queue consumer', () => {
    /** @param {number} [attempts] */
    function message(attempts = 1) {
      return { body: { email: EMAIL }, attempts, ack: vi.fn(), retry: vi.fn() };
    }

    it('acks after Kit accepts the sign-up', async () => {
      mockUpstreams({ kitStatus: 200 });
      const msg = message();
      await worker.queue({ messages: [msg] }, subscribeEnv());
      expect(msg.ack).toHaveBeenCalled();
      expect(msg.retry).not.toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it.each([429, 500, 503])('retries with backoff when Kit returns %i', async (status) => {
      mockUpstreams({ kitStatus: status });
      const first = message(1);
      const third = message(3);
      await worker.queue({ messages: [first, third] }, subscribeEnv());
      expect(first.retry).toHaveBeenCalledWith({ delaySeconds: 30 });
      expect(third.retry).toHaveBeenCalledWith({ delaySeconds: 120 });
      expect(first.ack).not.toHaveBeenCalled();
    });

    it('retries on a network error', async () => {
      vi.stubGlobal('fetch', vi.fn(async () => {
        throw new TypeError('network');
      }));
      const msg = message();
      await worker.queue({ messages: [msg] }, subscribeEnv());
      expect(msg.retry).toHaveBeenCalled();
    });

    it('caps the backoff at 15 minutes', async () => {
      mockUpstreams({ kitStatus: 500 });
      const msg = message(20);
      await worker.queue({ messages: [msg] }, subscribeEnv());
      expect(msg.retry).toHaveBeenCalledWith({ delaySeconds: 900 });
    });

    it('drops a message Kit rejects outright', async () => {
      mockUpstreams({ kitStatus: 422 });
      const msg = message();
      await worker.queue({ messages: [msg] }, subscribeEnv());
      expect(msg.ack).toHaveBeenCalled();
      expect(msg.retry).not.toHaveBeenCalled();
    });

    it('retries rather than drops when the Kit key is missing', async () => {
      mockUpstreams();
      const msg = message();
      await worker.queue({ messages: [msg] }, subscribeEnv({ KIT_API_KEY: undefined }));
      expect(msg.retry).toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
      expect(logged()).not.toContain(EMAIL);
    });
  });
});
