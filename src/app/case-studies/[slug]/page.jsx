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
    <div className="grain">
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main">
        <article>
          <header className="phead grid-bg cs-head">
            <div className="phead-light" aria-hidden="true">
              <img src="/void/flare-column.webp" alt="" fetchPriority="high" decoding="async" />
            </div>

            <div className="shell phead-in">
              <nav className="mono ind-crumb" aria-label="Breadcrumb">
                <Link href="/case-studies">Client work</Link>
                {c.industry && (
                  <>
                    <span aria-hidden="true">/</span>
                    <span>{c.industry}</span>
                  </>
                )}
              </nav>

              <p className="mono cs-client">{c.client}</p>
              <h1 className="d1 phead-h">{c.title}</h1>
              <p className="lede phead-l">{c.summary}</p>

              {c.metrics.length > 0 && (
                <ul className="cs-metrics">
                  {c.metrics.map((m) => (
                    <li key={m.figure + m.caption}>
                      <span className="ind-fig">{m.figure}</span>
                      <span className="mono">{m.caption}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </header>

          {c.cover_image && (
            <div className="shell">
              <figure className="cs-cover">
                <img src={c.cover_image} alt="" fetchPriority="high" decoding="async" />
              </figure>
            </div>
          )}

          <div className="shell cs-body">
            {/* Sanitised in renderMarkdown() */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </article>

        {related.length > 0 && (
          <section className="sec-sm">
            <div className="shell-wide">
              <header className="sec-h">
                <p className="mono">More work</p>
              </header>
              <ul className="work-ix">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/case-studies/${r.slug}`} className="work-row">
                      <span className="work-art" aria-hidden="true">
                        {r.cover_image && <img src={r.cover_image} alt="" loading="lazy" decoding="async" />}
                      </span>
                      <span className="work-body">
                        <span className="mono work-client">{r.client}</span>
                        <span className="d3 work-title">{r.title}</span>
                      </span>
                      <span className="work-arrow" aria-hidden="true"><Chevron /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/aperture-glow.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure">Got a workflow like this one?</h2>
            <p className="lede measure-w close-l">
              Thirty minutes with an engineer. You will leave with a straight answer on whether AI helps here.
            </p>
            <div className="close-cta">
              <Link href="/contact" className="btn">Start a project <Chevron /></Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
