import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackRouter({
      target: 'react',
      virtualRouteConfig: './src/routes.ts',
      routesDirectory: './src',
    }),
    react(),
  ],
  build: {
    sourcemap: true,
  },
});
