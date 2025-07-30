import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      external: [
        'fs',
        'path',
        'os',
        'crypto',
        'child_process',
        'util',
        'events',
        'stream',
        'url',
        'assert',
        'sqlite3',
        'sqlite',
        'bcrypt'
      ]
    }
  },
  optimizeDeps: {
    exclude: [
      'sqlite3',
      'sqlite',
      'bcrypt',
      '@mapbox/node-pre-gyp'
    ]
  },
  define: {
    global: 'globalThis'
  }
});
