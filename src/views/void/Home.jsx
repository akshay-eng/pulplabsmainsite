'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import Chevron from '@/components/apple/Chevron'
import { useScrollProgress } from '@/lib/apple-motion'

const SURFACES = [
  {
    k: 'Incident Intelligence',
    b: 'Triage, correlation and suggested remediation against your live queue. The first responder opens with context, not a blank search box.',
    m: ['MTTR', '−38%'],
  },
  {
    k: 'Change Copilot',
    b: 'Risk scoring and change-record drafting against your own CAB rules, with the implementation and rollback plan attached for review.',
    m: ['Review time', '−61%'],
  },
  {
    k: 'Patch Orchestrator',
    b: 'Reads vendor advisories, maps them to your real estate, and sequences the rollout around your maintenance windows.',
    m: ['Windows hit', '100%'],
  },
  {
    k: 'Agent Migration',
    b: 'Moves legacy bots and RPA flows onto modern runtimes with behaviour preserved — and the audit trail intact.',
    m: ['Audit breaks', '0'],
  },
]

const NUMBERS = [
  ['8+', 'accelerators in production'],
  ['4', 'platform certifications'],
  ['4 wks', 'to first system live'],
]

export default function Home() {
  const bleed = useScrollProgress()

  return (
    <div className="grain">
      <Nav />

      <main id="main">
        {/* ── Hero ───────────────────────────────────────────────────────
            The light is the only colour on the page and it sits behind the
            type, not beside it. Everything else is black and white. */}
        <section className="hero grid-bg">
          <div className="hero-light" aria-hidden="true">
            <img src="/void/hero-bleed.webp" alt="" fetchPriority="high" decoding="async" />
          </div>

          <div className="shell hero-in">
            <Link href="/services" className="pill hero-pill">
              <b>New</b> Agent Migration — now generally available
            </Link>

            <h1 className="d1 hero-h">
              Frontier models are easy.
              <br />
              <span className="dim">Landing them is not.</span>
            </h1>

            <p className="lede hero-l measure-w">
              PulpLabs deploys AI inside your estate — wired to the systems you already run, evaluated before it
              touches production, and operated long after the pilot.
            </p>

            <div className="hero-cta">
              <Link href="/contact" className="btn">
                Start a project <Chevron />
              </Link>
              <Link href="/services" className="btn btn-ghost">
                See capabilities
              </Link>
            </div>
          </div>
        </section>

        {/* ── Surfaces ───────────────────────────────────────────────── */}
        <section className="sec">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">Enterprise accelerators</p>
              <h2 className="d2">Four systems, already in production.</h2>
              <p className="lede">
                Deployed inside your estate rather than as multi-tenant SaaS. Your data never leaves your boundary for
                us to operate them.
              </p>
            </header>

            <ul className="surfaces">
              {SURFACES.map((s, i) => (
                <li key={s.k} className="surface" data-r style={{ '--rd': `${i * 70}ms` }}>
                  <div className="surface-top">
                    <h3 className="h4">{s.k}</h3>
                    <span className="surface-m">
                      <span className="mono">{s.m[0]}</span>
                      <b>{s.m[1]}</b>
                    </span>
                  </div>
                  <p className="body">{s.b}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Statement ─────────────────────────────────────────────────
            A full-bleed light plate with the sentence over it. The image
            scale is tied to scroll position, so the reader drives it. */}
        <section className="plate" ref={bleed}>
          <div className="plate-img" aria-hidden="true">
            <img src="/void/aperture-glow.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell plate-in">
            <p className="mono">The gap</p>
            <p className="d2 plate-h">
              A model that has never been scored against your estate will answer every question with the same
              confidence — <span className="dim">whether it is right or not.</span>
            </p>
            <p className="body plate-b">
              Every system we ship passes a task-level evaluation harness built from your own historical cases before it
              touches a production queue. It is the step most teams skip, and the reason their pilots stall.
            </p>
          </div>
        </section>

        {/* ── Numbers ───────────────────────────────────────────────── */}
        <section className="sec-sm">
          <div className="shell-wide">
            <ul className="nums">
              {NUMBERS.map(([n, l], i) => (
                <li key={l} data-r style={{ '--rd': `${i * 90}ms` }}>
                  <span className="num">{n}</span>
                  <span className="mono">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Process ───────────────────────────────────────────────── */}
        <section className="sec">
          <div className="shell">
            <header className="sec-h" data-r>
              <p className="mono">How it runs</p>
              <h2 className="d2">Discover. Scope. Build. Hand over.</h2>
            </header>

            <ol className="proc">
              {[
                ['Discover', 'A structured audit of the workflow, the data behind it, and what a win measurably looks like.'],
                ['Scope', 'A fixed scope and estimate built from your requirement. There is no rate card.'],
                ['Build', 'Weekly increments, with evaluation gates before anything reaches production.'],
                ['Hand over', 'Your code, your documentation, your trained team — with managed operations if you want it.'],
              ].map(([t, b], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 70}ms` }}>
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

        {/* ── Close ─────────────────────────────────────────────────── */}
        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/deep-field.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>
              Tell us the workflow that is eating your week.
            </h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              Thirty minutes with an engineer. You will leave with a straight answer on whether AI helps here — even if
              that answer is no.
            </p>
            <div data-r style={{ '--rd': '160ms' }} className="close-cta">
              <Link href="/contact" className="btn">
                Start a project <Chevron />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
