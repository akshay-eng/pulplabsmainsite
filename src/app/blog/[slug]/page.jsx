import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { FooterSlim } from '@/components/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import { PostRow, formatDate, accentFor } from '@/components/PostCard'
import { getBySlug, listPublished, relatedPosts } from '@/lib/posts'
import { renderMarkdown, extractHeadings, readingTime } from '@/lib/markdown'
import { SITE_URL } from '@/app/layout'

/* Pre-render every published post at build time, then revalidate. New posts
   published from the admin are picked up without a redeploy because
   dynamicParams (default true) renders unknown slugs on first request. */
export async function generateStaticParams() {
  return listPublished({ limit: 500 }).map((p) => ({ slug: p.slug }))
}

export const revalidate = 60

/* ==========================================================================
   Metadata. This is the whole reason the site moved to Next: social crawlers
   don't run JS, so these tags have to be in the HTML the server sends.
   ========================================================================== */
export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getBySlug(slug)
  if (!post) return { title: 'Post not found' }

  const url = `${SITE_URL}/blog/${post.slug}`
  const image = post.cover_image
    ? new URL(post.cover_image, SITE_URL).toString()
    : `${SITE_URL}/art/blog-featured.webp`

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      siteName: 'PulpLabs',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [image],
    },
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const post = getBySlug(slug)
  if (!post) notFound()

  const html = renderMarkdown(post.body)
  const headings = extractHeadings(post.body)
  const minutes = readingTime(post.body)
  const related = relatedPosts(post.slug, 3)
  const accent = accentFor(post.slug)

  /* Article schema. Gives Google the byline, dates and headline explicitly
     rather than making it infer them from the markup. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'PulpLabs',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
    ...(post.cover_image ? { image: new URL(post.cover_image, SITE_URL).toString() } : {}),
    keywords: post.tags.join(', '),
  }

  return (
    <div className="page">
      <Navbar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="post">
        <header className="post-header" style={{ '--post-accent': accent.fg }}>
          <div className="shell">
            <nav className="post-crumbs" aria-label="Breadcrumb">
              <Link href="/blog">Blog</Link>
              {post.category && (
                <>
                  <span aria-hidden="true">/</span>
                  <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>{post.category}</Link>
                </>
              )}
            </nav>

            <h1>{post.title}</h1>
            <p className="post-lede">{post.description}</p>

            <div className="post-meta">
              <span>{post.author}</span>
              {post.published_at && (
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              )}
              <span>{minutes} min read</span>
            </div>

            {post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((t) => (
                  <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="filter-chip">
                    {t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="shell post-body-grid">
          {/* Contents rail — only worth showing once there's enough structure
              to navigate. */}
          {headings.length >= 3 && (
            <nav className="post-toc" aria-label="On this page">
              <div className="post-toc-title">On this page</div>
              <ul>
                {headings.map((h) => (
                  <li key={h.id} data-level={h.level}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Sanitised in renderMarkdown() — see src/lib/markdown.js */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="section post-related">
          <h2 className="section-title" style={{ fontSize: 30, marginBottom: 20 }}>
            Read next
          </h2>
          <div className="post-list">
            {related.map((p, i) => (
              <PostRow key={p.slug} post={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="aside-newsletter" data-reveal>
          <div className="blob" style={{ right: -26, bottom: -30, width: 100, height: 100, background: '#FFECA8' }} />
          <div className="card-body">
            <h3>Fresh from the lab, monthly.</h3>
            <p>One email a month on what we shipped, learned and open-sourced. No spam.</p>
            <NewsletterForm variant="stacked" />
          </div>
        </div>
      </section>

      <FooterSlim />
    </div>
  )
}
