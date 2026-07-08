/**
 * Open Graph Image Endpoint for shareable quotes.
 *
 * Generates a quote-focused social card for each entry in the quote registry.
 * URL pattern: /og/q/<id>.png
 */

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateQuoteOGImagePNG } from '../../../lib/og-image-generator';
import { resolveQuotes } from '../../../utils/quotes';
import { siteConfig } from '../../../config';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  return resolveQuotes(posts).map((quote) => ({
    params: { id: quote.id },
    props: {
      text: quote.text,
      attribution: siteConfig.author,
    },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { text, attribution } = props as { text: string; attribution: string };

  const png = await generateQuoteOGImagePNG({ text, attribution });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
