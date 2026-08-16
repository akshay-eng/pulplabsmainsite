'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import { industries } from '@/data/industries'

export default function Work({ cases = [] }) {
  /* Named outcomes we can stand behind even before a case study is written up.
     This is what keeps the page honest when `cases` is empty: the figures are
     real and attributed, they just are not long-form yet. */
  const attributed = industries.filter((i) => i.proof)

  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="phead grid-bg">
          <div className="phead-light" aria-hidden="true">
            <img src="/void/hero-bleed.webp" alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell phead-in">
            <p className="mono">Client work</p>
            <h1 className="d1 phead-h">What we shipped, and what it changed.</h1>
            <p className="lede phead-l">
              We publish a case study only once the client has signed it off. That makes this page shorter than it
              could be, and every number on it checkable.
            </p>
          </div>
        </section>

        {cases.length > 0 ? (
          /* An editorial column, not a three-up grid. One entry reads as
             deliberate here; one card in a grid of three reads as a gap. */
          <section className="sec-sm">
            <div className="shell-wide">
              <ul className="work-ix">
                {cases.map((c, i) => (
                  <li key={c.slug} data-r style={{ '--rd': `${i * 60}ms` }}>
                    <Link href={`/case-studies/${c.slug}`} className="work-row">
                      <span className="work-art" aria-hidden="true">
                        {c.cover_image && <img src={c.cover_image} alt="" loading="lazy" decoding="async" />}
                      </span>
                      <span className="work-body">
                        <span className="mono work-client">
                          {c.client}
                          {c.industry ? ` · ${c.industry}` : ''}
                        </span>
                        <span className="d3 work-title">{c.title}</span>
                        <span className="body work-sum">{c.summary}</span>
                        {c.metrics?.length > 0 && (
                          <span className="work-metrics">
                            {c.metrics.map((m) => (
                              <span key={m.figure + m.caption}>
                                <b>{m.figure}</b>
                                <i className="mono">{m.caption}</i>
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                      <span className="work-arrow" aria-hidden="true"><Chevron /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : (
          /* Empty state. Says why it is empty, then gives the reader the real
             outcomes anyway rather than leaving them with nothing. */
          <section className="sec-sm">
            <div className="shell">
              <div className="work-empty" data-r>
                <p className="mono">No published case studies yet</p>
                <p className="d3 work-empty-h">
                  Two engagements are described in full on the industry pages. The write-ups are with the clients for
                  sign-off.
                </p>
                <p className="body work-empty-b">
                  We will not put a client&apos;s name and numbers on a public page before they have read it. Until
                  those come back, here is the work with the figures attached, and we will walk you through either one
                  in detail on a call.
                </p>
              </div>

              <ul className="work-attr">
                {attributed.map((ind, i) => (
                  <li key={ind.slug} data-r style={{ '--rd': `${i * 70}ms` }}>
                    <Link href={`/industries/${ind.slug}`}>
                      <span className="mono work-attr-k">{ind.proof.client} · {ind.name}</span>
                      <span className="h4 work-attr-t">{ind.title}</span>
                      <span className="work-attr-out">
                        {ind.proof.outcomes.map(([fig, cap]) => (
                          <span key={cap}>
                            <b>{fig}</b>
                            <i className="mono">{cap}</i>
                          </span>
                        ))}
                      </span>
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
            <h2 className="d2 measure" data-r>Ask for the detail.</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              We will talk through what we built, what it cost, and the parts that did not work first time.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">Start a project <Chevron /></Link>
            </div>
          </div>
        </section>

        <NextPage href="/about" title="About" />
      </main>

      <Footer />
    </div>
  )
}
