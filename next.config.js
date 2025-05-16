/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove environment variables that might conflict with Vercel
  swcMinify: true,
  reactStrictMode: true
}

module.exports = nextConfig 