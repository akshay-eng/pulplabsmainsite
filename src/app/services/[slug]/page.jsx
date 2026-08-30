import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import StartCta from '@/components/void/StartCta'
import { allSolutions, getCapability } from '@/data/capabilities'
import { getFunction } from '@/data/functions'

/* Fully static — the content is in the repo, so every capability page is
   prerendered at build time and served as HTML. Crawlers get the copy without
   executing anything. */
export function generateStaticParams() {
  return allSolutions.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const cap = getCapability(slug)
  if (!cap) return {}
  return {
    title: `${cap.name} · PulpLabs`,
    description: cap.tagline,
    alternates: { canonical: `/services/${cap.slug}` },
    openGraph: {
      title: `${cap.name} · PulpLabs`,
      description: cap.tagline,
      url: `/services/${cap.slug}`,
      images: [{ url: `/void/cards/${cap.slug}.webp`, width: 1000, height: 545 }],
    },
  }
}

export default async function CapabilityPage({ params }) {
  const { slug } = await params
  const cap = getCapability(slug)
  if (!cap) notFound()

  // Next/prev within the same practice area, so the pages chain rather than
  // dead-ending back at the catalogue every time.
  const siblings = allSolutions.filter((c) => c.fn === cap.fn)
  const next = siblings[(siblings.findIndex((c) => c.slug === cap.slug) + 1) % siblings.length]

  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="cdet-head">
          <div className="cdet-art" aria-hidden="true">
            <img src={`/void/cards/${cap.slug}.webp`} alt="" fetchPriority="high" decoding="async" />
          </div>

          <div className="shell cdet-in">
            <p className="mono cdet-crumb">
              <Link href="/services">Capabilities</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/services/for/${cap.fn}`}>{getFunction(cap.fn)?.name}</Link>
              <span aria-hidden="true">/</span>
              {cap.parentLabel}
            </p>
            <h1 className="d2 cdet-h">{cap.name}</h1>
            <p className={`sol-status is-${cap.status}`}>
              {cap.status === 'production'
                ? 'Accelerator · running in client estates today'
                : 'Built to scope · a shape we have built before, fitted to your systems'}
            </p>
            <p className="lede cdet-l">{cap.tagline}</p>

            <p className="cdet-metric">
              <span className="cdet-v">{cap.metric[1]}</span>
              <span className="mono">{cap.metric[0]}</span>
            </p>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell cdet-grid">
            <div className="cdet-main">
              <p className="body cdet-body" data-r>{cap.body}</p>

              <div className="cdet-limit" data-r style={{ '--rd': '80ms' }}>
                <p className="mono">What it will not do</p>
                <p className="body">{cap.limits}</p>
              </div>
            </div>

            <aside className="cdet-side">
              <div data-r>
                <p className="mono cdet-sk">Plugs into</p>
                <ul className="cdet-list">
                  {cap.inputs.map((x) => <li key={x} className="body">{x}</li>)}
                </ul>
              </div>
              <div data-r style={{ '--rd': '60ms' }}>
                <p className="mono cdet-sk">What you get</p>
                <ul className="cdet-list">
                  {cap.outputs.map((x) => <li key={x} className="body">{x}</li>)}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/hero-pause.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>Want this running on your estate?</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              Thirty minutes with an engineer. We will tell you what it takes to stand up here, and if it is the
              wrong fit for your workflow, we will tell you that instead.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <StartCta message={`Hi PulpLabs, I'm interested in ${cap.name}.`}>Start the conversation <Chevron /></StartCta>
            </div>
          </div>
        </section>

        <NextPage href={`/services/${next.slug}`} title={next.name} />
      </main>

      <Footer />
    </div>
  )
}
