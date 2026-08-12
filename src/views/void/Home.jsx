'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import LoopVideo from '@/components/void/LoopVideo'
import { useScrollProgress } from '@/lib/apple-motion'


const COUNTS = [
  ['8+', 'accelerators'],
  ['4', 'certifications'],
  ['6', 'people'],
]

/* Capability names, looped. Not client logos — inventing those would put
   claimed customers on a live site. The two real client names stay in the
   trust strip above. */
const CAPABILITIES = [
  'Incident Intelligence',
  'Change Copilot',
  'Patch Orchestrator',
  'Agent Migration',
  'Lead Engine',
  'Support Desk',
  'Marketing Studio',
  'Social Autopilot',
]

const TELEMETRY = [
  ['4×', 'Faster quote turnaround'],
  ['4', 'Weeks to first system live'],
  ['8+', 'Accelerators in production'],
  ['4', 'Platform certifications'],
]


const STEPS = [
  ['Discover', 'A structured audit of the workflow, the data behind it, and what a win would measurably look like.'],
  ['Scope & propose', 'A fixed scope, timeline and estimate built from your requirement — not a rate card.'],
  ['Build & evaluate', 'Weekly increments, with evaluation gates before anything touches production.'],
  ['Hand over', 'Your code, your documentation, your trained team — with managed ops if you want it.'],
]

const VOICES = [
  [
    'Quotes that took our team two days now go out in twenty minutes. The PulpLabs team understood our pricing rules better than some of our own hires.',
    'Name Surname',
    'Director, Power & Pack Solutions',
  ],
  [
    'Our researchers stopped tagging transcripts and started interpreting them. The coding framework is still ours — the machine just keeps up with it now.',
    'Name Surname',
    'Principal, Urban Ethnographers',
  ],
]



export default function Home() {
  const plate = useScrollProgress()

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
              <Link href="#contact" className="btn">
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

          {/* What we ship, on a loop */}
          <div className="marq" aria-hidden="true">
            <div className="marq-track">
              {[0, 1].map((copy) => (
                <div className="marq-group" key={copy}>
                  {CAPABILITIES.map((c) => (
                    <span className="marq-item" key={c}>
                      {c}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Measured outcomes ────────────────────────────────────────── */}
        <section className="sec" ref={plate}>
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">Measured outcomes</p>
              <h2 className="d2">
                We ship against numbers, <span className="dim">not adjectives.</span>
              </h2>
            </header>

            <div className="tel" data-r>
              <div className="tel-img" aria-hidden="true">
                <img src="/void/aperture-glow.webp" alt="" loading="lazy" decoding="async" />
              </div>

              <div className="tel-head">
                <span className="mono tel-live">
                  <span className="tel-pip" />
                  Live estate telemetry
                </span>
                <span className="mono">Aggregate · 8 deployments</span>
              </div>

              <div className="tel-body">
                <article className="tel-lead">
                  <span className="tel-n">−38%</span>
                  <p className="mono">Mean time to resolution</p>
                  <p className="body">
                    Incident Intelligence triages and correlates against your live queue, so the first responder opens
                    with context instead of a blank search box.
                  </p>
                </article>

                <ul className="tel-grid">
                  {TELEMETRY.map(([n, l]) => (
                    <li key={l}>
                      <span className="tel-n sm">{n}</span>
                      <span className="mono">{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="flow">
        {/* ── How we engage ────────────────────────────────────────────── */}
        <section className="sec">
          <div className="shell">
            <header className="sec-h" data-r>
              <p className="mono">How we engage</p>
              <h2 className="d2">
                Discover. Build. <span className="dim">Hand over.</span>
              </h2>
            </header>

            <ol className="proc">
              {STEPS.map(([t, b], i) => (
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

        {/* ── Voices ───────────────────────────────────────────────────── */}
        <section className="sec-sm">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">What clients say</p>
            </header>
            <ul className="voices">
              {VOICES.map(([q, name, org], i) => (
                <li key={org} data-r style={{ '--rd': `${i * 80}ms` }}>
                  <p className="d3 voice-q">“{q}”</p>
                  <p className="mono">
                    {name} · {org}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

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

