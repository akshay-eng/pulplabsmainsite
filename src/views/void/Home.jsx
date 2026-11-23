'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Marquee from 'react-fast-marquee'
import { clients } from '@/data/clients'
import Voices from '@/components/void/Voices'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import AuroraField from '@/components/liquid/AuroraField'
import FunctionExplorer from '@/components/void/FunctionExplorer'
import CaseStudies from '@/components/void/CaseStudies'
import LiquidMark from '@/components/liquid/LiquidMark'
import ProcessStory from '@/components/story/ProcessStory'
import Regions, { RegionChips } from '@/components/regions/Regions'
import Art from '@/components/Art'

export default function Home({ cases = [] }) {
  /* The logo belt is an enhancement over the static row, gated the same way
     LoopVideo gates autoplay: server and first client render show the static
     row (so hydration always matches), and the belt mounts only for visitors
     who have not asked for reduced motion. react-fast-marquee does not check
     the preference itself, and a paused autoFill belt would show duplicate
     logos — the static row is the correct fallback, not a stopped belt. */
  const [belt, setBelt] = useState(false)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    setBelt(true)
  }, [])

  return (
    <div className="grain">
      <Nav />

      <main id="main">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="hero grid-bg">
          {/* The light band, rendered live at native resolution (it was a
              720p video). The old poster frame stays underneath as the
              no-WebGL fallback. */}
          <AuroraField className="hero-light" poster="/void/hero-pause.webp" />

          <div className="shell hero-in">
            {/* The mark as liquid chrome, reflecting the same light band
                that sits behind the headline. */}
            <LiquidMark className="hero-mark" weight={2.7} />
            <p className="mono hero-pill-line">Sovereign AI · We stay after the pilot</p>

            {/* Each line rises out of its own mask. The words stay one
                heading for assistive tech; the spans are presentational. */}
            <h1 className="d1 hero-h">
              <span className="hl" style={{ '--l': 0 }}>
                <span>Get to the pulp of what your</span>
              </span>
              <span className="hl" style={{ '--l': 1 }}>
                <span>
                  business needs <span className="dim">from AI.</span>
                </span>
              </span>
            </h1>

            <p className="lede hero-l measure-w">
              PulpLabs is an AI consultancy and engineering firm working with teams across{' '}
              <strong className="hero-regions">India, Canada and Europe</strong>. Operational accelerators for
              enterprises, growth solutions for small teams, and the hands-on enablement that makes both stick.
            </p>

            <div className="hero-cta">
              <Link href="#contact" className="btn">
                Book a 30-min consultation <Chevron />
              </Link>
              <Link href="/services" className="btn btn-ghost">
                View service catalogue
              </Link>
            </div>

            <RegionChips />

          </div>
        </section>

        {/* ── Trust ────────────────────────────────────────────────────── */}
        <section className="trust">
          <div className="shell-wide trust-in">
            <span className="mono">Trusted by</span>
            {belt ? (
              /* Belt is aria-hidden — autoFill clones every plate to fill the
                 width, and a screen reader should not announce the same four
                 clients on repeat. The sr-only list carries the names once. */
              <>
                <div className="trust-belt" aria-hidden="true">
                  <Marquee autoFill pauseOnHover speed={35}>
                    {clients.map((c) => (
                      <span className="cl-plate" key={c.id} style={{ background: c.ground }}>
                        <img src={c.logo} alt="" data-shape={c.shape} loading="lazy" decoding="async" />
                      </span>
                    ))}
                  </Marquee>
                </div>
                <ul className="sr-only">
                  {clients.map((c) => (
                    <li key={c.id}>{c.name}</li>
                  ))}
                </ul>
              </>
            ) : (
              <ul className="trust-logos">
                {clients.map((c) => (
                  <li key={c.id}>
                    <span className="cl-plate" style={{ background: c.ground }}>
                      <img src={c.logo} alt={c.name} data-shape={c.shape} loading="lazy" decoding="async" />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ── Function explorer ────────────────────────────────────────
            The catalogue cut by the function that owns the queue, because
            that is how buyers arrive: "I run IT operations", not "I would
            like to browse practice areas". */}
        <section className="sec">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">Purpose-built</p>
              <h2 className="d2">
                Built for the queue <span className="dim">you actually run.</span>
              </h2>
            </header>

            <FunctionExplorer />
          </div>
        </section>

        {/* ── Process story ────────────────────────────────────────────
            The engagement as one continuous scroll: four stages, one
            particle system re-forming for each. */}
        <ProcessStory />

        <div className="flow">
        {/* ── Inside your estate ───────────────────────────────────────
            Two claims that were only ever made in prose: that this runs on the
            systems you already have, and that a human holds the approval. Both
            are the reason enterprise buyers say yes, so both get the space. */}
        <section className="sec">
          <div className="shell split">
            <div className="split-copy" data-r>
              <p className="mono">Sovereign AI</p>
              <h2 className="d3">It runs on what you already have.</h2>
              <p className="body">
                Sovereign AI, in practice: deployed inside your boundary rather than as multi-tenant SaaS, wired to
                the ITSM, CMDB and line-of-business systems you already run. Your data does not leave for us to
                operate any of it.
              </p>
              <ul className="split-list">
                {['ITSM and CMDB you already run', 'Your identity provider and access model', 'No data leaves your boundary'].map((t) => (
                  <li key={t}>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" fill="none"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              {/* Deliberately quiet: a footnote, not a feature. */}
              <p className="mono split-note">Prototyped on Stallion, our in-house AI server.</p>
            </div>
            <div className="split-art" data-r style={{ '--rd': '90ms' }} aria-hidden="true">
              <Art src="/void/sec-connect.webp" sizes="(max-width: 760px) 100vw, 50vw" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="shell split is-flip">
            <div className="split-copy" data-r>
              <p className="mono">The approval step</p>
              <h2 className="d3">Nothing irreversible happens on its own.</h2>
              <p className="body">
                Every system we build proposes; a person commits. That gate is not a limitation we ran out of time to
                remove — it is the reason these survive a risk review, and the reason they are still running a year
                later.
              </p>
              <ul className="split-list">
                {['The agent proposes, with its reasoning shown', 'A named human approves', 'The action and the approver are both logged'].map((t) => (
                  <li key={t}>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" fill="none"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="split-art" data-r style={{ '--rd': '90ms' }} aria-hidden="true">
              <Art src="/void/sec-approve.webp" sizes="(max-width: 760px) 100vw, 50vw" loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        {/* ── Blueprints ───────────────────────────────────────────────
            The two we get asked about most, shown large enough that the
            screen itself makes the argument. */}
        <section className="sec">
          <div className="shell">
            <header className="sec-h" data-r>
              <p className="mono">Blueprints</p>
              <h2 className="d2">
                What one actually looks like <span className="dim">in your queue.</span>
              </h2>
            </header>

            <ul className="bps">
              {[
                ['bp-incident', 'incident-intelligence', 'Incident Intelligence',
                 'Triage that opens with the correlated history and the runbook already attached.'],
                ['bp-change', 'change-copilot', 'Change Copilot',
                 'Change records drafted and risk-scored against the rules your CAB actually applies.'],
              ].map(([img, slug, name, desc], i) => (
                <li key={slug} data-r style={{ '--rd': `${i * 80}ms` }}>
                  <Link href={`/services/${slug}`} className="bp">
                    <span className="bp-art">
                      <img src={`/void/${img}.webp`} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="bp-body">
                      <span className="bp-t">
                        {name}
                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                          <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="body bp-d">{desc}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Voices ───────────────────────────────────────────────────── */}
        <section className="sec-sm">
          <div className="shell">
            <header className="sec-h" data-r>
              <p className="mono">What clients say</p>
              <h2 className="d2">In their words.</h2>
            </header>
            <Voices />
          </div>
        </section>

        {/* ── Case studies ─────────────────────────────────────────────── */}
        {cases.length > 0 && (
          <section className="sec-sm">
            <div className="shell-wide">
              <header className="sec-h cse-head" data-r>
                <p className="mono">Where this has already run</p>
                <h2 className="d2">Case studies</h2>
              </header>
              <CaseStudies cases={cases} />
            </div>
          </section>
        )}

        </div>

        {/* ── Where we work ─────────────────────────────────────────────
            Closes the page: after the work and the proof, where and when
            we can start. */}
        <Regions />

        <NextPage
          href="/services"
          title="Capabilities"
        />
      </main>

      <Footer />
    </div>
  )
}

