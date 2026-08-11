/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emits a self-contained server bundle so the Docker image doesn't need
  // node_modules — keeps the Fly image small.
  output: 'standalone',
  // better-sqlite3 is a native addon; it must stay external to the bundle.
  serverExternalPackages: ['better-sqlite3'],
}
export default nextConfig
