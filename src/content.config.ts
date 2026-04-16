import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Content Collections configuration for Astro
 * 
 * This defines the frontmatter schema for blog posts and pages,
 * mapping from Jekyll's frontmatter format to Astro's type-safe schema.
 */

/**
 * Valid Schema.org types for the site's structured data.
 * Maps to the types used in src/utils/structured-data.ts.
 * Accepts both standard PascalCase (e.g., "Person") and legacy lowercase values.
 */
const schemaOrgType = z.enum([
  'BlogPosting',
  'Person', 'person',
  'ProfilePage',
  'WebPage',
  'WebSite',
]);

/** SEO metadata schema shared by posts and pages */
const seoSchema = z.object({
  type: schemaOrgType.optional(),
}).optional();

/**
 * Redirect source paths (Jekyll compatibility).
 * Accepts both a single string and an array of strings.
 */
const redirectFrom = z.union([z.string(), z.array(z.string())]).optional();

/**
 * Schema for blog posts (from posts/).
 *
 * Post entry IDs are derived from filenames by the glob loader and must follow
 * the Jekyll naming convention: YYYY-MM-DD-title.md (e.g., "2024-01-15-my-post.md").
 */
const postsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    // Required fields (consistent with Jekyll)
    title: z.string(),
    description: z.string().max(300), // Ideal: ≤160 chars for SERP snippets
    tldr: z.string().optional(), // On-page TL;DR summary (falls back to description if not set)
    
    // Optional fields from Jekyll frontmatter
    layout: z.string().optional(),
    permalink: z.string().optional(),
    published: z.boolean().default(true),
    archived: z.boolean().default(false), // For archived posts
    
    // Post metadata
    image: z.string().optional(), // Open Graph image
    
    // SEO metadata
    sitemap: z.boolean().default(true), // Include in sitemap by default
    robots: z.string().optional(), // Robots meta tag
    
    // Redirects (Jekyll compatibility)
    redirect_from: redirectFrom,
    redirect_to: z.string().optional(),
    
    // SEO metadata
    seo: seoSchema,
    
    // Additional metadata
    id: z.string().optional(),
    icons: z.boolean().optional(),
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
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string().max(300), // Ideal: ≤160 chars for SERP snippets
    
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
    seo: seoSchema,
    
    // Redirects (Jekyll compatibility)
    redirect_from: redirectFrom,
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
      category: z.enum(['professional', 'personal']).default('professional'),
    })).optional(),
    skills: z.array(z.object({
      group: z.string(),
      items: z.array(z.string()),
    })).optional(),
    summary: z.string().optional(),
  }),
});

// Schema for resume positions
const resumePositionsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/resume-positions' }),
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
