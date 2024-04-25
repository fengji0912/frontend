/* eslint-disable @typescript-eslint/no-var-requires */

const { version } = require('./package.json');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const cspHeader = `
    default-src 'self'
      https://orkg.org
      https://*.orkg.org
      https://*.ngrok-free.app
      https://support.tib.eu
    ;
    script-src 'self' 'unsafe-eval' 'unsafe-inline'
      https://support.tib.eu
    ;
    frame-src 'self' 
      https://docs.google.com
      https://support.tib.eu
    ;
    img-src 'self' blob: data:
      https://gravatar.com
    ;
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
  output: 'standalone', // for deployment with docker
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  env: {
    version, // ensure the version is available for display in the footer
  },
  swcMinify: false, // disable SWC minification to avoid issues with @citation-js, which doesn't work when running nextjs build
};

module.exports = withBundleAnalyzer(nextConfig);
