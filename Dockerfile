# Alpine is pinned so the same source produces the same base layer over time.
ARG ALPINE_VERSION=3.24

# Full dependency tree. Kept in its own stage so editing source does not
# re-install. --ignore-scripts: skips husky (postinstall, a devDependency) and
# the optional native modules (bufferutil, utf-8-validate, keccak), which have
# no toolchain here and are not needed at runtime.
FROM node:24-alpine${ALPINE_VERSION} AS deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts && yarn cache clean

# Production-only tree for the final image. Independent of `deps` (it needs the
# manifests only) so BuildKit builds both installs in parallel.
FROM node:24-alpine${ALPINE_VERSION} AS prod-deps

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts --production && yarn cache clean

FROM node:24-alpine${ALPINE_VERSION} AS build

# Passed by the Harbor build workflow; empty elsewhere, which leaves the
# REPLACE_WITH_* placeholders in build-info.json untouched.
ARG BUILD_VERSION=
ARG BUILD_BRANCH=
ARG BUILD_COMMIT=

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN if [ -n "$BUILD_VERSION" ]; then sed -i "s|REPLACE_WITH_VERSION|$BUILD_VERSION|" build-info.json; fi \
  && if [ -n "$BUILD_BRANCH" ]; then sed -i "s|REPLACE_WITH_BRANCH|$BUILD_BRANCH|" build-info.json; fi \
  && if [ -n "$BUILD_COMMIT" ]; then sed -i "s|REPLACE_WITH_COMMIT|$BUILD_COMMIT|" build-info.json; fi

# .next/cache is the webpack build cache, not needed at runtime
RUN NODE_NO_BUILD_DYNAMICS=true yarn build && rm -rf /app/.next/cache

# final image
FROM node:24-alpine${ALPINE_VERSION} AS base

ARG BASE_PATH=""
ARG SUPPORTED_CHAINS="1"
ARG DEFAULT_CHAIN="1"

ENV NEXT_TELEMETRY_DISABLED=1 \
  BASE_PATH=$BASE_PATH \
  SUPPORTED_CHAINS=$SUPPORTED_CHAINS \
  DEFAULT_CHAIN=$DEFAULT_CHAIN

WORKDIR /app

# Production dependencies only — devDependencies never reach the final image.
COPY --from=prod-deps /app/node_modules ./node_modules
# node must own .next: ISR revalidation writes back into .next/server/pages
# wherever the root filesystem is writable (the docker/compose deploys)
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/build-info.json ./build-info.json
# Runtime entrypoints: `yarn start` needs package.json, and next.config.mjs is
# re-evaluated by the custom server, pulling in scripts/, config/security-headers
# and env-dynamics; next-logger.config.cjs is preloaded by `yarn start`.
COPY --from=build /app/package.json /app/server.mjs /app/next.config.mjs /app/env-dynamics.mjs /app/next-logger.config.cjs ./
COPY --from=build /app/scripts/*.mjs ./scripts/
COPY --from=build /app/scripts/startup-checks ./scripts/startup-checks
COPY --from=build /app/scripts/utils ./scripts/utils
COPY --from=build /app/config/security-headers/*.js ./config/security-headers/
COPY --from=build /app/utilsApi/clamp-log-args.cjs ./utilsApi/clamp-log-args.cjs

# public/runtime is where startup injects runtime env vars; the k8s chart mounts
# an emptyDir here, so the rest of the root filesystem can stay read-only
RUN rm -rf /app/public/runtime && mkdir /app/public/runtime && chown node /app/public/runtime

USER node

EXPOSE 3000

# busybox wget, so no extra apk package floats against the Alpine repos
HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget -nv -t1 --spider http://localhost:3000/api/health || exit 1

CMD ["yarn", "start"]
