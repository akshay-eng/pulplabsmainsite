/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is a native addon; it must stay external to the bundle.
  serverExternalPackages: ['better-sqlite3'],

  /* The catalogue used to publish six department pages. They are now three
     categories (see src/data/functions.js), so the old URLs would 404 — these
     send each one to the category that absorbed it. Permanent, because the
     merge is not going to be undone and a 301 passes the ranking on. */
  async redirects() {
    const merged = {
      sales: 'revenue-customer',
      support: 'revenue-customer',
      marketing: 'revenue-customer',
      finance: 'finance-data',
      data: 'finance-data',
    }
    return Object.entries(merged).map(([from, to]) => ({
      source: `/services/for/${from}`,
      destination: `/services/for/${to}`,
      permanent: true,
    }))
  },
}
export default nextConfig
