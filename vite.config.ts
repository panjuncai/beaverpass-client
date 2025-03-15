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
          "/products": {
            target: "http://localhost:3000",
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/products/, "/products"),
            configure: (proxy, _options) => {
              proxy.on('error', (err, _req, _res) => {
                console.log('proxy error', err);
              });
              proxy.on('proxyReq', (_, req, _res) => {
                console.log('Sending Request to the Target:', req.method, req.url);
              });
              proxy.on('proxyRes', (proxyRes, req, _res) => {
                console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
              });
            },
          },
        },
        hmr: { protocol: "ws" },
        watch: { usePolling: true, interval: 100 },
      }
    : undefined,
}));
