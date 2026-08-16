'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import LoopVideo from '@/components/void/LoopVideo'
import { useScrollProgress } from '@/lib/apple-motion'
import { industries } from '@/data/industries'
import { engagementSteps, alliances, voices } from '@/data/firm'

/* Firm-shaped figures, not inventory. The previous set counted "accelerators in
   production", which is how a vendor describes a product line. */
const COUNTS = [
  ['4', 'sectors delivered in'],
  ['4', 'platforms accredited'],
  ['6', 'people'],
]

export default function Home({ posts = [] }) {
  const plate = useScrollProgress()
  const proven = industries.filter((i) => i.proof)

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
              PulpLabs is an AI consultancy and engineering firm. We scope from discovery, build in weekly increments
              and hand over what we build — for enterprise operations teams and for small businesses.
            </p>

            <div className="hero-cta">
              <Link href="/contact" className="btn">
                Book a 30-min consultation <Chevron />
              </Link>
              <Link href="/industries" className="btn btn-ghost">
                Who we work with
              </Link>
            </div>
          </div>
        </section>

        {/* ── Trust ────────────────────────────────────────────────────── */}
        <section className="trust">
          <div className="shell-wide trust-in">
            <span className="mono">Trusted by</span>
            <ul className="trust-logos">
              <li>Power &amp; Pack Solutions</li>
              <li>Urban Ethnographers</li>
            </ul>
            <ul className="trust-counts">
              {COUNTS.map(([n, l]) => (
                <li key={l}>
                  <b>{n}</b> {l}
                </li>
              ))}
            </ul>
          </div>

          {/* Accreditation as a static row. The previous version looped eight
              capitalised system names past the reader, which is how a platform
              shows its modules — the single strongest product signal on the
              page. These four are formal, verifiable and belong to somebody
              else, which is what makes them worth showing. */}
          <div className="shell-wide alli">
            <span className="mono alli-k">Accredited on</span>
            <ul className="alli-list">
              {alliances.map(([n, issuer]) => (
                <li key={n}>
                  <span className="alli-n">{n}</span>
                  <span className="mono alli-i">{issuer}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Industries ───────────────────────────────────────────────── */}
        {/* The second axis, surfaced high. A buyer's first question is whether
            you have seen their problem before, not what your product does. */}
        <section className="sec" ref={plate}>
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">Industries</p>
              <h2 className="d2">
                We work where we have <span className="dim">shipped before.</span>
              </h2>
            </header>

            <ul className="ind-grid">
              {industries.map((ind, i) => (
                <li key={ind.slug} data-r style={{ '--rd': `${i * 60}ms` }}>
                  <Link href={`/industries/${ind.slug}`}>
                    <span className="mono ind-grid-k">{ind.kicker}</span>
                    <span className="d3 ind-grid-n">{ind.name}</span>
                    <span className="body ind-grid-b">{ind.title}</span>
                    <span className="ind-grid-go" aria-hidden="true"><Chevron /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="flow">
          {/* ── Client work ────────────────────────────────────────────── */}
          {/* Replaces the "Live estate telemetry" panel, which looked like a
              live dashboard but was hardcoded. These figures belong to named
              clients and are checkable. */}
          <section className="sec">
            <div className="shell-wide">
              <header className="sec-h" data-r>
                <p className="mono">Client work</p>
                <h2 className="d2">
                  We ship against numbers, <span className="dim">not adjectives.</span>
                </h2>
              </header>

              <ul className="cw">
                {proven.map((ind, i) => (
                  <li key={ind.slug} data-r style={{ '--rd': `${i * 80}ms` }}>
                    <Link href={`/industries/${ind.slug}`}>
                      <span className="mono cw-k">{ind.proof.client} · {ind.name}</span>
                      <span className="d3 cw-t">{ind.title}</span>
                      <span className="cw-out">
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

              <p className="mono cw-note" data-r>
                <Link href="/case-studies">All client work →</Link>
              </p>
            </div>
          </section>

          {/* ── How we engage ──────────────────────────────────────────── */}
          <section className="sec">
            <div className="shell">
              <header className="sec-h" data-r>
                <p className="mono">How we engage</p>
                <h2 className="d2">
                  Discover. Build. <span className="dim">Hand over.</span>
                </h2>
              </header>

              <ol className="proc">
                {engagementSteps.map(([t, b], i) => (
                  <li key={t} data-r style={{ '--rd': `${i * 65}ms` }}>
                    <span className="mono proc-n">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="h4">{t}</h3>
                      <p className="body">{b}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* ── Voices ─────────────────────────────────────────────────── */}
          <section className="sec-sm">
            <div className="shell-wide">
              <header className="sec-h" data-r>
                <p className="mono">What clients say</p>
              </header>
              <ul className="voices">
                {voices.map(([q, name, org], i) => (
                  <li key={org} data-r style={{ '--rd': `${i * 80}ms` }}>
                    <p className="d3 voice-q">&ldquo;{q}&rdquo;</p>
                    <p className="mono">
                      {name} · {org}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* ── Insights ─────────────────────────────────────────────────── */}
        {/* The credibility engine on both reference sites. A firm publishes a
            point of view; a product publishes a changelog. */}
        {posts.length > 0 && (
          <section className="sec">
            <div className="shell-wide">
              <header className="sec-h" data-r>
                <p className="mono">Insights</p>
                <h2 className="d2 measure">What we are working out in the open.</h2>
              </header>

              <ul className="ins">
                {posts.map((p, i) => (
                  <li key={p.slug} data-r style={{ '--rd': `${i * 60}ms` }}>
                    <Link href={`/blog/${p.slug}`}>
                      {p.category && <span className="mono ins-k">{p.category}</span>}
                      <span className="h4 ins-t">{p.title}</span>
                      {p.excerpt && <span className="body ins-b">{p.excerpt}</span>}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mono cw-note" data-r>
                <Link href="/blog">All insights →</Link>
              </p>
            </div>
          </section>
        )}

        <NextPage href="/services" title="Capabilities" />
      </main>

      <Footer />
    </div>
  )
}
