/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // ✅ Changed from true to an empty object
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
