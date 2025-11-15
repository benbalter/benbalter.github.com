/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output static site for GitHub Pages compatibility
  output: 'export',
  
  // Output directory (default is 'out')
  // Will be merged with Jekyll's _site by build script
  distDir: 'out',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Base path configuration (can be adjusted later)
  // basePath: '',
  
  // Trailing slash for GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
