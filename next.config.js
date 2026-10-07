/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Cloudflare Pages doesn't run the Next.js image optimizer
  },
};

module.exports = nextConfig;
