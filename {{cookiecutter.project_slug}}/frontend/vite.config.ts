import path from "path";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.VITE_CDN_URL || "/",
    define: {
      "process.env.VITE_BACKEND_URL": JSON.stringify(
        env.VITE_BACKEND_URL || "",
      ),
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
      target: "ES2020",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-aws": ["aws-amplify"],
            "vendor-ui": ["lucide-react", "sonner"],
          },
        },
      },
    },
    esbuild: {
      target: "ES2020",
    },
  };
});
