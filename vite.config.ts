import { defineConfig, loadEnv } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

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
    },
    esbuild: {
      jsxInject: `import React from 'react'`,
    },
    /**
     * checker -> Checks that Typescript and ESLint has no errors/warnings
     * htmlPlugin -> Use env-variables in `.html`-files
     * reactRefresh -> Enables fast refresh on save
     * svgr -> Allows import of SVG-files as React-components
     * tsconfigPaths -> Adds support for absolute file import with Typescript
     */
    plugins: [checker({ typescript: true, eslint: { files: ['./src'], extensions: ['.tsx', '.ts'] } }), htmlPlugin(), reactRefresh(), svgr(), tsconfigPaths()],
  };
});
