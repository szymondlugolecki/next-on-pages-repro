import bundleFunc from '@next/bundle-analyzer';

// const isDev = process.env.NODE_ENV !== 'production';

const withBundleAnalyzer = bundleFunc({
  enabled: process.env.ANALYZE === 'true',
});

// nextSafe({
//   isDev,
//   contentSecurityPolicy: {
//     'prefetch-src': false, // securetoken.googleapis.com identitytoolkit.googleapis.com
//     'connect-src':
//       "'self' localhost:3000 localhost:8787 geogenius-1c608.firebaseapp.com identitytoolkit.googleapis.com googleapis.com securetoken.googleapis.com apis.google.com",
//     'script-src': "'self' apis.google.com geogenius-1c608.firebaseapp.com",
//     'frame-src': "'self' geogenius-1c608.firebaseapp.com",
//     'img-src': "'self' lh3.googleusercontent.com countryflagsapi.com",
//     'default-src': "'self' localhost:3000 localhost:8787",
//   },
// }),

/**
 * @type {import('next').NextConfig}
 **/

const ContentSecurityPolicy = `
 default-src 'self' localhost:3000 localhost:8787 http://localhost:3000;
 script-src 'self' http://localhost:3000 localhost:3000;
 img-src 'self' lh3.googleusercontent.com countryflagsapi.com;
 style-src 'self' http://localhost:3000 localhost:3000;
 font-src 'self';  
 connect-src 'self' localhost:3000 localhost:8787
`;

export default withBundleAnalyzer({
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // {
          //   key: 'Content-Security-Policy',
          //   value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          // },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
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
    runtime: 'experimental-edge',
  },
});
