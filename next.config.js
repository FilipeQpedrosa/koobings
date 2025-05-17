/** @type {import('next').NextConfig} */
module.exports = {
  // Remove environment variables that might conflict with Vercel
  swcMinify: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  output: 'standalone',
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
} 