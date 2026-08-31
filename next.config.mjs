/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits a self-contained server bundle so the Docker image doesn't need
  // node_modules — keeps the Fly image small.
  output: 'standalone',
  // better-sqlite3 is a native addon; it must stay external to the bundle.
  serverExternalPackages: ['better-sqlite3'],

  /* `next dev` and `next build` both write to .next, so running a build while
     the dev server is up replaces the dev chunk graph underneath it and the
     browser then dies with "__webpack_modules__[moduleId] is not a function".
     The only cure once it happens is stopping everything, deleting .next and
     starting over.
     Setting NEXT_DIST_DIR sends a build somewhere else instead. `npm run
     build:check` uses it, which is what to run when you just want to know
     whether the project still compiles. */
  distDir: process.env.NEXT_DIST_DIR || '.next',

  /* Single-threaded build, only when NEXT_BUILD_SINGLE_THREAD is set.
   *
   * Cross-building the linux/amd64 image on an Apple Silicon machine runs the
   * whole toolchain under QEMU, and Next's parallel build workers segfault
   * there: "qemu: uncaught target signal 11" followed by "build worker exited
   * with signal SIGSEGV". Emulated atomics across worker threads are the usual
   * culprit and there is nothing to fix in our own code.
   *
   * One worker is slower but survives. The flag is opt-in so local and native
   * builds keep using every core; the Dockerfile sets it. Remove this once
   * images are built on a native amd64 runner, where it is pure cost.
   */
  ...(process.env.NEXT_BUILD_SINGLE_THREAD
    ? { experimental: { cpus: 1, workerThreads: false } }
    : {}),
}
export default nextConfig
