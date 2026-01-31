/**
 * Sitemap Redirect
 * 
 * Redirects from the Jekyll sitemap URL (/sitemap.xml) to the Astro sitemap (/sitemap-0.xml).
 * This maintains backward compatibility with external links and search engines that may
 * reference the old Jekyll sitemap URL.
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(null, {
    status: 301,
    headers: {
      'Location': '/sitemap-0.xml',
    },
  });
};
