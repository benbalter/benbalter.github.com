// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
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

describe('other requests', () => {
  it('fall through to the assets binding unchanged', async () => {
    const env = makeEnv({ '/about/': '<h1>About</h1>' });
    const res = await worker.fetch(new Request('https://ben.balter.com/about/'), env);
    expect(await res.text()).toBe('<h1>About</h1>');
    expect(env.ASSETS.fetch).toHaveBeenCalledOnce();
  });

  it('serve GET /api/event from assets (only POST records events)', async () => {
    const env = makeEnv();
    const res = await worker.fetch(new Request('https://ben.balter.com/api/event'), env);
    expect(res.status).toBe(404);
    expect(env.ENGAGEMENT.writeDataPoint).not.toHaveBeenCalled();
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
