/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output static site for GitHub Pages compatibility
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Base path configuration (can be adjusted later)
  // basePath: '',
  
  // Trailing slash for GitHub Pages
  trailingSlash: true,

  // Legacy URL redirects from Jekyll
  // Note: redirects() is not supported with output: 'export'
  // These will need to be implemented via middleware or custom 404 handling
  // For now, documenting them for future implementation
};

export default nextConfig;
