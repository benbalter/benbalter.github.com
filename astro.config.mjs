import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import favicons from 'astro-favicons';
import compress from 'astro-compress';
import expressiveCode from 'astro-expressive-code';
import fetchAvatar from './src/lib/astro-fetch-avatar.ts';
import {
  sharedRemarkPlugins,
  sharedRehypePlugins,
} from './src/lib/markdown-pipeline.ts';

// URL patterns for sitemap priority calculation
const BLOG_POST_PATTERN = /\/\d{4}\/\d{2}\/\d{2}\//;

// Pattern for detecting simple page names (not dynamic routes like "_slug_")
// Used in Vite config below to rename shared CSS bundles
const PAGE_NAME_PATTERN = /^[a-z0-9-]+$/;

// Pages that should be excluded from sitemap
// Add pages here that have sitemap: false in their front matter
// Format: Use the final URL path with trailing slash
const EXCLUDED_PAGES = [
  '/404/',
  '/_not-found/',
  '/fine-print/', // Has sitemap: false in original Jekyll source (fine-print.md)
  '/resume/linkedin/', // Utility page, not for search engines
  // To exclude posts/pages from content collections with sitemap: false,
  // add their URLs here (e.g., '/2024/01/01/post-slug/')
];


// https://astro.build/config
export default defineConfig({
  // Output directory for built site (separate from Jekyll _site/)
  outDir: './dist-astro',
  
  // Build settings for static site generation
  output: 'static',
  
  // Base URL configuration
  // This can be configured via environment variable if needed
  site: 'https://ben.balter.com',
  base: '/',
  
  // Trailing slashes to match static host conventions (GitHub Pages, Cloudflare Pages)
  trailingSlash: 'always',

  // Minify HTML output (removes whitespace, comments)
  compressHTML: true,
  
  // Redirects are handled at the Cloudflare edge via public/_redirects
  // (faster than Astro's HTML meta-refresh redirects, no malformed HTML)
  
  // Prefetch configuration for faster navigation
  // Use hover strategy to balance speed with bandwidth usage
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  
  // Font optimization via Astro's built-in Fonts API
  // Self-hosted via Fontsource for privacy (no third-party requests)
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
      display: 'optional',
    },
  ],
  
  // Build configuration
  build: {
    // Output format
    format: 'directory',
    // Assets directory
    assets: 'assets',
    // Inline all stylesheets into HTML to eliminate render-blocking CSS requests
    // This improves Speed Index by allowing content to paint faster
    // Trade-off: Larger HTML files but faster initial paint
    inlineStylesheets: 'always',
  },
  
  // Server configuration for development
  server: {
    // Use a different port than Jekyll (4000)
    port: 4321,
    host: true,
  },
  
  // Image optimization configuration
  // Allowlist remote image domains for Astro's Image component
  image: {
    // Default layout for responsive images (generates srcset/sizes automatically)
    layout: 'constrained',
    // Add global responsive image styles
    responsiveStyles: true,
    domains: [
      // Amazon book covers (used in other-recommended-reading page)
      'images.amazon.com',
      // Post header images from various sources
      'ben.balter.com',
      'f.cloud.github.com',
      'lawyerist-khcnq28r8rte6wv.stackpathdns.com',
      'user-images.githubusercontent.com',
      'github.com',
      'hackernoon.com',
    ],
  },
  
  // Integrations
  integrations: [
    // Fetch GitHub avatar at build time (must run first)
    fetchAvatar(),
    favicons({
      // Use existing high-quality PNG as source
      // The integration will generate all favicon formats automatically
      // Path includes 'public/' as shown in astro-favicons documentation examples
      input: {
        favicons: ['android-chrome-512x512.png'],
      },
      name: 'Ben Balter',
      short_name: 'Ben Balter',
      // Automatically inject favicon tags into all pages
      output: {
        images: true,
        files: true,
        html: true,
      },
    }),
    // Expressive Code for enhanced code blocks (must be before mdx)
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      styleOverrides: {
        borderRadius: '0.375rem',
      },
    }),
    mdx({
      // MDX configuration
      optimize: true,
      // Support GitHub Flavored Markdown
      remarkPlugins: sharedRemarkPlugins,
      rehypePlugins: sharedRehypePlugins,
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
    compress({
      // Compress HTML, CSS, and JavaScript for better performance
      CSS: true,
      HTML: {
        removeAttributeQuotes: false, // Keep quotes for better compatibility
        collapseWhitespace: true,
        conservativeCollapse: true,
      },
      Image: false, // Images are already optimized by Astro
      JavaScript: true,
      SVG: true,
    }),
  ],
  
  // Markdown configuration
  markdown: {
    // Syntax highlighting handled by astro-expressive-code integration
    // Enable smartypants for typographic punctuation (quotes and apostrophes)
    smartypants: true,
    // Remark plugins (for markdown processing)
    remarkPlugins: sharedRemarkPlugins,
    // Rehype plugins (for HTML processing)
    rehypePlugins: sharedRehypePlugins,
  },
  
  // Vite configuration
  vite: {
    // Tailwind CSS v4 uses the Vite plugin instead of the deprecated @astrojs/tailwind integration
    plugins: [tailwindcss()],
    // Ensure compatibility with existing build tools
    build: {
      // Separate chunk directory to avoid conflicts
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          // Customize asset file naming to avoid misleading names
          // Astro/Vite creates a shared CSS bundle from BaseLayout's global.css import
          // and names it after one of the pages (e.g., "about"). We rename it to "global"
          // to accurately reflect that it's the site's main stylesheet, not page-specific CSS.
          assetFileNames: (assetInfo) => {
            if (!assetInfo || !assetInfo.name) {
              return 'assets/[name].[hash][extname]';
            }
            
            if (assetInfo.name.endsWith('.css')) {
              const name = assetInfo.name.replace(/\.css$/, '');
              
              // Detect shared stylesheet: simple page names (not dynamic routes like "_slug_")
              // Match: about, contact, resume, index, fine-print, books-for-geeks, etc.
              // Don't match: _slug_, _year_, or other special patterns
              const isNotDynamicRoute = !name.startsWith('_');
              const matchesPagePattern = PAGE_NAME_PATTERN.test(name);
              const isPageName = isNotDynamicRoute && matchesPagePattern;
              
              if (isPageName) {
                // This is the shared global stylesheet - rename it for clarity
                return 'assets/global.[hash].css';
              }
              
              return 'assets/[name].[hash].css';
            }
            
            return 'assets/[name].[hash][extname]';
          },
        },
      },
    },
    // Enable build optimizations
    minify: true,
    cssMinify: true,
  },
});
