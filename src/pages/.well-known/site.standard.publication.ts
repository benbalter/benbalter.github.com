/**
 * site.standard.publication - standard.site publication verification
 *
 * Serves the AT-URI of this site's site.standard.publication record at
 * /.well-known/site.standard.publication, the discovery endpoint indexers use to
 * confirm the publication record points back to this domain.
 *
 * Returns 404 until the publication record exists and its AT-URI is set in
 * siteConfig.standardSite.publicationUri (created via
 * script/standard-site/create-publication.ts).
 *
 * Reference: https://standard.site/
 */

import type { APIRoute } from 'astro';
import { siteConfig } from '../../config';

export const GET: APIRoute = () => {
  const { publicationUri } = siteConfig.standardSite;

  if (!publicationUri) {
    return new Response(null, { status: 404 });
  }

  return new Response(publicationUri, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
