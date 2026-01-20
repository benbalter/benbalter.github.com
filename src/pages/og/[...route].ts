/**
 * Open Graph Image Generation Endpoint
 * 
 * Dynamically generates OG images for blog posts using astro-og-canvas.
 * This endpoint is called for each post at build time to generate static OG images.
 * 
 * URL pattern: /og/[...route].png
 * Example: /og/2024/01/01/my-post.png
 */

import { OGImageRoute } from 'astro-og-canvas';
import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultOGConfig } from '../../lib/og-config';

// Get all published posts for OG image generation
const posts = await getCollection('posts', ({ data }: CollectionEntry<'posts'>) => {
  return data.published !== false;
});

// Create a map of post paths to post data
const pages: Record<string, { title: string; description: string }> = {};

posts.forEach((post: CollectionEntry<'posts'>) => {
  // Extract date from slug (YYYY-MM-DD-slug format)
  const dateMatch = post.slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  
  if (dateMatch) {
    const [, year, month, day, slug] = dateMatch;
    const path = `${year}/${month}/${day}/${slug}`;
    pages[path] = {
      title: post.data.title,
      description: post.data.description || '',
    };
  }
});

// Helper to convert hex color to RGB tuple
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ];
  }
  return [0, 0, 0]; // Default to black if parsing fails
}

export const { getStaticPaths, GET } = await OGImageRoute({
  // Pass the pages object
  pages,
  
  // OG image configuration matching Jekyll's og_image config
  param: 'route',
  
  // Custom styling to match Jekyll og_image with enhancements
  getImageOptions: async (_path, page) => {
    // Convert the first border color from hex to RGB
    const borderColor = hexToRgb(defaultOGConfig.border.colors[0]);
    
    return {
      title: page.title,
      description: page.description,
      
      // Add logo/headshot for brand recognition (Jekyll og_image feature)
      logo: {
        path: './assets/img/headshot.jpg',
        size: [100], // Resize width to 100px, height proportional
      },
      
      // Use gradient background from config for visual depth
      bgGradient: defaultOGConfig.backgroundGradient.map(hexToRgb),
      
      border: {
        color: borderColor,
        width: defaultOGConfig.border.height,
        side: 'block-end' as const,
      },
      
      // Increased padding for better spacing
      padding: 80,
      
      font: {
        title: {
          size: defaultOGConfig.title.fontSize,
          families: ['Inter'],
          color: hexToRgb(defaultOGConfig.title.color),
          weight: 'Bold' as const,
          lineHeight: 1.1, // Tighter line height for title
        },
        description: {
          size: defaultOGConfig.description.fontSize,
          families: ['Inter'],
          color: hexToRgb(defaultOGConfig.description.color),
          lineHeight: 1.4, // Better readability for description
        },
      },
      
      fonts: [
        // Use Inter font for better web typography
        'https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf',
        'https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf',
      ],
      
      // Use PNG format for best quality
      format: 'PNG' as const,
      quality: 95,
    };
  },
});
