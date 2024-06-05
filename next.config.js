/* eslint-disable @typescript-eslint/no-var-requires */

const { version } = require('./package.json');
const createNextIntlPlugin = require('next-intl/plugin');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin();

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
  // webpack config required for building only, once turbo supports building (and turbo is actually activated), this can be removed
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/i,
      loader: 'raw-loader',
    });
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['citeproc'], // @citation-js doesn't work with SWC minification, so await Cite.async(items).format won't work. This is a workaround
  },

  // turbopack is disabled for now as it caused issues with nextjs button on server components,
  // a solution might be to import components as individual ones instead of from the main nextjs package
  // experimental: {
  //   turbo: {
  //     rules: {
  //       '*.md': {
  //         loaders: ['raw-loader'],
  //       },
  //     },
  //   },
  // },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
