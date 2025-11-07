/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // GitHub Pages serves from a subdirectory in some cases
  // basePath: '',
  // assetPrefix: '',
};

export default nextConfig;
