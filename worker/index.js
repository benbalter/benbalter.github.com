/**
 * Cloudflare Worker entry: static assets + first-party engagement events +
 * Markdown content negotiation.
 *
 * `assets.runWorkerFirst` (cloudflare.config.ts) routes page requests through this
 * Worker before the assets layer (static asset buckets like /assets/* are
 * excluded and served directly). Requests are handled as follows:
 *   - `POST /api/event` records a conversion event (e.g. newsletter subscribe,
 *     book CTA click — sent by src/scripts/track.ts) to Workers Analytics
 *     Engine.
 *   - GET/HEAD with `Accept: text/markdown` is served the pre-built `.md`
 *     representation of the page when one exists (see src/pages/**​/*.md.ts),
 *     falling back to HTML otherwise.
 *   - Everything else is delegated to the assets binding unchanged, so the
 *     `_headers` (Link, CSP, cache) and `not_found_handling` 404 page still
 *     apply exactly as before.
 *
 * Query events via the Analytics Engine SQL API, e.g.:
 *   SELECT blob1 AS event, blob2 AS path, SUM(_sample_interval) AS count
 *   FROM benbalter_engagement
 *   WHERE timestamp > NOW() - INTERVAL '7' DAY
 *   GROUP BY event, path ORDER BY count DESC
 *
 * No cookies, no IPs, no user identifiers are stored — only event name,
 * page path, and referrer.
 */

/** Allowed event names — reject anything else so the dataset stays clean. */
const EVENTS = new Set(['subscribe', 'book-cta']);

/**
 * True when the client explicitly asks for Markdown via the Accept header.
 * Only an explicit `text/markdown` media range counts — browsers (text/html,
 * ..., *​/*) and default clients keep getting HTML.
 * @param {Request} request
 * @returns {boolean}
 */
function wantsMarkdown(request) {
  const accept = request.headers.get('Accept');
  if (!accept) return false;
  return accept
    .split(',')
    .some((range) => range.trim().toLowerCase().startsWith('text/markdown'));
}

/**
 * Map a page pathname to the pathname of its pre-built `.md` sibling, or null
 * if the request isn't for a page (site uses `trailingSlash: 'always'`, so
 * pages end in `/`; anything else is a file asset with no Markdown variant).
 *   `/`                       -> `/index.md`
 *   `/2020/01/01/slug/`       -> `/2020/01/01/slug.md`
 * @param {string} pathname
 * @returns {string | null}
 */
function markdownPathFor(pathname) {
  if (pathname === '/') return '/index.md';
  if (pathname.endsWith('/')) return `${pathname.slice(0, -1)}.md`;
  return null;
}

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: { fetch: typeof fetch }, ENGAGEMENT?: { writeDataPoint: (point: object) => void } }} env
   * @returns {Promise<Response>}
   */
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/event' && request.method === 'POST') {
      let payload;
      try {
        payload = await request.json();
      } catch {
        return new Response('Bad request', { status: 400 });
      }

      const { event, path } = payload ?? {};
      if (
        typeof event !== 'string' ||
        !EVENTS.has(event) ||
        typeof path !== 'string' ||
        path.length > 256
      ) {
        return new Response('Bad request', { status: 400 });
      }

      env.ENGAGEMENT?.writeDataPoint({
        blobs: [event, path, request.headers.get('referer') ?? ''],
        doubles: [1],
        indexes: [event],
      });

      return new Response(null, { status: 204 });
    }

    // Markdown content negotiation: serve the pre-built `.md` sibling when the
    // client asks for it and one exists; otherwise fall through to HTML.
    if (
      (request.method === 'GET' || request.method === 'HEAD') &&
      wantsMarkdown(request)
    ) {
      const mdPath = markdownPathFor(url.pathname);
      if (mdPath) {
        const mdRequest = new Request(new URL(mdPath, url.origin), {
          method: 'GET',
        });
        const mdResponse = await env.ASSETS.fetch(mdRequest);
        if (mdResponse.ok) {
          const markdown = await mdResponse.text();
          // Start from the asset's headers so `_headers` rules (CSP, Link,
          // Permissions-Policy, ...) still apply, then override what differs.
          const headers = new Headers(mdResponse.headers);
          headers.set('Content-Type', 'text/markdown; charset=utf-8');
          // Distinguish this representation from the HTML at the same URL for
          // any cache that honors Vary. Cloudflare's edge cache does not vary
          // on Accept, so `private` also keeps shared caches from serving this
          // Markdown to HTML clients while still allowing the agent's own
          // client to cache it.
          headers.append('Vary', 'Accept');
          headers.set('Cache-Control', 'private, max-age=300');
          // Optional per the spec — a cheap ~4-chars-per-token estimate.
          headers.set('x-markdown-tokens', String(Math.ceil(markdown.length / 4)));
          headers.delete('Content-Length');
          return new Response(request.method === 'HEAD' ? null : markdown, {
            status: 200,
            headers,
          });
        }
        // No Markdown variant for this page — fall through to HTML below.
      }
    }

    const response = await env.ASSETS.fetch(request);
    // Pages have a Markdown variant, so the HTML must say it varies on Accept
    // too, or a client cache could reuse it for a later Markdown request.
    if (markdownPathFor(url.pathname)) {
      const varied = new Response(response.body, response);
      varied.headers.append('Vary', 'Accept');
      // Enforce the source policy on Worker-served pages if edge asset headers lag.
      varied.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      return varied;
    }
    return response;
  },
};
