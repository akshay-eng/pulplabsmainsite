import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import Chevron from '@/components/apple/Chevron'
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
    <div className="grain jr">
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main">
        <article>
          <header className="jr-hero">
            <div className="shell">
              <nav className="mono jr-crumbs hero-pill-line" aria-label="Breadcrumb">
                <Link href="/services#work">Case studies</Link>
                {c.industry && (
                  <>
                    <span aria-hidden="true">/</span>
                    <span>{c.industry}</span>
                  </>
                )}
              </nav>

              <p className="mono hero-pill-line" style={{ marginTop: 26, color: 'var(--w-1)' }}>
                {c.client}
              </p>
              <h1 className="d2 hero-h" style={{ maxWidth: '20ch', marginTop: 14 }}>
                {c.title}
              </h1>
              <p className="lede hero-l">{c.summary}</p>

              {c.metrics.length > 0 && (
                <div className="jr-metrics hero-cta">
                  {c.metrics.map((m) => (
                    <div key={m.figure + m.caption} className="jr-metric lg lg-card">
                      <strong>{m.figure}</strong>
                      <span className="mono">{m.caption}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </header>

          {c.cover_image && (
            <div className="shell">
              <figure className="jr-cover" data-r>
                <img src={c.cover_image} alt="" fetchPriority="high" decoding="async" />
              </figure>
            </div>
          )}

          <div className="shell-wide jr-body is-solo">
            {/* Sanitised in renderMarkdown() */}
            <div className="jr-prose" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </article>

        {related.length > 0 && (
          <section className="shell jr-sec">
            <header className="sec-h" data-r>
              <p className="mono">Where this has already run</p>
              <h2 className="d3">More work</h2>
            </header>
            <div className="jr-related">
              {related.map((r, i) => (
                <Link key={r.slug} href={`/case-studies/${r.slug}`} className="jr-card" data-r style={{ '--rd': `${i * 80}ms` }}>
                  <span className="jr-card-art" aria-hidden="true">
                    {r.cover_image && <img src={r.cover_image} alt="" loading="lazy" decoding="async" />}
                  </span>
                  <span className="jr-card-copy">
                    <span className="mono">{r.client}</span>
                    <h3>{r.title}</h3>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="shell">
          <div className="jr-cta lg lg-card" data-r>
            <div>
              <h2 className="d3">Got a workflow like this one?</h2>
              <p className="body">
                Thirty minutes with an engineer — you&apos;ll leave with a straight answer on whether AI helps here.
              </p>
            </div>
            <Link href="/contact" className="btn">
              Book a consultation <Chevron />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
