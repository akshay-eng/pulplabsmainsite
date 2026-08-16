/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is a native addon; it must stay external to the bundle.
  serverExternalPackages: ['better-sqlite3'],
}
export default nextConfig
