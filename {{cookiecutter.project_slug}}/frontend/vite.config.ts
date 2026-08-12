import path from "path";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProd = mode === "production";

  return {
    base: env.VITE_CDN_URL || "/",

    define: {
      "process.env.VITE_BACKEND_URL": JSON.stringify(
        env.VITE_BACKEND_URL || "",
      ),
      // Strip __DEV__ branches in production for smaller bundles
      "process.env.NODE_ENV": JSON.stringify(mode),
    },

    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "masked-icon.svg",
        ],
        workbox: {
          // Cache strategy: cache-first for hashed assets (immutable), network-first for HTML
          runtimeCaching: [
            {
              // Hashed JS/CSS chunks → cache-first (immutable, 1-year TTL)
              urlPattern: /\/assets\/.*\.(js|css)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "static-assets-v1",
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Images → cache-first, shorter TTL
              urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache-v1",
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // Google Fonts → stale-while-revalidate
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "google-fonts-v1",
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
          // Skip waiting & claim immediately so updates are live on next navigation
          skipWaiting: true,
          clientsClaim: true,
          globIgnores: ["**/*.map", "**/registerSW.js"],
        },
        manifest: {
          id: "/",
          name: "{{ cookiecutter.project_name }}",
          short_name: "{{ cookiecutter.project_name }}",
          description: "{{ cookiecutter.description }}",
          theme_color: "#0f172a",
          background_color: "#0f172a",
          display: "standalone",
          display_override: [
            "window-controls-overlay",
            "standalone",
            "minimal-ui",
          ],
          orientation: "portrait",
          scope: "/",
          start_url: "/",
          categories: ["business", "productivity"],
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      host: true,
      port: 3000,
    },

    build: {
      // Target modern evergreen browsers — smaller output, no legacy polyfills
      target: "ES2022",

      // Terser in production: deeper minification, drops console/debugger
      minify: isProd ? "terser" : "esbuild",
      terserOptions: isProd
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
              dead_code: true,
              collapse_vars: true,
              reduce_vars: true,
              passes: 2,
            },
            mangle: {
              toplevel: false,
            },
            format: {
              comments: false,
            },
          }
        : undefined,

      // Split CSS per-chunk so pages only load styles they use
      cssCodeSplit: true,

      // Inline assets ≤ 4 kB as base64 (avoids extra HTTP round-trips for tiny assets)
      assetsInlineThreshold: 4096,

      sourcemap: false,

      // Warn when any individual output chunk exceeds 300 kB
      chunkSizeWarningLimit: 300,

      rollupOptions: {
        output: {
          // ── Manual chunk splitting strategy ───────────────────────────────
          // Split by "how often does this change" — framework core almost never
          // changes, AWS SDK changes rarely, UI components occasionally, pages
          // frequently. Each layer gets its own long-term cached chunk.
          // ─────────────────────────────────────────────────────────────────
          manualChunks(id) {
            // 1. React core (smallest, most shared, most cacheable)
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/scheduler/")
            ) {
              return "vendor-react";
            }

            // 2. React Router
            if (id.includes("node_modules/react-router")) {
              return "vendor-router";
            }

            // 3. TanStack Query
            if (id.includes("node_modules/@tanstack/")) {
              return "vendor-query";
            }

            // 4. AWS Amplify (largest vendor, infrequent updates)
            if (id.includes("node_modules/aws-amplify") || id.includes("node_modules/@aws-")) {
              return "vendor-aws";
            }

            // 5. Axios
            if (id.includes("node_modules/axios") || id.includes("node_modules/proxy-from-env")) {
              return "vendor-http";
            }

            // 6. Radix UI primitives
            if (id.includes("node_modules/@radix-ui/")) {
              return "vendor-radix";
            }

            // 7. Lucide icons (tree-shaken, grouped for caching)
            if (id.includes("node_modules/lucide-react")) {
              return "vendor-icons";
            }

            // 8. Sonner toast
            if (id.includes("node_modules/sonner")) {
              return "vendor-sonner";
            }

            // 9. Theme + state (next-themes, zustand)
            if (
              id.includes("node_modules/next-themes") ||
              id.includes("node_modules/zustand")
            ) {
              return "vendor-state";
            }

            // 10. Utility libraries (clsx, class-variance-authority, tailwind-merge)
            if (
              id.includes("node_modules/clsx") ||
              id.includes("node_modules/class-variance-authority") ||
              id.includes("node_modules/tailwind-merge")
            ) {
              return "vendor-utils";
            }

            // 11. shadcn/ui components
            if (id.includes("/src/components/ui/")) {
              return "app-ui";
            }

            // 12. Shared lib code (api clients, hooks, stores)
            if (id.includes("/src/lib/") || id.includes("/src/hooks/") || id.includes("/src/stores/")) {
              return "app-shared";
            }

            // 13. Shared non-page components
            if (
              id.includes("/src/components/") &&
              !id.includes("/src/components/ui/")
            ) {
              return "app-components";
            }

            // Pages fall through → dynamic chunks from lazy() imports in AppRoutes ✅
          },

          // Content-hashed filenames for long-term caching
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            if (/\.(woff2?|ttf|otf|eot)$/.test(assetInfo.name ?? "")) {
              return "fonts/[name]-[hash][extname]";
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name ?? "")) {
              return "img/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },

        treeshake: {
          preset: "recommended",
          moduleSideEffects: (id) => {
            if (id.endsWith(".css")) return true;
            return false;
          },
        },
      },

      copyPublicDir: true,
    },

    esbuild: {
      target: "ES2022",
    },

    // Optimise dependency pre-bundling in dev for faster HMR
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "axios",
        "zustand",
        "clsx",
        "tailwind-merge",
        "class-variance-authority",
      ],
      exclude: ["@tailwindcss/vite"],
    },
  };
});
