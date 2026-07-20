/**
 * Cloudflare Worker entry: static assets + first-party engagement events.
 *
 * Every request that matches a built asset is served directly by the assets
 * layer without invoking this Worker (wrangler `assets` config). Requests that
 * fall through arrive here: `POST /api/event` records a conversion event
 * (e.g. newsletter subscribe, book CTA click — sent by src/scripts/track.ts)
 * to Workers Analytics Engine; everything else is delegated back to the assets
 * binding so `not_found_handling` still serves the 404 page.
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

    return env.ASSETS.fetch(request);
  },
};
