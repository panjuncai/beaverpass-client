import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "development", 
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  server: mode === "development"
    ? {
        proxy: {
          "/api": {
            target: "http://localhost:4001",
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ""),
          },
        },
        hmr: { protocol: "ws" },
        watch: { usePolling: true, interval: 100 },
      }
    : undefined,
}));
