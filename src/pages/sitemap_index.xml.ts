/**
 * Sitemap Index Redirect
 * 
 * Redirects from the Jekyll sitemap index URL (/sitemap_index.xml) to the Astro sitemap index (/sitemap-index.xml).
 * This maintains backward compatibility with external links that may reference the old Jekyll sitemap index URL.
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(null, {
    status: 301,
    headers: {
      'Location': '/sitemap-index.xml',
    },
  });
};
