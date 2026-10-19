/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/og-image.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { 
        source: '/api/:path*', 
        destination: 'https://otopadang-api.vercel.app/api/:path*' 
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'pasagadang-web.vercel.app' }],
        destination: 'https://pasagadang.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.pasagadang.com' }],
        destination: 'https://pasagadang.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
