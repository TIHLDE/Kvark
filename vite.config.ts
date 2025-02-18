import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command, mode }) => {
  loadEnv(mode, 'env');
  return {
    ssr: {
      noExternal: command === 'build' ? true : undefined,
    },

    plugins: [reactRouter(), tsconfigPaths()],
  };
});
