if [ -n "$POSTHOG_CLI_ENV_ID" ] && [ -n "$POSTHOG_CLI_TOKEN" ]; then
  pnpm posthog-cli --host https://eu.posthog.com sourcemap inject --directory ./build
  pnpm posthog-cli --host https://eu.posthog.com sourcemap upload --directory ./build
fi
