import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // ─── CSS ────────────────────────────────────────────────────────────────
    // Injecter le CSS directement dans le JS évite les problèmes de chargement
    // asynchrone du fichier .css sur certains réseaux/CDN lents.
    // cssCodeSplit: false force un seul fichier CSS groupé avec le bundle.
    cssCodeSplit: false,

    // ─── Chunks ─────────────────────────────────────────────────────────────
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-redux": ["redux", "react-redux", "@reduxjs/toolkit"],
          "vendor-motion": ["framer-motion"],
          "vendor-http": ["axios"],
        },
      },
    },

    // ─── Taille ─────────────────────────────────────────────────────────────
    chunkSizeWarningLimit: 600,

    // ─── Sourcemaps ─────────────────────────────────────────────────────────
    // Désactivé en prod pour ne pas exposer le code source
    sourcemap: false,
  },

  // ─── Serveur de dev ─────────────────────────────────────────────────────
  server: {
    port: 5173,
    strictPort: false,
  },
});