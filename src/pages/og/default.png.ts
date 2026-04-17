/**
 * Default Open Graph Image
 *
 * Generates a single 1200x630 PNG used as the site-wide OG image fallback
 * for non-post pages (home, about, resume, talks, etc.) where no
 * post-specific OG image exists.
 *
 * Uses the same Satori-based generator as per-post images so social cards
 * render with the site name, tagline, and headshot at proper dimensions.
 */

import type { APIRoute } from 'astro';
import { generateOGImagePNG } from '../../lib/og-image-generator';
import { siteConfig } from '../../config';

export const GET: APIRoute = async () => {
  const png = await generateOGImagePNG({
    title: siteConfig.name,
    description: siteConfig.description,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
