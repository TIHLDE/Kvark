import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://photon.tihlde.org/openapi',
  output: {
    path: 'src/client',
    format: 'prettier',
    lint: 'eslint',
  },
  plugins: [
    '@tanstack/react-query',
    {
      dates: true,
      name: '@hey-api/transformers',
    },
  ],
});
