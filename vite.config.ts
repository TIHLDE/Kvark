import { defineConfig, loadEnv } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'env');

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
    plugins: [checker({ typescript: true, eslint: { files: ['./src'], extensions: ['.tsx', '.ts'] } }), htmlPlugin(), reactRefresh(), svgr(), tsconfigPaths()],
  };
});
