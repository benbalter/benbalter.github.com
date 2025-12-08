import { defineConfig } from 'astro/config';

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
  
  // Markdown configuration
  markdown: {
    // Enable syntax highlighting
    shikiConfig: {
      theme: 'github-light',
    },
  },
  
  // Vite configuration
  vite: {
    // Ensure compatibility with existing build tools
    build: {
      // Separate chunk directory to avoid conflicts
      assetsDir: 'assets',
    },
  },
});
