import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

/**
 * Content Collections configuration for Astro
 * 
 * This defines the frontmatter schema for blog posts and pages,
 * mapping from Jekyll's frontmatter format to Astro's type-safe schema.
 */

// Schema for blog posts (from _posts/)
const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields (consistent with Jekyll)
    title: z.string(),
    description: z.string(),
    
    // Optional fields from Jekyll frontmatter
    layout: z.string().optional(),
    permalink: z.string().optional(),
    published: z.boolean().default(true),
    archived: z.boolean().default(false), // For archived posts
    
    // Post metadata
    image: z.string().optional(), // Open Graph image
    comments: z.boolean().default(false),
    
    // SEO metadata
    sitemap: z.boolean().default(true), // Include in sitemap by default
    robots: z.string().optional(), // Robots meta tag
    
    // Redirects (Jekyll compatibility)
    // Support both single string and array of strings for redirect_from
    redirect_from: z.union([z.string(), z.array(z.string())]).optional(),
    redirect_to: z.string().optional(),
    
    // SEO metadata
    seo: z.object({
      type: z.string().optional(),
    }).optional(),
    
    // Additional metadata
    id: z.string().optional(),
    icons: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    
    // Post lists (for curated reading lists)
    // Support both array format (used by what-to-read post) and object format (used by 10-years post)
    posts: z.union([
      z.array(z.string()), // Array of URLs: ["/2021/01/01/slug/", ...]
      z.record(z.string(), z.string()) // Object with titles as keys: { "Title": "/2021/01/01/slug/" }
    ]).optional(),
    roles: z.array(z.string()).optional(),
  }),
});

// Schema for pages (about, resume, etc.)
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string(),
    
    // Optional fields from Jekyll frontmatter
    layout: z.string().optional(),
    permalink: z.string().optional(),
    published: z.boolean().default(true),
    
    // Page-specific metadata
    id: z.string().optional(),
    icons: z.boolean().optional(),
    
    // SEO metadata
    sitemap: z.boolean().default(true), // Include in sitemap by default
    robots: z.string().optional(), // Robots meta tag
    seo: z.object({
      type: z.string().optional(),
    }).optional(),
    
    // Redirects (Jekyll compatibility)
    redirect_from: z.array(z.string()).optional(),
    redirect_to: z.string().optional(),
    
    // Resume-specific fields
    degrees: z.array(z.object({
      school: z.string(),
      degree: z.string(),
      date: z.string(),
    })).optional(),
    certifications: z.array(z.object({
      authority: z.string(),
      name: z.string(),
      url: z.string().optional(),
    })).optional(),
  }),
});

// Schema for resume positions
const resumePositionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    employer: z.string(),
    title: z.string(),
    start_date: z.string(),
    
    // Optional fields
    end_date: z.string().optional(),
  }),
});

// Export collections
export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
  'resume-positions': resumePositionsCollection,
};
