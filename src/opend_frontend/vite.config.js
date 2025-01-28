import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
    allowedHosts: [
      "3000-udemylearne-nftmarketpl-is2znqnzz3d.ws-us117.gitpod.io",
      "http://127.0.0.1:4943",
      "https://7gngh-jqaaa-aaaab-qacvq-cai.icp0.io/a1326d75-cf72-4cbf-ac6a-0386b9fc0b52",
      "https://4943-udemylearne-nftmarketpl-is2znqnzz3d.ws-us117.gitpod.io/"
    ]
  },
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
      },
    ],
    dedupe: ['@dfinity/agent'],
  },
});
