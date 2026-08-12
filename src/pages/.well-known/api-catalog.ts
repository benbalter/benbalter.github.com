/**
 * api-catalog — machine-readable catalog of the site's structured resources.
 *
 * Served at /.well-known/api-catalog per RFC 9727 (referenced by the
 * `rel="api-catalog"` Link header in public/_headers). The body is a linkset
 * document per RFC 9264 (`application/linkset+json`): a single context (the
 * site root) with its machine-readable representations grouped by IANA-
 * registered link relation. Every target below is a real endpoint that returns
 * 200, so agents can discover the site's structured surfaces from one document.
 */

import type { APIRoute } from 'astro';
import { siteConfig } from '../../config';

const { url } = siteConfig;

export const GET: APIRoute = () => {
  const linkset = {
    linkset: [
      {
        anchor: `${url}/`,
        describedby: [
          {
            href: `${url}/llms.txt`,
            type: 'text/plain',
            title: 'LLM-friendly description of the site and its content',
          },
        ],
        author: [
          {
            href: `${url}/vcard.vcf`,
            type: 'text/vcard',
            title: 'Author contact card (vCard)',
          },
        ],
        alternate: [
          {
            href: `${url}/feed.xml`,
            type: 'application/atom+xml',
            title: 'Atom feed of recent posts',
          },
        ],
        related: [
          {
            href: `${url}/sitemap.xml`,
            type: 'application/xml',
            title: 'XML sitemap of public pages',
          },
          {
            href: `${url}/posts-meta.json`,
            type: 'application/json',
            title: 'Machine-readable index of post metadata',
          },
          {
            href: `${url}/.well-known/security.txt`,
            type: 'text/plain',
            title: 'Security contact and policy (RFC 9116)',
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(linkset, null, 2), {
    status: 200,
    headers: {
      // RFC 9264 media type for a linkset serialized as JSON.
      'Content-Type': 'application/linkset+json; charset=utf-8',
    },
  });
};
