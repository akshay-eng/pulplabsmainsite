import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { FooterSlim } from '@/components/Footer'
import { getCaseBySlug, listPublishedCases, relatedCases } from '@/lib/cases'
import { renderMarkdown } from '@/lib/markdown'
import { SITE_URL } from '@/app/layout'

export async function generateStaticParams() {
  return listPublishedCases({ limit: 200 }).map((c) => ({ slug: c.slug }))
}

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const c = getCaseBySlug(slug)
  if (!c) return { title: 'Case study not found' }

  const url = `${SITE_URL}/case-studies/${c.slug}`
  const image = c.cover_image ? new URL(c.cover_image, SITE_URL).toString() : `${SITE_URL}/art/outcomes.webp`

  return {
    title: `${c.title} — ${c.client}`,
    description: c.summary,
    alternates: { canonical: `/case-studies/${c.slug}` },
    openGraph: {
      type: 'article',
      title: `${c.title} — ${c.client}`,
      description: c.summary,
      url,
      siteName: 'PulpLabs',
      images: [{ url: image, width: 1200, height: 630, alt: c.title }],
    },
    twitter: { card: 'summary_large_image', title: c.title, description: c.summary, images: [image] },
  }
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params
  const c = getCaseBySlug(slug)
  if (!c) notFound()

  const html = renderMarkdown(c.body)
  const related = relatedCases(c.slug, 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.title,
    description: c.summary,
    datePublished: c.published_at,
    dateModified: c.updated_at || c.published_at,
    author: { '@type': 'Organization', name: 'PulpLabs' },
    publisher: { '@type': 'Organization', name: 'PulpLabs' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/case-studies/${c.slug}` },
    ...(c.cover_image ? { image: new URL(c.cover_image, SITE_URL).toString() } : {}),
  }

  return (
    <div className="page">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main">
      <article className="post">
        <header className="post-header" style={{ '--post-accent': c.accent }}>
          <div className="shell">
            <nav className="post-crumbs" aria-label="Breadcrumb">
              <Link href="/services#work">Case studies</Link>
              {c.industry && (
                <>
                  <span aria-hidden="true">/</span>
                  <span>{c.industry}</span>
                </>
              )}
            </nav>

            <div className="case-client" style={{ color: c.accent }}>
              {c.client}
            </div>
            <h1>{c.title}</h1>
            <p className="post-lede">{c.summary}</p>

            {c.metrics.length > 0 && (
              <div className="case-hero-metrics">
                {c.metrics.map((m) => (
                  <div key={m.figure + m.caption}>
                    <div className="figure" style={{ color: c.accent }}>{m.figure}</div>
                    <div className="caption">{m.caption}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {c.cover_image && (
          <div className="shell">
            <figure className="post-cover">
              <img src={c.cover_image} alt="" fetchPriority="high" decoding="async" />
            </figure>
          </div>
        )}

        <div className="shell post-body-grid">
          {/* Sanitised in renderMarkdown() */}
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="section post-related">
          <h2 className="section-title" style={{ fontSize: 30, marginBottom: 20 }}>More work</h2>
          <div className="case-related">
            {related.map((r) => (
              <Link key={r.slug} href={`/case-studies/${r.slug}`} className="card card-lift case-related-card">
                <div className="case-related-art">
                  {r.cover_image && <img src={r.cover_image} alt="" loading="lazy" decoding="async" />}
                </div>
                <div className="case-related-copy">
                  <div className="case-client" style={{ color: r.accent }}>{r.client}</div>
                  <h3>{r.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="cta-banner" style={{ background: 'var(--tangerine)' }}>
          <div className="card-body">
            <h2 style={{ color: 'var(--ink-deep)' }}>Got a workflow like this one?</h2>
            <p style={{ color: 'rgba(31,23,16,.78)' }}>
              Thirty minutes with an engineer — you&apos;ll leave with a straight answer on whether AI helps here.
            </p>
          </div>
          <Link href="/contact" className="btn btn-lemon" style={{ position: 'relative' }}>
            Book a consultation
          </Link>
        </div>
      </section>
      </main>

      <FooterSlim />
    </div>
  )
}
