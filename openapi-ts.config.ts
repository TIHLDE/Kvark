import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'https://photon.tihlde.org/openapi',
  output: {
    path: 'src/gen-client',
    format: 'prettier',
    lint: 'eslint',
  },
  plugins: [
    {
      dates: true,
      name: '@hey-api/transformers',
    },
    '@hey-api/sdk',
  ],
});
