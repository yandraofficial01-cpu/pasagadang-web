/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
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
        source: '/:path*',
        has: [{ type: 'host', value: 'pasagadang-web.vercel.app' }],
        destination: 'https://pasagadang.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
