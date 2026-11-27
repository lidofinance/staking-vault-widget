ARG DHI_NODE_IMAGE=docker.io/lidofinance/dhi-node
ARG NODE_VERSION=24.22.3
ARG ALPINE_VERSION=3.24

ARG DHI_DEV_DIGEST=sha256:665a173e7d07f3707c68311c6722c91a4524eb7ffd09fe8f400f62fa12d81fd8
ARG DHI_RUNTIME_DIGEST=sha256:4544851709621aa77a18134101ef4cd6af39233cf57bdfe2adcc17e2e72866db

# Full dependency tree. Kept in its own stage so editing source does not
# re-install. --ignore-scripts: skips husky (postinstall, a devDependency) and
# the optional native modules (bufferutil, utf-8-validate, keccak), which
# are not needed at runtime.
FROM ${DHI_NODE_IMAGE}:${NODE_VERSION}-alpine${ALPINE_VERSION}-dev@${DHI_DEV_DIGEST} AS deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts && yarn cache clean

# Production-only tree for the final image. Independent of `deps` (it needs the
# manifests only) so BuildKit builds both installs in parallel.
FROM ${DHI_NODE_IMAGE}:${NODE_VERSION}-alpine${ALPINE_VERSION}-dev@${DHI_DEV_DIGEST} AS prod-deps

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts --production && yarn cache clean

# Application build. Use DHI dev because the build requires a shell and Yarn.
FROM ${DHI_NODE_IMAGE}:${NODE_VERSION}-alpine${ALPINE_VERSION}-dev@${DHI_DEV_DIGEST} AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# .next/cache is the webpack build cache, not needed at runtime
RUN NODE_NO_BUILD_DYNAMICS=true yarn build && rm -rf /app/.next/cache

# Minimal DHI runtime image
FROM ${DHI_NODE_IMAGE}:${NODE_VERSION}-alpine${ALPINE_VERSION}@${DHI_RUNTIME_DIGEST} AS base

ARG BASE_PATH=""
ARG SUPPORTED_CHAINS="1"
ARG DEFAULT_CHAIN="1"

ENV NODE_ENV=production \
    RUN_STARTUP_CHECKS=true \
    NEXT_TELEMETRY_DISABLED=1 \
    BASE_PATH=$BASE_PATH \
    SUPPORTED_CHAINS=$SUPPORTED_CHAINS \
    DEFAULT_CHAIN=$DEFAULT_CHAIN

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
# node must own .next: ISR revalidation writes back into .next/server/pages
# wherever the root filesystem is writable (the docker/compose deploys)
COPY --from=build --chown=1000:1000 /app/.next ./.next
# public/runtime/window-env.js is generated at application startup.
# Keep it writable for UID 1000 on deployments without the K8s emptyDir mount.
COPY --from=build --chown=1000:1000 /app/public ./public
COPY --from=build /app/build-info.json ./build-info.json
# Runtime entrypoints: next.config.mjs is re-evaluated by the custom server,
# pulling in scripts/ and env-dynamics; server.mjs builds CSP from
# config/security-headers; next-logger.config.cjs is preloaded by Node.js.
COPY --from=build /app/package.json /app/server.mjs /app/next.config.mjs /app/env-dynamics.mjs /app/next-logger.config.cjs ./
COPY --from=build /app/scripts/*.mjs ./scripts/
COPY --from=build /app/scripts/startup-checks ./scripts/startup-checks
COPY --from=build /app/scripts/utils ./scripts/utils
COPY --from=build /app/config/security-headers/*.js ./config/security-headers/
COPY --from=build /app/utilsApi/clamp-log-args.cjs ./utilsApi/clamp-log-args.cjs

EXPOSE 3000

# DHI runtime has no shell or wget
# Keep for compatibility with legacy infrastructure
# Remove after full K8s migration, as Kubernetes uses its own health probes.
HEALTHCHECK --interval=10s --timeout=3s \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || '3000') + '/api/health', { signal: AbortSignal.timeout(2500) }).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

# DHI runtime already runs as non-root (UID/GID 1000:1000).
CMD ["node", "-r", "next-logger", "--no-warnings=ExperimentalWarning", "server.mjs"]
