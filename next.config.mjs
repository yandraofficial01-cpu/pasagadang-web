/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { 
        source: '/api/:path*', 
        destination: 'https://otopadang-api.vercel.app/:path*' // GANTI KALAU URL BE LU BEDA
      }
    ]
  },
};

export default nextConfig;
