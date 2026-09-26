// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import worker from './index.js';

/** Fake ASSETS binding serving a fixed map of pathname -> body. */
function makeEnv(files = {}) {
  const writeDataPoint = vi.fn();
  return {
    ASSETS: {
      fetch: vi.fn(async (request) => {
        const { pathname } = new URL(request.url);
        return pathname in files
          ? new Response(files[pathname], { status: 200, headers: { 'Content-Type': 'text/html' } })
          : new Response('Not found', { status: 404 });
      }),
    },
    ENGAGEMENT: { writeDataPoint },
  };
}

const md = (path, init = {}) =>
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
  });

  it('does not negotiate file assets', async () => {
    const env = makeEnv({ '/feed.xml': '<rss>' });
    const res = await worker.fetch(md('/feed.xml'), env);
    expect(await res.text()).toBe('<rss>');
  });
});

describe('POST /api/event', () => {
  const post = (body) =>
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
