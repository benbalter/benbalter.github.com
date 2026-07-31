/**
 * Default Open Graph Image
 *
 * Generates a single 1200x630 PNG used as the site-wide OG image fallback
 * for non-post pages (home, about, resume, etc.) where no
 * post-specific OG image exists.
 *
 * Uses the same Satori-based generator as per-post images so social cards
 * render with the site name, tagline, and headshot at proper dimensions.
 */

import type { APIRoute } from 'astro';
import { generateOGImagePNG } from '../../lib/og-image-generator';
import { siteConfig } from '../../config';

export const GET: APIRoute = async () => {
  // Lead with the value proposition, not the name — the footer lockup already
  // brands "Ben Balter" + the domain, so a name headline would just repeat it.
  // A subtitle keeps the card from reading as an empty/unfinished template.
  const png = await generateOGImagePNG({
    title: siteConfig.description,
    description: 'Practical, opinionated writing for people who build software and lead teams.',
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
