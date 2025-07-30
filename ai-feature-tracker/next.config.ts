// Load development environment if needed
if (process.env.NODE_ENV !== 'production') {
  try {
    require('./env.development.js');
    console.log('✅ Development environment variables loaded');
  } catch (error) {
    console.log(
      '⚠️ Development environment file not found, using process.env values'
    );
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Server external packages
  serverExternalPackages: ['@anthropic-ai/sdk'],

  // Experimental features for Next.js 15
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      '@supabase/supabase-js',
      'lucide-react',
      'date-fns',
    ],
  },

  // Image optimization configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: [
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      // Add your Supabase storage domain when configured
      // 'your-project.supabase.co'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.anthropic.com https://*.supabase.co wss://*.supabase.co",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Bundle analyzer (only in development)
  ...(process.env['ANALYZE'] === 'true' && {
    webpack: (config: any, { isServer }: { isServer: boolean }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
          })
        );
      }
      return config;
    },
  }),

  // Webpack configuration for optimal bundling
  webpack: (
    config: any,
    { dev, isServer }: { dev: boolean; isServer: boolean }
  ) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'supabase',
              chunks: 'all',
            },
            anthropic: {
              test: /[\\/]node_modules[\\/]@anthropic[\\/]/,
              name: 'anthropic',
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  },

  // Output configuration
  output: 'standalone',

  // Compression
  compress: true,

  // Generate build ID for caching
  generateBuildId: async () => {
    return process.env['BUILD_ID'] || `build-${Date.now()}`;
  },

  // Environment variables to expose to the client
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};

module.exports = nextConfig;
