if [ -n "$POSTHOG_CLI_ENV_ID" ] && [ -n "$POSTHOG_CLI_TOKEN" ]; then
  pnpm posthog-cli sourcemap inject --directory ./build
  pnpm posthog-cli upload --directory ./build
fi
