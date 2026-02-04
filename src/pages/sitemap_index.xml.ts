/**
 * Sitemap Index Redirect
 * 
 * Redirects from the Jekyll sitemap index URL (/sitemap_index.xml) to the Astro sitemap (/sitemap-0.xml).
 * This maintains backward compatibility with external links that may reference the old Jekyll sitemap index URL.
 * 
 * Note: For static site builds, Astro automatically converts the 301 Response to an HTML
 * meta refresh redirect since static files cannot return HTTP status codes.
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  // Astro will convert this 301 response to an HTML meta refresh redirect
  // for static site builds, preserving the redirect behavior
  return new Response(null, {
    status: 301,
    headers: {
      'Location': '/sitemap-0.xml',
    },
  });
};
