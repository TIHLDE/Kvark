import type { StorybookConfig } from '@storybook/react-vite';

/**
 * Storybook configuration
 * This configuration ensures that:
 * - All MDX documentation files are included
 * - All stories for components in /src/components are included
 * - All other stories throughout the src directory are included
 */
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
    "@storybook/addon-styling"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "staticDirs": ["../public"]
};
export default config;