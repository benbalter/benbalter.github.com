/**
 * Minimal first-party event tracking.
 *
 * Cloudflare Web Analytics (RUM) already measures pageviews at the zone level,
 * but has no custom-event API — so conversion events (newsletter subscribes,
 * book CTA clicks) are sent to a first-party endpoint (`/api/event`, handled
 * by worker/index.js) that writes to Workers Analytics Engine. No cookies, no
 * third parties, no user identifiers — just an event name and the page path.
 *
 * Failures are always silent: analytics must never break the page, and in
 * local dev/preview (where the Worker isn't running) the endpoint 404s.
 */

export interface TrackPayload {
  event: string;
  path: string;
}

/** Record a named event against the current page. Fire-and-forget. */
export function track(event: string): void {
  try {
    const payload: TrackPayload = { event, path: window.location.pathname };
    const body = JSON.stringify(payload);

    // sendBeacon survives page unload (important for outbound CTA clicks);
    // fall back to keepalive fetch where it's unavailable.
    if (navigator.sendBeacon?.(
      '/api/event',
      new Blob([body], { type: 'application/json' })
    )) {
      return;
    }

    void fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      /* ignore — see module doc */
    });
  } catch {
    /* ignore — see module doc */
  }
}
