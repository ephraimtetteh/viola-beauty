import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      jpg: {
        quality: 70,
      },
      jpeg: {
        quality: 70,
      },
    }),
  ],
  base: "/",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000", // ✅ your backend port
        changeOrigin: true,
      },
    },
  },
});
