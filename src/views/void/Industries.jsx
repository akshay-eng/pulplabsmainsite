'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import { industries } from '@/data/industries'
import { getCapability } from '@/data/capabilities'

export default function Industries() {
  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="phead grid-bg">
          <div className="phead-light" aria-hidden="true">
            <img src="/void/grid-horizon.webp" alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell phead-in">
            <p className="mono">Industries</p>
            <h1 className="d1 phead-h">Where we have done this before.</h1>
            <p className="lede phead-l">
              Four sectors, not fourteen. We list the ones we have actually delivered in, because the only useful
              question in a first call is whether we have seen your problem before.
            </p>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell-wide">
            <ul className="ind-ix">
              {industries.map((ind, i) => (
                <li key={ind.slug} data-r style={{ '--rd': `${i * 55}ms` }}>
                  <Link href={`/industries/${ind.slug}`} className="ind-row">
                    <span className="mono ind-n">{String(i + 1).padStart(2, '0')}</span>

                    <span className="ind-body">
                      <span className="d3 ind-name">{ind.name}</span>
                      <span className="body ind-lede">{ind.title}</span>
                    </span>

                    <span className="mono ind-tags">
                      {ind.capabilities.map((id) => getCapability(id)?.k).filter(Boolean).join(' · ')}
                    </span>

                    <span className="ind-arrow" aria-hidden="true">
                      <Chevron />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec">
          <div className="shell">
            <header className="sec-h" data-r>
              <p className="mono">Outside these four</p>
              <h2 className="d2 measure">The method travels further than the sector list.</h2>
            </header>
            <p className="body measure-w" data-r style={{ '--rd': '80ms' }}>
              Discovery, evaluation against your own historical cases, and a real handover are not sector-specific. If
              your industry is not listed, that means we have not shipped in it yet, not that we cannot. Ask on the
              call and we will tell you straight which parts of this we have done before and which would be new.
            </p>
          </div>
        </section>

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/aperture-glow.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>Tell us the workflow.</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              Thirty minutes with an engineer, no deck. You will leave with a straight answer on whether AI helps here,
              even if that answer is no.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">Start a project <Chevron /></Link>
            </div>
          </div>
        </section>

        <NextPage href="/case-studies" title="Client work" />
      </main>

      <Footer />
    </div>
  )
}
