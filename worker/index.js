/**
 * Cloudflare Worker entry: static assets + first-party engagement events.
 *
 * `assets.run_worker_first` (wrangler.json) routes only /api/event through
 * this Worker; every other request is served by the assets layer directly
 * (with `_headers`, `_redirects`, and the `not_found_handling` 404 page), so
 * page views don't count against the account's daily Worker request cap.
 * worker/routing.test.js guards that list.
 *
 * `POST /api/event` records a conversion event (e.g. newsletter subscribe,
 * book CTA click — sent by src/scripts/track.ts) to Workers Analytics Engine.
 * Anything else that reaches the Worker falls through to the assets binding.
 *
 * Markdown content negotiation (`Accept: text/markdown` -> the page's
 * pre-built `.md` sibling from src/pages/**​/*.md.ts, with `Vary: Accept`)
 * used to live here but is now a Cloudflare URL Rewrite Rule plus Response
 * Header Transform Rules on the zone, so it no longer needs a Worker run per
 * page view. script/validate-markdown-siblings checks every page those rules
 * rewrite has its `.md` file; script/check-markdown-negotiation checks the
 * live behavior.
 *
 * Query events via the Analytics Engine SQL API, e.g.:
 *   SELECT blob1 AS event, blob2 AS path, SUM(_sample_interval) AS count
 *   FROM benbalter_engagement
 *   WHERE timestamp > NOW() - INTERVAL '7' DAY
 *   GROUP BY event, path ORDER BY count DESC
 *
 * No cookies, no IPs, no user identifiers are stored — only event name,
 * page path, and the origin of the page's inbound referrer (blob3).
 */

/** Allowed event names — reject anything else so the dataset stays clean. */
const EVENTS = new Set(['subscribe', 'book-cta']);

/**
 * The origin of the page's inbound referrer (`document.referrer`, sent by the
 * client), or '' when absent or not an http(s) URL. Only the origin is kept,
 * so search terms, campaign params, and paths on other sites never reach the
 * dataset. Not the request's own `Referer` header: on a same-origin beacon
 * that's just the current page's URL, query string included.
 * @param {unknown} value
 * @returns {string}
 */
function referrerOrigin(value) {
  if (typeof value !== 'string' || value === '') return '';
  try {
    const { protocol, origin } = new URL(value);
    return protocol === 'http:' || protocol === 'https:' ? origin : '';
  } catch {
    return '';
  }
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

      const { event, path, referrer } = payload ?? {};
      if (
        typeof event !== 'string' ||
        !EVENTS.has(event) ||
        typeof path !== 'string' ||
        path.length > 256
      ) {
        return new Response('Bad request', { status: 400 });
      }

      env.ENGAGEMENT?.writeDataPoint({
        blobs: [event, path, referrerOrigin(referrer)],
        doubles: [1],
        indexes: [event],
      });

      return new Response(null, { status: 204 });
    }

    return env.ASSETS.fetch(request);
  },
};
