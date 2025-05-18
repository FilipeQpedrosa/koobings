/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove environment variables that might conflict with Vercel
  swcMinify: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  output: 'standalone',
  images: {
    domains: [
      'localhost',
      'railway.app',
      'images.unsplash.com',
      'avatars.githubusercontent.com',
    ],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  }
};

module.exports = nextConfig; 