# syntax=docker/dockerfile:1

# ---- deps ----------------------------------------------------------------
# better-sqlite3 is a native addon, so the build stage needs a toolchain.
FROM node:22-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ---------------------------------------------------------------
FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# generateStaticParams reads the DB at build time. The real volume isn't
# mounted yet, so point at a throwaway file — pages revalidate at runtime.
ENV DATABASE_PATH=/tmp/build.db
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runtime -------------------------------------------------------------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Persistent volume mount point — see fly.toml
ENV DATABASE_PATH=/data/pulplabs.db

RUN groupadd -r app && useradd -r -g app app

# `output: standalone` emits a self-contained server plus only the node_modules
# it actually needs, which keeps the image small.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# The seed script runs against the mounted volume on first boot.
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=build /app/node_modules/bindings ./node_modules/bindings
COPY --from=build /app/node_modules/file-uri-to-path ./node_modules/file-uri-to-path
COPY --from=build /app/node_modules/bcryptjs ./node_modules/bcryptjs

RUN mkdir -p /data && chown -R app:app /data /app
USER app

EXPOSE 3000
CMD ["node", "server.js"]
