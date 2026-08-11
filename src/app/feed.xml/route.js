import { listPublished } from '@/lib/posts'
import { renderMarkdown } from '@/lib/markdown'
import { SITE_URL } from '@/app/layout'

export const revalidate = 300

const escape = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/* RSS 2.0. Full content in content:encoded so readers show the post rather
   than a teaser that forces a click. */
export async function GET() {
  const posts = listPublished({ limit: 50 })

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      <description>${escape(p.description)}</description>
      ${p.category ? `<category>${escape(p.category)}</category>` : ''}
      <content:encoded><![CDATA[${renderMarkdown(p.body)}]]></content:encoded>
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PulpLabs — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Engineering field notes and playbooks from live AI work.</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
