/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable trailing slashes to match Jekyll's behavior
  trailingSlash: false,
  // Base path configuration (empty for user/org pages on GitHub Pages)
  basePath: '',
  // Disable server-side features for static export
  reactStrictMode: true,
}

export default nextConfig
