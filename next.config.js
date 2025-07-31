/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization in development
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: [
      'localhost',
      'your-production-domain.com',
      // Vercel Blob Storage domains
      'koobings.com',
      'service-scheduler-hpma2owhj-filipe-pedrosas-projects.vercel.app',
      'service-scheduler-7bjju0thl-filipe-pedrosas-projects.vercel.app',
      // Vercel Blob domains
      'blob.vercel-storage.com',
      'b2sssahhzvdtb8u7.public.blob.vercel-storage.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      }
    ]
  },

  // Enable strict mode for better development experience
  reactStrictMode: true,

  // Performance optimizations
  experimental: {
    scrollRestoration: true,
  },

  // Optimize bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configure headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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