'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import { capabilities } from '@/data/capabilities'
import { getIndustry } from '@/data/industries'

export default function Services() {
  const [open, setOpen] = useState('accelerators')

  /* The footer and the industry pages deep-link to /services#<id>. Without
     this the row would be scrolled to but still collapsed, which reads as a
     dead link. */
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    if (capabilities.some((c) => c.id === id)) setOpen(id)
  }, [])

  return (
    <div className="grain">
      <Nav />
      <main id="main">
        <section className="phead grid-bg">
          <div className="phead-light" aria-hidden="true">
            <img src="/void/flare-column.webp" alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell phead-in">
            <p className="mono">Capabilities</p>
            <h1 className="d1 phead-h">Five practices. One method.</h1>
            <p className="lede phead-l">
              No fixed menus. No rate cards. Every engagement starts with discovery, and the scope, timeline and
              estimate come out of what your business actually needs.
            </p>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell">
            <ul className="cat">
              {capabilities.map((c, i) => {
                const isOpen = open === c.id
                return (
                  <li
                    key={c.id}
                    id={c.id}
                    className="cat-row"
                    data-open={isOpen || undefined}
                    data-r
                    style={{ '--rd': `${i * 50}ms` }}
                  >
                    <h2>
                      <button
                        type="button"
                        className="cat-btn"
                        aria-expanded={isOpen}
                        aria-controls={`p-${c.id}`}
                        onClick={() => setOpen(isOpen ? null : c.id)}
                      >
                        <span className="mono cat-n">{c.n}</span>
                        <span className="cat-txt">
                          <span className="mono">{c.k}</span>
                          <span className="cat-t">{c.t}</span>
                        </span>
                        <span className="cat-sign" aria-hidden="true"><span /><span /></span>
                      </button>
                    </h2>
                    <div className="cat-panel" id={`p-${c.id}`} role="region" hidden={!isOpen}>
                      <div className="cat-panel-in">
                        <p className="body cat-b">{c.b}</p>
                        <ul className="cat-items">
                          {c.items.map(([t, d]) => (
                            <li key={t}>
                              <span className="h4">{t}</span>
                              <span className="body">{d}</span>
                            </li>
                          ))}
                        </ul>

                        {/* The other axis. A practice is only meaningful with
                            the sectors it has been used in attached. */}
                        <p className="mono cat-ind">
                          <span className="cat-ind-k">Delivered in</span>
                          {c.industries.map((id) => {
                            const ind = getIndustry(id)
                            if (!ind) return null
                            return (
                              <Link key={id} href={`/industries/${ind.slug}`}>
                                {ind.name}
                              </Link>
                            )
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/hero-pause.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>Pricing comes out of discovery.</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              There is no price list, because the answer depends on scope, estate size and whether you want us to keep
              running it. Engagements start with a paid discovery that produces a written scope with success criteria.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">Get a scope <Chevron /></Link>
            </div>
          </div>
        </section>

        <NextPage href="/industries" title="Industries" />
      </main>

      <Footer />
    </div>
  )
}
