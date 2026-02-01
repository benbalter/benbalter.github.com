import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import favicons from 'astro-favicons';
import compress from 'astro-compress';
import redirectIntegration from './src/lib/redirect-integration.ts';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { remarkGitHubMentions } from './src/lib/remark-github-mentions.ts';
import { rehypeRelativeUrls } from './src/lib/rehype-relative-urls.ts';

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
  // To exclude posts/pages from content collections with sitemap: false,
  // add their URLs here (e.g., '/2024/01/01/post-slug/')
];

// Shared rehype plugin configurations
const rehypeExternalLinksConfig = [rehypeExternalLinks, {
  target: '_blank',
  rel: ['noopener', 'noreferrer'],
}];

const rehypeAutolinkHeadingsConfig = [rehypeAutolinkHeadings, {
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
}];

// https://astro.build/config
export default defineConfig({
  // Output directory for built site (separate from Jekyll _site/)
  outDir: './dist-astro',
  
  // Build settings for static site generation
  output: 'static',
  
  // Base URL configuration for GitHub Pages
  // This can be configured via environment variable if needed
  site: 'https://ben.balter.com',
  base: '/',
  
  // Trailing slashes to match GitHub Pages behavior
  trailingSlash: 'always',
  
  // Prefetch configuration for faster navigation
  // Use hover strategy to balance speed with bandwidth usage
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  
  // Build configuration
  build: {
    // Output format
    format: 'directory',
    // Assets directory
    assets: 'assets',
    // Enable inlining of small assets for better performance
    inlineStylesheets: 'auto',
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
    mdx({
      // MDX configuration
      optimize: true,
      // Support GitHub Flavored Markdown
      remarkPlugins: [
        remarkGfm,
        remarkEmoji,
        remarkGitHubMentions,
      ],
      rehypePlugins: [
        rehypeSlug,
        rehypeAutolinkHeadingsConfig,
        rehypeUnwrapImages,
        rehypeRelativeUrls,
        rehypeExternalLinksConfig,
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
    // Enable syntax highlighting with GitHub themes (dual theme for dark mode support)
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    // Enable smartypants for typographic punctuation
    smartypants: true,
    // Remark plugins (for markdown processing)
    remarkPlugins: [
      remarkGfm,
      remarkEmoji,
      remarkGitHubMentions,
    ],
    // Rehype plugins (for HTML processing)
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadingsConfig,
      rehypeUnwrapImages,
      rehypeRelativeUrls,
      rehypeExternalLinksConfig,
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
          // Astro/Vite creates a shared CSS bundle from BaseLayout's optimized.scss import
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
    // Enable build optimizations
    minify: true,
    cssMinify: true,
  },
});
