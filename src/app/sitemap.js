import { listPublished } from '@/lib/posts'
import { listPublishedCases } from '@/lib/cases'
import { SITE_URL } from './layout'

/* Next generates /sitemap.xml from this. Posts carry their real lastModified
   so crawlers can tell an edit from a no-op. */
export default function sitemap() {
  const staticPages = [
    { url: '/', priority: 1.0, changeFrequency: 'monthly' },
    { url: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/team', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/blog', priority: 0.9, changeFrequency: 'weekly' },
  ].map((p) => ({ ...p, url: `${SITE_URL}${p.url}`, lastModified: new Date() }))

  const posts = listPublished({ limit: 1000 }).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || p.published_at),
    changeFrequency: 'yearly',
    priority: 0.8,
  }))

  const cases = listPublishedCases({ limit: 200 }).map((c) => ({
    url: `${SITE_URL}/case-studies/${c.slug}`,
    lastModified: new Date(c.updated_at || c.published_at),
    changeFrequency: 'yearly',
    priority: 0.8,
  }))

  return [...staticPages, ...posts, ...cases]
}
