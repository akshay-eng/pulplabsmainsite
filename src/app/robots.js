import { SITE_URL } from './layout'

export default function robots() {
  return {
    rules: [
      // /admin and /api are useless to crawlers and shouldn't appear in results.
      { userAgent: '*', allow: '/', disallow: ['/admin', '/admin/', '/api/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
