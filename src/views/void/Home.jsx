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
import LoopVideo from '@/components/void/LoopVideo'
import FunctionExplorer from '@/components/void/FunctionExplorer'
import CaseStudies from '@/components/void/CaseStudies'
import Spotlight from '@/components/void/Spotlight'

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
          <LoopVideo
            className="hero-light"
            src="/void/hero-loop"
            poster="/void/hero-pause.webp"
            opacity={0.85}
            once
            pauseAt={4.2}
          />

          <div className="shell hero-in">
            <p className="mono hero-pill-line">We stay after the pilot</p>

            <h1 className="d1 hero-h">
              Get to the pulp of what your
              <br />
              business needs <span className="dim">from AI.</span>
            </h1>

            <p className="lede hero-l measure-w">
              PulpLabs is an AI consultancy and engineering firm. Operational accelerators for enterprises, growth
              solutions for small teams, and the hands-on enablement that makes both stick.
            </p>

            <div className="hero-cta">
              <Link href="/contact" className="btn">
                Book a 30-min consultation <Chevron />
              </Link>
              <Link href="/services" className="btn btn-ghost">
                View service catalogue
              </Link>
            </div>

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

        {/* ── Explorer ─────────────────────────────────────────────────
            Two cuts in one rail: what we have built and published, then the
            client catalogue by the team that owns the queue — because that is
            how buyers arrive ("I run IT operations", not "I would like to
            browse practice areas"). */}
        <section className="sec">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">What we build</p>
              <h2 className="d2">
                Read the code, <span className="dim">then the catalogue.</span>
              </h2>
              <p className="lede">
                Our own products and accelerators are open — start there if you want to know whether we can engineer,
                rather than whether we can present. The client catalogue sits underneath, cut by the team that owns
                the queue.
              </p>
            </header>

            <FunctionExplorer />
          </div>
        </section>

        <div className="flow">
        {/* ── Spotlight ────────────────────────────────────────────────
            Long-form writing lives on PulpLabs Learn, so this links across
            rather than duplicating it here. Two entries only: a spotlight
            that lists everything is an index, and an index does not persuade
            anybody to read the first one. */}
        <section className="sec">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">From PulpLabs Learn</p>
              <h2 className="d2">
                The work, written up <span className="dim">in full.</span>
              </h2>
              <p className="lede">
                What the discovery actually found, what got built, and what we deliberately did not automate — at the
                length the decision deserves rather than the length a home page allows.
              </p>
            </header>

            <Spotlight />
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

        <NextPage
          href="/services"
          title="Capabilities"
        />
      </main>

      <Footer />
    </div>
  )
}
