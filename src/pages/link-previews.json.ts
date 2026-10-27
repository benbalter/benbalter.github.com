/**
 * Static JSON endpoint of cached GitHub repo and Wikipedia metadata for link
 * preview cards, keyed by `externalPreviewKey()`. The data is fetched ahead of
 * time by script/build-link-previews.ts and committed, so builds never depend
 * on third-party APIs. Only the keys some post links to are served.
 */

import cache from '../data/link-previews.json';
import type { ExternalPreviewCache } from '../utils/link-preview-keys';

export function GET() {
  const { previews } = cache as ExternalPreviewCache;
  return new Response(JSON.stringify(previews), {
    headers: { 'Content-Type': 'application/json' },
  });
}
