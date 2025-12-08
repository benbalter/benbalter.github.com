import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import yaml from '@rollup/plugin-yaml';

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
      remarkPlugins: [],
      rehypePlugins: [],
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
    remarkPlugins: [],
    // Rehype plugins (for HTML processing)
    rehypePlugins: [],
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
    // Add YAML support
    plugins: [yaml()],
  },
});
