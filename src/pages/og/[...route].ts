/**
 * Open Graph Image Generation Endpoint
 *
 * Generates a per-post OG card at build time with Satori (dark, centered
 * headline hero + author lockup; see og-image-generator).
 *
 * URL pattern: /og/[...route].png
 * Example: /og/2024/01/01/my-post.png
 */

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { generateOGImagePNG } from '../../lib/og-image-generator';
import { ogImageRoute } from '../../utils/og-image-path';
import { siteConfig } from '../../config';

const PNG_HEADERS = {
  'Content-Type': 'image/png',
  'Cache-Control': 'public, max-age=31536000, immutable',
};

// Get all published posts for OG image generation
const posts = await getCollection('posts', ({ data }: CollectionEntry<'posts'>) => {
  return data.published !== false;
});

// Create a map of post paths to post data
const pages: Record<string, { title: string; description: string }> = {};

posts.forEach((post: CollectionEntry<'posts'>) => {
  // Route param form (YYYY/MM/DD/slug.png) from the YYYY-MM-DD-slug id.
  const path = ogImageRoute(post.id);
  if (path) {
    pages[path] = {
      title: post.data.title,
      description: post.data.description || '',
    };
  }
});

export const getStaticPaths: GetStaticPaths = async () => {
  return Object.keys(pages).map((path) => ({
    params: { route: path },
    props: pages[path],
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description } = props as { title: string; description: string };

  // Per-card resilience: if one post's content makes generation throw, fall back
  // to the site's default card (a known-safe input) rather than failing the whole
  // build. (A pathological *synchronous* Satori layout loop can't be interrupted
  // from JS — that class is prevented at the input layer, e.g. numeral handling —
  // but any thrown error here degrades gracefully.)
  try {
    const png = await generateOGImagePNG({ title, description });
    return new Response(new Uint8Array(png), { headers: PNG_HEADERS });
  } catch (error) {
    console.warn(
      `[og] Failed to generate card for "${title}": ${
        error instanceof Error ? error.message : String(error)
      }. Falling back to the default card.`,
    );
    const png = await generateOGImagePNG({ title: siteConfig.description, description: '' });
    return new Response(new Uint8Array(png), { headers: PNG_HEADERS });
  }
};
