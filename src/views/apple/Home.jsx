'use client'

import Link from 'next/link'
import Nav from '@/components/apple/Nav'
import Footer from '@/components/apple/Footer'
import Chevron from '@/components/apple/Chevron'
import { useScrollProgress } from '@/lib/apple-motion'

const PRACTICES = [
  {
    k: 'Advisory',
    t: 'Know where AI pays back.',
    b: 'We map your workflows, data and constraints before anyone writes code — and tell you where it does not pay back.',
  },
  {
    k: 'Accelerators',
    t: 'Four systems, already built.',
    b: 'Incident Intelligence, Change Copilot, Patch Orchestrator, Agent Migration. Deployed inside your estate, wired to your ITSM.',
  },
  {
    k: 'Small business',
    t: 'Live in about four weeks.',
    b: 'Lead Engine, Support Desk, Marketing Studio, Social Autopilot. Tuned monthly. You keep the approval step.',
  },
  {
    k: 'Enablement',
    t: 'Your team, not our slides.',
    b: 'Certified across Claude, OpenAI, Copilot Studio and watsonx. Every session runs on your workflows and your data.',
  },
  {
    k: 'Managed operations',
    t: 'We stay after the pilot.',
    b: 'Monitoring, evaluation and tuning for as long as you want us. The thing we build does not become your problem.',
  },
]

const STEPS = [
  ['Discover', 'A structured audit of the workflow, the data behind it, and what a win measurably looks like.'],
  ['Scope', 'A fixed scope and estimate built from your requirement. No rate card.'],
  ['Build', 'Weekly increments, with evaluation gates before anything touches production.'],
  ['Hand over', 'Your code, your documentation, your trained team.'],
]

export default function Home() {
  // Drives the counter-scroll on the statement section via --p
  const statement = useScrollProgress()

  return (
    <>
      <Nav />

      <main id="main">
        {/* ── Hero ────────────────────────────────────────────────────────
            Nothing above the headline. No badge, no eyebrow, no chrome — the
            first thing on the page is the sentence that matters. */}
        <section className="hero">
          <div className="u-shell">
            <h1 className="t-display hero-h">
              Get to the pulp of what
              <br />
              your business needs
              <br />
              <span className="t-accent">from AI.</span>
            </h1>

            <p className="t-lede hero-l">
              An AI consultancy and engineering firm. Accelerators for enterprise operations, growth systems for small
              teams, and the enablement that makes either one stick.
            </p>

            <div className="hero-cta">
              <Link href="/contact" className="btn">
                Book a 30-minute call
              </Link>
              <Link href="/services" className="link">
                See what we build <Chevron />
              </Link>
            </div>
          </div>

          {/* A single hairline that draws itself down into the page — the only
              decoration in the hero, and it points where to go next. */}
          <span className="hero-rule" aria-hidden="true" />
        </section>

        {/* ── Statement ───────────────────────────────────────────────────
            One dark plane, one sentence, one number. The counter-scroll is
            tied to scroll position rather than a timer, so the movement is
            the reader's own — they can stop it, reverse it, control it. */}
        <section className="statement is-dark" ref={statement}>
          <div className="u-shell">
            <p className="t-eyebrow">Measured, not claimed</p>
            <h2 className="t-headline statement-h">
              Mean time to resolution,
              <br />
              down <span className="t-accent">38%</span>.
            </h2>
            <p className="t-body u-measure-wide statement-b">
              Incident Intelligence triages and correlates against your live queue, so the first responder opens with
              context instead of a blank search box. Eight accelerators are in production today.
            </p>
          </div>
        </section>

        {/* ── Practices ───────────────────────────────────────────────── */}
        <section className="sec">
          <div className="u-shell-wide">
            <header className="sec-head" data-r>
              <h2 className="t-headline">Five practice areas.</h2>
              <p className="t-lede u-measure-wide">
                No fixed menus and no rate cards. Every engagement is scoped from discovery.
              </p>
            </header>

            <ul className="practices">
              {PRACTICES.map((p, i) => (
                <li key={p.k} className="practice" data-r style={{ '--rd': `${i * 60}ms` }}>
                  <p className="t-eyebrow">{p.k}</p>
                  <h3 className="t-title">{p.t}</h3>
                  <p className="t-body">{p.b}</p>
                </li>
              ))}
              <li className="practice practice-cta" data-r style={{ '--rd': `${PRACTICES.length * 60}ms` }}>
                <h3 className="t-title">Not sure which fits?</h3>
                <p className="t-body">Thirty minutes with an engineer. You will leave with a straight answer.</p>
                <Link href="/contact" className="link">
                  Book a call <Chevron />
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* ── Process ─────────────────────────────────────────────────── */}
        <section className="sec sec-alt">
          <div className="u-shell">
            <header className="sec-head" data-r>
              <h2 className="t-headline">How an engagement runs.</h2>
            </header>

            <ol className="steps">
              {STEPS.map(([t, b], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 70}ms` }}>
                  <span className="steps-n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="t-title">{t}</h3>
                    <p className="t-body">{b}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="t-caption steps-note" data-r>
              The evaluation gate is the step people skip. It is also the reason incident bots ship confident and wrong.
            </p>
          </div>
        </section>

        {/* ── Close ───────────────────────────────────────────────────── */}
        <section className="sec close">
          <div className="u-shell u-center">
            <h2 className="t-headline u-measure" data-r>
              Tell us the workflow that is eating your week.
            </h2>
            <p className="t-lede u-measure-wide close-l" data-r style={{ '--rd': '80ms' }}>
              No deck. You will get a straight answer on whether AI helps here — even if the answer is no.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">
                Start the conversation
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
