import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import { PostRow, formatDate } from '@/components/journal/Post'
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
    <div className="grain jr">
      <Nav />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main">
        <article>
          <header className="jr-hero">
            <div className="shell">
              <nav className="mono jr-crumbs hero-pill-line" aria-label="Breadcrumb">
                <Link href="/blog">Blog</Link>
                {post.category && (
                  <>
                    <span aria-hidden="true">/</span>
                    <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>{post.category}</Link>
                  </>
                )}
              </nav>

              <h1 className="d2 hero-h" style={{ maxWidth: '22ch' }}>
                {post.title}
              </h1>
              <p className="lede hero-l">{post.description}</p>

              <p className="mono jr-meta hero-cta">
                <span>{post.author}</span>
                {post.published_at && (
                  <span>
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  </span>
                )}
                <span>{minutes} min read</span>
              </p>

              {post.tags.length > 0 && (
                <div className="jr-tags">
                  {post.tags.map((t) => (
                    <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className="jr-chip">
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>

          {post.cover_image && (
            <div className="shell">
              {/* Cropped to 1.91:1 — the same framing as the social card, so
                  what a reader sees matches what LinkedIn unfurls. */}
              <figure className="jr-cover" data-r>
                <img src={post.cover_image} alt="" fetchPriority="high" decoding="async" />
              </figure>
            </div>
          )}

          <div className={`shell-wide jr-body${headings.length >= 3 ? '' : ' is-solo'}`}>
            {/* Contents rail — only worth showing once there's enough
                structure to navigate. */}
            {headings.length >= 3 && (
              <nav className="jr-toc" aria-label="On this page">
                <p className="mono">On this page</p>
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
            <div className="jr-prose" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </article>

        {related.length > 0 && (
          <section className="shell jr-sec">
            <header className="sec-h" data-r>
              <p className="mono">Keep reading</p>
              <h2 className="d3">Read next</h2>
            </header>
            <ul className="jr-rows">
              {related.map((p, i) => (
                <PostRow key={p.slug} post={p} index={i} />
              ))}
            </ul>
          </section>
        )}

        <section className="shell">
          <div className="jr-cta lg lg-card jr-news" data-r>
            <div>
              <p className="mono">Monthly</p>
              <h2 className="d3" style={{ marginTop: 12 }}>
                Fresh from the lab.
              </h2>
              <p className="body">One email a month on what we shipped, learned and open-sourced. No spam.</p>
            </div>
            <div style={{ minWidth: 'min(320px, 100%)' }}>
              <NewsletterForm variant="stacked" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
