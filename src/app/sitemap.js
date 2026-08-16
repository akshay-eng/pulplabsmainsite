import { listPublished } from '@/lib/posts'
import { listPublishedCases } from '@/lib/cases'
import { industries } from '@/data/industries'
import { SITE_URL } from './layout'

/* Next generates /sitemap.xml from this. Posts carry their real lastModified
   so crawlers can tell an edit from a no-op.

   /team is deliberately absent — it is a permanent redirect to /about, and
   listing a 308 in a sitemap just spends crawl budget to be told to go
   somewhere else. */
export default function sitemap() {
  const staticPages = [
    { url: '/', priority: 1.0, changeFrequency: 'monthly' },
    { url: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/industries', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/case-studies', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { url: '/blog', priority: 0.9, changeFrequency: 'weekly' },
  ].map((p) => ({ ...p, url: `${SITE_URL}${p.url}`, lastModified: new Date() }))

  const sectors = industries.map((i) => ({
    url: `${SITE_URL}/industries/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

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

  return [...staticPages, ...sectors, ...posts, ...cases]
}
