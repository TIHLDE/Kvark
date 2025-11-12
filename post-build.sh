if [ -n "$POSTHOG_CLI_ENV_ID" ] && [ -n "$POSTHOG_CLI_TOKEN" ]; then
  pnpm dlx @posthog/cli --host https://eu.posthog.com sourcemap inject --directory ./.output
  pnpm dlx @posthog/cli --host https://eu.posthog.com sourcemap upload --directory ./.output
fi
