/** @type {import('next').NextConfig} */
module.exports = {
  // Remove environment variables that might conflict with Vercel
  swcMinify: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  }
} 