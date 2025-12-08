/**
 * Feed Redirect (Legacy URL)
 * 
 * This feed existed at /feed/index.xml in earlier versions of the site.
 * It redirects users to the current feed location at /feed.xml using HTTP 301.
 * 
 * This maintains compatibility with older feed readers that may have
 * bookmarked the /feed/ URL.
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 301,
    headers: {
      'Location': '/feed.xml',
    },
  });
};
