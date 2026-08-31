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
# mounted yet, so point at a throwaway file. Pages revalidate at runtime.
ENV DATABASE_PATH=/tmp/build.db
ENV NEXT_TELEMETRY_DISABLED=1

# See next.config.mjs. Next's parallel build workers segfault under the QEMU
# emulation used to cross-build linux/amd64 from an arm64 host.
ENV NEXT_BUILD_SINGLE_THREAD=1
# The emulated build is memory-hungry and the default heap gets it OOM-killed
# partway through page collection.
ENV NODE_OPTIONS=--max-old-space-size=4096

# NEXT_PUBLIC_* is substituted into the client bundle by the compiler, so these
# have to arrive here as build arguments. Setting them as environment variables
# on the Deployment does nothing at all: the strings are already baked into the
# JavaScript the browser downloads. Change either one and you need a new image.
#
# NEXT_PUBLIC_WHATSAPP in particular decides whether the phone CTA deep-links
# into WhatsApp or falls back to /contact, and StartCta degrades to a plain
# link when it is empty, so a forgotten build arg fails quietly rather than
# loudly. Check the rendered href after any rebuild.
ARG NEXT_PUBLIC_SITE_URL=https://pulplabs.ai
ARG NEXT_PUBLIC_WHATSAPP=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_WHATSAPP=$NEXT_PUBLIC_WHATSAPP

RUN npm run build

# ---- runtime -------------------------------------------------------------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Both of these live on the PersistentVolumeClaim. public/ is baked into the
# image at build time, so uploads cannot go there: the layer is read-only and
# would be discarded on the next deploy regardless.
ENV DATABASE_PATH=/data/pulplabs.db
ENV UPLOAD_DIR=/data/uploads

# Fixed numeric ids. The Deployment sets runAsUser/fsGroup to the same numbers
# so the mounted volume is writable; a name-only user leaves Kubernetes
# guessing and the first write to /data fails with EACCES.
RUN groupadd -r -g 10001 app && useradd -r -u 10001 -g app app

# `output: standalone` emits a self-contained server plus only the node_modules
# it actually needs, which keeps the image small.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# The seed script runs against the mounted volume on first boot.
COPY --from=build /app/scripts ./scripts
# better-sqlite3 is external to the standalone bundle (see next.config.mjs), so
# it has to be copied in by hand along with its compiled .node binary.
#
# `bindings` and `file-uri-to-path` used to be copied here too. They were
# transitive dependencies of better-sqlite3 v7, and v13 resolves its binary
# directly: the packages are simply not installed any more, so those two lines
# failed the build with "not found" rather than being harmlessly redundant.
# Runtime requires are now only fs, path and util.
COPY --from=build /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
# Needed by scripts/seed.mjs, which the seed Job runs outside the traced bundle.
COPY --from=build /app/node_modules/bcryptjs ./node_modules/bcryptjs

RUN mkdir -p /data && chown -R app:app /data /app
USER app

EXPOSE 3000

# No shell form, so signals reach Node directly and the pod stops on the first
# SIGTERM rather than waiting out terminationGracePeriodSeconds.
CMD ["node", "server.js"]
