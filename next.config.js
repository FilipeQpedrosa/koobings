/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOMER_PORT: 3000,
    STAFF_PORT: 4000,
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Staff portal routes
        {
          source: '/staff/:path*',
          has: [
            {
              type: 'host',
              value: 'staff.:hostname',
            },
          ],
          destination: '/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig 