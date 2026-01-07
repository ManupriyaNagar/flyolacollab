const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // DISABLED - incompatible with dynamic routes for admin dashboard
  // Static export is incompatible with dynamic routes like /edit/[id]
  // If you need static export for production, consider separating admin and public sites

  // Performance optimizations
  reactStrictMode: true,
  compress: true,  // Enable gzip compression

  images: {
    unoptimized: true, // Re-enabled image optimization
    domains: ['images.unsplash.com', 'flyola.in'],
    formats: ['image/webp'],
  },

  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Static export optimizations
  trailingSlash: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false, // Reduce bundle size

  // Optimize package imports
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'react-icons', 'lodash'],
  },

  // Webpack optimizations for static export
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce bundle size
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Optimize chunks
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            }
          }
        }
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
