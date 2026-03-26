import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les grosses librairies en chunks distincts
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['redux', 'react-redux', '@reduxjs/toolkit'],
          'vendor-ui': ['axios', 'framer-motion'], // adapte selon tes dépendances
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
});