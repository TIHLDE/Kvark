import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'env');

  /**
   * Custom plugin used to support using env-variables in `.html`-files like index.html
   * How to use: `%VITE_ENV_VARIABLE%`
   */
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html: string) {
        return html.replace(/%(.*?)%/g, function (match, p1) {
          return env[p1];
        });
      },
    };
  };

  return {
    build: {
      outDir: 'build',
      assetsDir: 'static',
      rollupOptions: {
        output: {
          manualChunks: {
            mui: ['@mui/material', '@mui/lab'],
            calendar: ['@devexpress/dx-react-core', '@devexpress/dx-react-scheduler', '@devexpress/dx-react-scheduler-material-ui'],
            dates: ['moment', 'rrule', 'luxon'],
          },
          entryFileNames: `static/js/[name].[hash].js`,
          chunkFileNames: `static/js/[name].[hash].js`,
          assetFileNames: ({ name }) => {
            if (name && name.endsWith('.css')) {
              return 'static/css/[name].[hash].[ext]';
            }

            return 'static/media/[name].[hash].[ext]';
          },
        },
      },
    },
    /**
     * htmlPlugin -> Use env-variables in `.html`-files
     * react -> Enables fast refresh on save and jsx-syntax
     * svgr -> Allows import of SVG-files as React-components
     * tsconfigPaths -> Adds support for absolute file import with Typescript
     * checker -> Checks that Typescript and ESLint has no errors/warnings
     * viteCompression -> Compresses files with brotli to minimize bundle size
     */
    plugins: [
      htmlPlugin(),
      react(),
      svgr(),
      tsconfigPaths(),
      checker({ typescript: true, eslint: { files: ['./src'], extensions: ['.tsx', '.ts'] } }),
      viteCompression({ algorithm: 'brotliCompress' }),
    ],
  };
});
