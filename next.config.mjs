import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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
      {
        protocol: 'https',
        hostname: 'github.com',
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
  
  // Optimize production builds
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Turbopack configuration (Next.js 16+ default)
  // Empty config to silence warning about webpack config
  turbopack: {},
  
  // Webpack configuration for better optimization (used in webpack mode only)
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
      };
    }
    
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
