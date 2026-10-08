FROM node:24-slim AS builder
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# Vite inlines VITE_* at build time, so they have to be present here, not at runtime.
ARG VITE_API_URL
ARG VITE_ENABLE_MOCKS
ENV NODE_ENV=production
RUN pnpm build

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Nitro bundles its own runtime dependencies into .output, so nothing else is needed.
COPY --from=builder /app/.output /app/.output

# Build metadata from the build pipeline; a local `docker build` gets "unknown".
ARG APP_VERSION=unknown
ARG GIT_SHA=unknown
ENV APP_VERSION=$APP_VERSION
ENV GIT_SHA=$GIT_SHA

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

USER node

CMD ["node", ".output/server/index.mjs"]
