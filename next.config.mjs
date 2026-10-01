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
};

export default nextConfig;
