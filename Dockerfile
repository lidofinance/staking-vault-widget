# syntax=docker/dockerfile:1.7  ← enables BuildKit‑only features such as cache mounts

###############################################################################
##  Dependency layer – cached aggressively
###############################################################################
FROM node:20-alpine AS deps
WORKDIR /app

# Install Git only when it is strictly required by the lock‑file
RUN apk add --no-cache --virtual .git-deps git

# Copy lock‑files *only* so that this layer is reused
COPY package.json yarn.lock ./

# Yarn cache is mounted, so repeated builds re‑use it instead of re‑downloading
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile --non-interactive --ignore-scripts

###############################################################################
## Build layer
###############################################################################
FROM node:20-alpine AS build
WORKDIR /app

# Re‑use the previously cached node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_NO_BUILD_DYNAMICS=1
RUN yarn build && rm -rf app/node_modules

# Writable runtime folder for dynamic env injection
RUN install -d -o node -g node /app/public/runtime

###############################################################################
## Production‑runtime image (smallest possible)
###############################################################################
FROM node:20-alpine AS runner

# ---- Runtime configuration --------------------------------------------------
ARG BASE_PATH=""
ARG SUPPORTED_CHAINS="1"
ARG DEFAULT_CHAIN="1"

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    BASE_PATH=$BASE_PATH \
    SUPPORTED_CHAINS=$SUPPORTED_CHAINS \
    DEFAULT_CHAIN=$DEFAULT_CHAIN

WORKDIR /app
RUN apk add --no-cache curl 

# ---- Copy only what the server really needs ---------------------------------
COPY --from=deps  /app/node_modules ./node_modules         
COPY --from=build /app  .



USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["yarn", "start"]
