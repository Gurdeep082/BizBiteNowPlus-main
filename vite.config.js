/* global process */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  // Load env (Sirf proxy target ke liye chahiye ab)
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL;
  const proxyTarget = apiUrl ? new URL(apiUrl).origin : "";

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",

        // 🔴 MAGIC FIX: Vite ko bolo manifest generate na kare.
        // Hum index.html aur Express backend se dynamically serve kar rahe hain.
        manifest: false,

        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,woff2}"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          navigateFallbackDenylist: [/^\/api/, /^\/firebase-messaging-sw\.js$/],
        },
      }),
    ],

    server: {
      host: "0.0.0.0",
      strictPort: true,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },

    build: {
      chunkSizeWarningLimit: 3000,
    },
  };
});
