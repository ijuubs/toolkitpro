import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const gaId = env.VITE_GA_MEASUREMENT_ID || process.env.VITE_GA_MEASUREMENT_ID || 'G-QR3WP8T7T6';

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'pwa-maskable-512x512.png'],
        manifest: {
          name: 'ToolKitPro - High-Performance Utility Ecosystem',
          short_name: 'ToolKitPro',
          description: '100% Client-Side Private Web Utilities, Tools, and Calculators',
          theme_color: '#facc15',
          background_color: '#f5f5f6',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          orientation: 'portrait-primary',
          start_url: '/',
          categories: ['productivity', 'utilities', 'finance', 'developer tools'],
          shortcuts: [
            {
              name: 'Word Counter',
              short_name: 'Words',
              description: 'Count words and characters in text',
              url: '/tools/word-counter',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'JSON Formatter',
              short_name: 'JSON',
              description: 'Format and validate JSON data',
              url: '/tools/json-formatter',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            },
            {
              name: 'Loan Calculator',
              short_name: 'Loan',
              description: 'Calculate loan repayments',
              url: '/tools/loan-calculator',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
            }
          ],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,xml,txt}'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/ads\.txt$/, /^\/llms\.txt$/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      }),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(/%VITE_GA_MEASUREMENT_ID%/g, gaId);
        }
      }
    ],
    define: {
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react/') || id.includes('react-dom/') || id.includes('scheduler')) {
                return 'vendor-react';
              }
              if (id.includes('react-router') || id.includes('react-helmet-async')) {
                return 'vendor-router';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
              if (id.includes('pdf-lib')) {
                return 'lib-pdf';
              }
              if (id.includes('browser-image-compression')) {
                return 'lib-image-compression';
              }
              if (id.includes('qrcode')) {
                return 'lib-qrcode';
              }
            }
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      port: 3000,
      host: '0.0.0.0',
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
