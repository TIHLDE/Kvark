import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.{js,ts,jsx,tsx}'],
  ignores: ['**/dist/**', '**/node_modules/**', '**/src/components/ui/**/*', '**/src/lib/utils.ts'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    eslintConfigPrettier,
    pluginReact.configs.flat['jsx-runtime'],
    reactHooks.configs['recommended-latest'],
  ],
  languageOptions: {
    globals: globals.browser,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // 'import-helpers/order-imports': [
    //   'warn',
    //   {
    //     groups: [['absolute', 'module'], '/^types/', '/^api/', '/^hooks/', '/^pages/', '/^components/', '/^assets/', ['sibling', 'parent', 'index']],
    //     newlinesBetween: 'always',
    //     alphabetize: { order: 'asc', ignoreCase: true },
    //   },
    // ],
    'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off',
    'arrow-spacing': 'error',
    'block-spacing': ['error', 'never'],
    'brace-style': ['error', '1tbs'],
    'comma-spacing': 'error',
    'comma-style': ['error', 'last'],
    // curly: ['error', 'all'],
    'eol-last': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'func-call-spacing': 'error',
    'guard-for-in': 'off',
    // 'jsx-a11y/accessible-emoji': 'off',
    'keyword-spacing': 'error',
    'linebreak-style': 'off',
    'max-len': [
      'warn',
      {
        tabWidth: 2,
        code: 1000,
        comments: 160,
        ignoreComments: false,
        ignoreTrailingComments: false,
      },
    ],
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
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
      },
    ],
    'no-unneeded-ternary': 'error',
    'no-useless-computed-key': 'off',
    'no-useless-return': 'error',
    'no-whitespace-before-property': 'error',
    'quote-props': 'off',
    'react/react-in-jsx-scope': 'off',
    // 'react/jsx-sort-props': [
    //   'error',
    //   {
    //     noSortAlphabetically: false,
    //     ignoreCase: true,
    //   },
    // ],
    'react-hooks/rules-of-hooks': 'error',
    'react/prop-types': 'off',
    'require-jsdoc': 'off',
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never',
      },
    ],
  },
});
