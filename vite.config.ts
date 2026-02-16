import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      router: {
        routesDirectory: '',
        virtualRouteConfig: './src/routes.ts',
      },
    }),
    nitro(),
    tailwindcss(),
    react(),
  ],
  build: {
    sourcemap: true,
  },
});
