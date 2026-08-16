'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import { industries } from '@/data/industries'
import { getCapability } from '@/data/capabilities'

export default function Industry({ industry }) {
  const idx = industries.findIndex((i) => i.slug === industry.slug)
  const next = industries[(idx + 1) % industries.length]

  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="phead grid-bg">
          <div className="phead-light" aria-hidden="true">
            <img src="/void/flare-column.webp" alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell phead-in">
            <nav className="mono ind-crumb" aria-label="Breadcrumb">
              <Link href="/industries">Industries</Link>
              <span aria-hidden="true">/</span>
              <span>{industry.kicker}</span>
            </nav>
            <h1 className="d1 phead-h">{industry.title}</h1>
            <p className="lede phead-l">{industry.lede}</p>
          </div>
        </section>

        {/* What we see — the sector's problem, stated before our answer to it. */}
        <section className="sec">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">What we see</p>
              <h2 className="d2 measure">The pattern is usually the same three things.</h2>
            </header>
            <ul className="prin">
              {industry.pressures.map(([t, b], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 70}ms` }}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="d3">{t}</h3>
                  <p className="body">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What we do — named assets framed as things brought into an
            engagement, which is the distinction between a firm and a vendor. */}
        <section className="sec-sm">
          <div className="shell">
            <header className="sec-h" data-r>
              <p className="mono">What we do here</p>
              <h2 className="d2 measure">Shaped to your estate, not sold from a shelf.</h2>
            </header>
            <ul className="cat-items ind-work" data-r>
              {industry.work.map(([t, d]) => (
                <li key={t}>
                  <span className="h4">{t}</span>
                  <span className="body">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Proof. Real outcomes when a client has signed off; an honest line
            when not. Never an invented figure — see PRODUCT.md. */}
        <section className="plate">
          <div className="plate-img" aria-hidden="true">
            <img src="/void/deep-field.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell plate-in">
            {industry.proof ? (
              <>
                <p className="mono">Client outcome</p>
                <p className="d2 plate-h">{industry.proof.client}</p>
                <ul className="ind-out">
                  {industry.proof.outcomes.map(([fig, cap]) => (
                    <li key={cap} data-r>
                      <span className="ind-fig">{fig}</span>
                      <span className="mono">{cap}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="mono">Client outcome</p>
                <p className="d2 plate-h">
                  Nothing published here yet.
                </p>
                <p className="body plate-b">
                  We publish a case study only once the client has signed it off, and none of our {industry.name.toLowerCase()} work
                  has cleared that yet. We would rather show you an empty space than a number we made up. Ask on the
                  call and we will walk you through the work in detail.
                </p>
              </>
            )}
          </div>
        </section>

        {/* The other axis: this sector back to the capabilities behind it. */}
        <section className="sec">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">Capabilities we bring</p>
            </header>
            <ul className="ind-caps">
              {industry.capabilities.map((id, i) => {
                const c = getCapability(id)
                if (!c) return null
                return (
                  <li key={id} data-r style={{ '--rd': `${i * 60}ms` }}>
                    <Link href={`/services#${c.id}`}>
                      <span className="mono">{c.n}</span>
                      <span className="h4">{c.k}</span>
                      <span className="body">{c.t}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/aperture-glow.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>Is this your week?</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              Thirty minutes with an engineer who has worked in {industry.name.toLowerCase()}. No deck, and a straight
              answer on whether this is worth doing.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">Start a project <Chevron /></Link>
            </div>
          </div>
        </section>

        <NextPage href={`/industries/${next.slug}`} title={next.name} />
      </main>

      <Footer />
    </div>
  )
}
