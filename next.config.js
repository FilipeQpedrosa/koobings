/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization in development
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: [
      'localhost',
      'your-production-domain.com'
    ],
  },

  // Enable strict mode for better development experience
  reactStrictMode: true,

  // Configure headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ]
  },

  // Configure redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Webpack configuration for Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    return config
  },

  // Environment variables that should be available to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Disable ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // External packages for server-side rendering
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

module.exports = nextConfig; 