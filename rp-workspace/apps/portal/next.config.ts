import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimización de producción
  productionBrowserSourceMaps: false, // Deshabilitar source maps en producción para reducir tamaño
  
  // Compresión
  compress: true,
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Optimización de bundles con Turbopack
  experimental: {
    optimizeCss: true, // Optimizar CSS
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-avatar',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      'lucide-react',
      'framer-motion',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      '@dnd-kit/utilities',
      '@tanstack/react-query',
      'date-fns',
    ],
  },
  
  // Configuración de Turbopack (Next.js 16+)
  turbopack: {
    // Turbopack optimiza automáticamente, pero podemos configurar
    resolveAlias: {},
  },
  
  // Headers de seguridad y performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
  
  // Output configuration
  output: 'standalone', // Para mejor optimización en Docker
  
  // React strict mode
  reactStrictMode: true,
  
  // PoweredByHeader removido por defecto en producción
  poweredByHeader: false,
};

export default nextConfig;
