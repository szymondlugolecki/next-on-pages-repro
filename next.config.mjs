import bundleFunc from '@next/bundle-analyzer';
import nextSafe from 'next-safe';

const isDev = process.env.NODE_ENV !== 'production';

const withBundleAnalyzer = bundleFunc({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: nextSafe({
          isDev,
          contentSecurityPolicy: {
            'prefetch-src': false,
            'connect-src': "'self' http://localhost:1337",
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
});
