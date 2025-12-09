import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// URL patterns for sitemap priority calculation
const BLOG_POST_PATTERN = /\/\d{4}\/\d{2}\/\d{2}\//;

// Pages that should be excluded from sitemap
// Add pages here that have sitemap: false in their front matter
// Format: Use the final URL path with trailing slash
const EXCLUDED_PAGES = [
  '/404/',
  '/_not-found/',
  '/fine-print/', // Has sitemap: false in original Jekyll source (fine-print.md)
  // To exclude posts/pages from content collections with sitemap: false,
  // add their URLs here (e.g., '/2024/01/01/post-slug/')
];

// https://astro.build/config
export default defineConfig({
  // Output directory for built site (separate from Jekyll and Next.js)
  outDir: './dist-astro',
  
  // Build settings for static site generation
  output: 'static',
  
  // Base URL configuration for GitHub Pages
  // This can be configured via environment variable if needed
  site: 'https://ben.balter.com',
  base: '/',
  
  // Trailing slashes to match GitHub Pages behavior
  trailingSlash: 'always',
  
  // Build configuration
  build: {
    // Output format
    format: 'directory',
    // Assets directory
    assets: 'assets',
  },
  
  // Server configuration for development
  server: {
    // Use a different port than Next.js (3000) and Jekyll (4000)
    port: 4321,
    host: true,
  },
  
  // Integrations
  integrations: [
    mdx({
      // MDX configuration
      optimize: true,
      // Support GitHub Flavored Markdown
      remarkPlugins: [remarkEmoji],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, {
          behavior: 'append',
          properties: {
            className: ['anchor-link'],
            ariaLabel: 'Link to this section',
          },
          content: {
            type: 'element',
            tagName: 'span',
            properties: { className: ['anchor-icon'] },
            children: [{ type: 'text', value: '#' }]
          }
        }],
      ],
    }),
    sitemap({
      // Customize sitemap generation
      filter: (page) => {
        // Exclude pages explicitly marked with sitemap: false
        // This includes 404, not-found, and pages like fine-print
        return !EXCLUDED_PAGES.some(pattern => page.includes(pattern));
      },
      // Customize URL entries with priority and changefreq
      serialize: (item) => {
        // Set priority and changefreq based on URL pattern
        let priority = 0.6; // Default for static pages
        let changefreq = 'monthly';
        
        // Homepage gets highest priority
        if (item.url === 'https://ben.balter.com/') {
          priority = 1.0;
          changefreq = 'weekly';
        }
        // Blog posts get high priority
        else if (BLOG_POST_PATTERN.test(item.url)) {
          priority = 0.8;
          changefreq = 'monthly';
        }
        
        return {
          ...item,
          priority,
          changefreq,
        };
      },
    }),
  ],
  
  // Markdown configuration
  markdown: {
    // Enable syntax highlighting with GitHub theme
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
    // Enable GitHub Flavored Markdown
    gfm: true,
    // Enable smartypants for typographic punctuation
    smartypants: true,
    // Remark plugins (for markdown processing)
    remarkPlugins: [remarkEmoji],
    // Rehype plugins (for HTML processing)
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'append',
        properties: {
          className: ['anchor-link'],
          ariaLabel: 'Link to this section',
        },
        content: {
          type: 'element',
          tagName: 'span',
          properties: { className: ['anchor-icon'] },
          children: [{ type: 'text', value: '#' }]
        }
      }],
    ],
  },
  
  // Vite configuration
  vite: {
    // Ensure compatibility with existing build tools
    build: {
      // Separate chunk directory to avoid conflicts
      assetsDir: 'assets',
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Allow importing from node_modules using ~ prefix (webpack style)
          loadPaths: ['node_modules'],
          // Suppress deprecation warnings for @import rules (Bootstrap 5.3.x uses them)
          quietDeps: true,
        },
      },
    },
  },
});
