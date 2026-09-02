/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },
};

export default nextConfig;
