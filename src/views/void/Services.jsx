'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import CapCard from '@/components/void/CapCard'
import CategoryPicker from '@/components/void/CategoryPicker'
import { catalogue } from '@/data/capabilities'

/* Four practice areas. Enterprise accelerators and small business systems
 * were the same practice sold to two buyer sizes, so they are one now.
 *
 * Every area is a band: the claim on the left, its parts on the right, all on
 * one grid. Nothing collapses and nothing is indented differently from its
 * neighbour — the accordion hid content, and the pass after it left the two
 * rows on different margins.
 *
 * `accent` tints the rule and the label only. Saturated colour is reserved for
 * the two flagship products; three neon plates competing on one page made the
 * page louder without making it clearer. */
const AREAS = [
  {
    id: 'build', art: 'pa-build', n: '01', k: 'Systems we build', accent: '56, 189, 248',
    t: 'Production-tested, and deployed inside your estate.',
    b: 'Accelerators for IT operations and growth systems for smaller teams — the same practice, sized to the estate. Everything runs inside your boundary rather than as multi-tenant SaaS, wired to the systems you already own, and every irreversible action waits for a named human.',
    href: '/services#catalogue', cta: 'Browse all systems',
    examples: ['incident-intelligence', 'lead-engine'],
  },
  {
    id: 'advisory', art: 'pa-advisory', n: '02', k: 'Advisory & strategy', accent: '251, 146, 60',
    t: 'Find out where AI pays back — and where it does not.',
    b: 'Four weeks, four artefacts, one answer. We map the workflow as it actually runs, cost every step in hours and error rate, and rank what is worth automating against what is not — including the row that says do not automate this.',
    href: '/services/advisory', cta: 'How an assessment runs',
    items: [
      ['AI readiness assessment', 'Artefact 01', 'Where you actually are, not where a vendor says you are.', '/services/advisory#readiness'],
      ['Use-case discovery', 'Artefact 02', 'Ranked by payback, with an explicit do-not-automate list.', '/services/advisory#discovery'],
      ['Adoption roadmap', 'Artefact 03', 'Sequenced so each phase funds the next, with an abandon condition.', '/services/advisory#roadmap'],
      ['Governance & risk', 'Artefact 04', 'The framework your auditors will ask for, written for your risk function.', '/services/advisory#governance'],
    ],
  },
  {
    id: 'enablement', art: 'pa-enablement', n: '03', k: 'Enablement & workshops', accent: '167, 139, 250',
    t: 'Capability transfer, not a training day.',
    b: 'Certified instruction across Claude, Codex, Copilot, Gemini and watsonx Orchestrate, in three fixed lengths plus custom. Every session runs on your workflows and your data rather than a generic exercise, and every cohort leaves with something in production.',
    href: '/services/enablement', cta: 'Platforms and curricula',
    items: [
      ['Executive briefing', 'One day', 'For the people who approve the budget. One working artefact by the end.', '/services/enablement#one-day'],
      ['Builder bootcamp', 'Three days', 'Hands-on for the people who ship. Agents, tools and evaluation.', '/services/enablement#three-day'],
      ['Embedded enablement', 'One week', 'Alongside your team on live work, taking one workflow into production.', '/services/enablement#one-week'],
      ['Custom cohort', 'Scoped', 'Mixed platforms, a regulated estate, or roles split across separate tracks.', '/services/enablement#custom'],
    ],
  },
  {
    id: 'managed', art: 'pa-managed', n: '04', k: 'Managed operations', accent: '52, 211, 153',
    t: 'We run what we build.',
    b: 'Monitoring on behaviour rather than uptime, evaluation sets re-scored as your estate changes, and tuning that ships behind a flag. Handover happens first — staying on afterwards is your option, not a dependency we engineer in.',
    href: '/services/managed', cta: 'How we run it after handover',
    items: [
      ['Monitoring & alerting', 'Ongoing', 'On the behaviour that matters — quality, refusals and drift, not uptime.', '/services/managed#monitoring'],
      ['Evaluation harnesses', 'Ongoing', 'Re-scored as your estate changes, so a passing suite still means something.', '/services/managed#evaluation'],
      ['Model & prompt tuning', 'On change', 'Regression-checked and shipped behind a flag, never straight to production.', '/services/managed#tuning'],
      ['Quarterly review', 'Quarterly', 'What it saved, in your numbers — including the quarters where it is not much.', '/services/managed#review'],
    ],
  },
]

export default function Services() {

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
            <h1 className="d1 phead-h">Everything we build.</h1>
            <p className="lede phead-l">
              No fixed menus. No rate cards. Every engagement starts with discovery, and the scope, timeline and
              estimate come out of what your business actually needs.
            </p>
          </div>
        </section>

        {/* The spine. Five ways to engage is the top-level abstraction —
            everything else on this page is a way of narrowing inside two of
            them, so it has to come first and read as an index. */}
        <section className="sec-sm">
          <div className="shell">
            <header className="sec-head" data-r>
              <p className="mono step-k">Step one</p>
              <h2 className="d3">How we engage.</h2>
              <p className="lede measure-w">
                Four practice areas. One builds and runs the systems; the other three are the work around it —
                deciding what to build, teaching your team, and keeping it honest afterwards.
              </p>
            </header>
            <ul className="areas">
              {AREAS.map((a, i) => (
                <li key={a.id} data-r style={{ '--rd': `${i * 60}ms`, '--accent': a.accent }}>
                  <span className="area-bg" aria-hidden="true">
                    <img src={`/void/${a.art}.webp`} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="area-ghost" aria-hidden="true">{a.n}</span>

                  <div className="area-copy">
                    <p className="mono area-n">{a.n}</p>
                    <p className="mono area-k">{a.k}</p>
                    <h3 className="area-t">{a.t}</h3>
                    <p className="body area-b">{a.b}</p>
                    <Link href={a.href} className="area-cta">
                      {a.cta}
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>

                  {a.examples ? (
                    <ul className="area-eg">
                      {a.examples.map((slug, j) => {
                        const cap = catalogue.find((c) => c.slug === slug)
                        return cap ? <CapCard key={slug} cap={cap} i={j} /> : null
                      })}
                      <li className="area-all">
                        <a href="#catalogue" className="area-all-in">
                          <span className="area-all-n">{catalogue.length}</span>
                          <span className="body">systems in total, across six teams and six sectors.</span>
                          <span className="area-all-cta">
                            View them all
                            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none"
                                strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </a>
                      </li>
                    </ul>
                  ) : (
                    <ul className="area-items">
                      {a.items.map(([t, tag, d, href]) => (
                        <li key={t}>
                          <Link href={href}>
                            <span className="area-i-top">
                              <span className="area-i-t">{t}</span>
                              <span className="mono area-i-tag">{tag}</span>
                            </span>
                            <span className="body area-i-d">{d}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Step two: only two of the five contain a catalogue, so this is
            explicitly scoped to them rather than presented as a peer. */}
        <section className="sec-sm finder-sec" id="catalogue">
          <div className="shell">
            <header className="sec-head" data-r>
              <p className="mono step-k">Step two</p>
              <h2 className="d3">Find the system you need.</h2>
              <p className="lede measure-w">
                {catalogue.length} systems sit inside <strong>Enterprise accelerators</strong> and{' '}
                <strong>Small business systems</strong>. Pick the team that would use one, or the sector you are
                in — whichever you know first — and you will get just the ones that apply.
              </p>
            </header>
            <CategoryPicker />
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
        <NextPage
          href="/team"
          title="Team"
        />
      </main>

      <Footer />
    </div>
  )
}
