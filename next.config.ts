// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {

    remotePatterns: [
      {
        protocol: 'https',                   // only https
        hostname: 'lh3.googleusercontent.com',
        port: '',                            // default port
        pathname: '/**',                     // allow any path under this host
      },
      {
        protocol: 'https',                   // only https
        hostname: 'community.softr.io',
        pathname: '/**',                     // allow any path under this host
      },
      {
        protocol: 'https',                   // only https
        hostname: 'www.shutterstock.com',
        port: '',                            // default port
        pathname: '/**',                     // allow any path under this host
      },
      {
        protocol: 'https',                   // only https
        hostname: 'placehold.co',
        port: '',                            // default port
        pathname: '/**',                     // allow any path under this host
      },

    ],
  },
};

export default nextConfig;
