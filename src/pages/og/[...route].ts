/**
 * Open Graph Image Generation Endpoint
 * 
 * Dynamically generates OG images for blog posts using Satori.
 * Layout matches Jekyll's jekyll-og-image plugin:
 * - Logo/headshot in top-right corner
 * - Title at top-left
 * - Description at bottom-left
 * - Domain at bottom-right
 * - Blue border at bottom
 * 
 * URL pattern: /og/[...route].png
 * Example: /og/2024/01/01/my-post.png
 */

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { generateOGImagePNG } from '../../lib/og-image-generator';
import { getPostUrl } from '../../utils/post-urls';

// Get all published posts for OG image generation
const posts = await getCollection('posts', ({ data }: CollectionEntry<'posts'>) => {
  return data.published !== false;
});

// Create a map of post paths to post data
const pages: Record<string, { title: string; description: string }> = {};

posts.forEach((post: CollectionEntry<'posts'>) => {
  // Use utility to get post URL, then strip leading/trailing slashes and add .png
  const postUrl = getPostUrl(post.slug);
  if (postUrl) {
    // Remove leading and trailing slashes, add .png extension
    const path = `${postUrl.replace(/^\/|\/$/g, '')}.png`;
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
  
  const png = await generateOGImagePNG({
    title,
    description,
  });
  
  // Convert Buffer to Uint8Array for Response compatibility
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
