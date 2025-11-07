/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output static site for GitHub Pages compatibility
  output: 'export',
  
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
