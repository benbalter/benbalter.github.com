import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import redirectIntegration from './src/lib/redirect-integration.ts';
import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkGitHubMentions } from './src/lib/remark-github-mentions.ts';

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
  
  // Image optimization configuration
  // Allowlist remote image domains for Astro's Image component
  image: {
    domains: [
      // GitHub avatars (used in MiniBio component)
      'avatars.githubusercontent.com',
      // Amazon book covers (used in other-recommended-reading page)
      'images.amazon.com',
      // Post header images from various sources
      'ben.balter.com',
      'lawyerist-khcnq28r8rte6wv.stackpathdns.com',
      'user-images.githubusercontent.com',
      'github.com',
      'hackernoon.com',
    ],
  },
  
  // Integrations
  integrations: [
    mdx({
      // MDX configuration
      optimize: true,
      // Support GitHub Flavored Markdown
      remarkPlugins: [remarkEmoji, remarkGitHubMentions],
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
    redirectIntegration(), // Generate redirect pages after build
  ],
  
  // Markdown configuration
  markdown: {
    // Enable syntax highlighting with GitHub themes (dual theme for dark mode support)
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    // Enable GitHub Flavored Markdown
    gfm: true,
    // Enable smartypants for typographic punctuation
    smartypants: true,
    // Remark plugins (for markdown processing)
    remarkPlugins: [remarkEmoji, remarkGitHubMentions],
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
      rollupOptions: {
        output: {
          // Customize asset file naming to avoid misleading names
          // The global stylesheet should not be named after a specific page like "about"
          assetFileNames: (assetInfo) => {
            // Check if this is a CSS file
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              const name = assetInfo.name.replace(/\.css$/, '');
              
              // Detect if this is the main/shared stylesheet by checking if it's from a page
              // and contains layout-level styles (BaseLayout imports optimized.scss)
              // The shared stylesheet will be named after one of the pages that use BaseLayout
              // We can identify it because:
              // 1. It's named after a page (not _slug_ or other special names)
              // 2. It's shared across multiple pages (Vite/Astro deduplicates common CSS)
              // 
              // Since Astro automatically deduplicates CSS imports across pages,
              // any CSS file that's named after a page but used everywhere is the global bundle.
              // Page-specific scoped styles are inlined, so external CSS files are shared.
              // 
              // We detect this by checking if the name matches common layout pages:
              // - Doesn't start with underscore (which indicates dynamic routes like _slug_)
              // - Is a simple page name (not a hash or build artifact)
              const isPageName = !name.startsWith('_') && /^[a-z-]+$/.test(name);
              
              if (isPageName) {
                // This is the shared global stylesheet that Vite bundled from BaseLayout
                // Rename it to 'global' to avoid confusion
                return 'assets/global.[hash].css';
              }
              
              return 'assets/[name].[hash].css';
            }
            return 'assets/[name].[hash][extname]';
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Allow importing from node_modules using ~ prefix (webpack style)
          loadPaths: ['node_modules'],
          // Suppress deprecation warnings for @import rules (Bootstrap 5.3.x uses them)
          quietDeps: true,
          // Silence all @import deprecation warnings globally
          // This affects both our code and Bootstrap's internal @import usage
          // Bootstrap 5.3.x doesn't support the modern @use module system yet.
          // TODO: Remove this once Bootstrap 6.x is released with @use support
          // See: https://sass-lang.com/documentation/breaking-changes/import
          silenceDeprecations: ['import'],
        },
      },
    },
  },
});
