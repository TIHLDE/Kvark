import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.{js,ts,jsx,tsx}'],
  ignores: ['**/dist/**', '**/node_modules/**', '**/src/components/ui/**/*', '**/src/lib/utils.ts', '**/src/routeTree.gen.ts', '**/src/client/**'],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    eslintConfigPrettier,
    pluginReact.configs.flat['jsx-runtime'],
    reactHooks.configs['recommended-latest'],
  ],
  languageOptions: {
    globals: globals.browser,
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    // React Rules
    'react/prop-types': 'off', // Remove this in the future
    'react-hooks/rules-of-hooks': 'error',
    // Built-in Rules
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'guard-for-in': 'off',
    'no-console': 'warn',
    'no-empty-function': [
      'error',
      {
        allow: ['arrowFunctions'],
      },
    ],
    'no-implicit-coercion': 'error',
    'no-invalid-this': 'off',
    'no-lonely-if': 'error',
    'no-unneeded-ternary': 'error',
    'no-useless-computed-key': 'off',
    'no-useless-return': 'error',

    // From @tanstack/config Should be enabled in the future

    /** Enforce import type { T } */
    // '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    /** Warn about variable with identical names in the outer scope */
    // 'no-shadow': 'warn',
    /** Checks if the the explicit type is identical to the inferred type */
    // '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  },
});
