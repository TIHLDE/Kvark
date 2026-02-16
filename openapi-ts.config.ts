import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:4000/openapi',
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
    { name: '@hey-api/sdk', transformer: true },
    {
      name: '@hey-api/client-fetch',
      throwOnError: true,
    },
  ],
});
