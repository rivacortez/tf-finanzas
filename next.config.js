/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add transpilePackages to handle Supabase node-fetch issues with Turbopack
  transpilePackages: [
    '@supabase/ssr',
    '@supabase/supabase-js',
    '@supabase/auth-helpers-nextjs',
    '@supabase/node-fetch'
  ],
  images: {
    domains: [
      'mdxtbxurdevffwbhsezm.supabase.co',
    
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.fischer.group',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mdxtbxurdevffwbhsezm.supabase.co',
        port: '',
        pathname: '/**',
      },
      
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig