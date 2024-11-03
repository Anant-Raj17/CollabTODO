/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This will ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will ignore TypeScript errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
