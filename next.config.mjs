import bundleFunc from '@next/bundle-analyzer';
import nextSafe from 'next-safe';

const isDev = process.env.NODE_ENV !== 'production';

const withBundleAnalyzer = bundleFunc({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('next').NextConfig}
 **/

export default withBundleAnalyzer({
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: nextSafe({
          isDev,
          contentSecurityPolicy: {
            'prefetch-src': false, // securetoken.googleapis.com identitytoolkit.googleapis.com
            'connect-src': "'self' localhost:3000 localhost:8787 geogenius-1c608.firebaseapp.com identitytoolkit.googleapis.com googleapis.com securetoken.googleapis.com apis.google.com",
            'script-src': "'self' apis.google.com geogenius-1c608.firebaseapp.com",
            'frame-src': "'self' geogenius-1c608.firebaseapp.com",
            'img-src': "'self' lh3.googleusercontent.com",
            'default-src': "'self' localhost:3000 localhost:8787"
          },
        }),
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/play',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['countryflagsapi.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    runtime: "experimental-edge"
  }
});
