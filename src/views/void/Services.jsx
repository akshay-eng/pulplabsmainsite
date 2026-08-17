'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import CapCard from '@/components/void/CapCard'
import CategoryPicker from '@/components/void/CategoryPicker'
import { catalogue } from '@/data/capabilities'

/* Four practice areas, not five: enterprise accelerators and small business
 * systems were the same practice sold to two buyer sizes, and splitting them
 * made a visitor pick a category before they had picked a problem.
 *
 * BUILD is rendered as a featured band because it is the one that carries a
 * catalogue — the other three are the work around it, which is what the
 * section header has always said. Nothing collapses: an accordion that shuts
 * the panel you were reading in order to open another is a control fighting
 * its own content. */
const BUILD = {
  k: 'Systems we build',
  t: 'Production-tested, and deployed inside your estate.',
  b: 'Accelerators for IT operations and growth systems for smaller teams — the same practice, sized to the estate. Everything runs inside your boundary rather than as multi-tenant SaaS, wired to the systems you already own, and every irreversible action waits for a named human.',
  examples: ['incident-intelligence', 'lead-engine'],
}

const PRACTICES = [
  { id: 'advisory', n: '02', k: 'Advisory & strategy', t: 'Find out where AI pays back — and where it does not.',
    tone: 'amber', art: 'pa-advisory', href: '/services/advisory', cta: 'How an assessment runs',
    b: 'Four weeks, four artefacts, one answer. We map the workflow as it actually runs, cost every step in hours and error rate, and rank what is worth automating against what is not — including the row that says do not automate this.',
    items: ['AI readiness assessment', 'Use-case discovery, ranked by payback', 'Adoption roadmap with an abandon condition', 'Governance & risk framework'] },
  { id: 'enablement', n: '03', k: 'Enablement & workshops', t: 'Capability transfer, not a training day.',
    tone: 'violet', art: 'pa-enablement', href: '/services/enablement', cta: 'Platforms and curricula',
    b: 'Certified instruction across five platforms in three fixed lengths, plus custom. Every session runs on your workflows and your data rather than a generic exercise, and every cohort leaves with something in production.',
    items: ['Claude, Codex, Copilot, Gemini, watsonx', 'One-day, three-day and one-week cohorts', 'On-site, online or hybrid', 'Each cohort ships something'] },
  { id: 'managed', n: '04', k: 'Managed operations', t: 'We run what we build.',
    tone: 'green', art: 'pa-managed', href: '/services/managed', cta: 'How we run it after handover',
    b: 'Monitoring on behaviour rather than uptime, evaluation sets re-scored as your estate changes, and tuning that ships behind a flag. Handover happens first — staying on is your option, not a dependency we engineer in.',
    items: ['Monitoring on behaviour, not uptime', 'Evaluation harnesses, re-scored', 'Tuning behind a flag', 'Quarterly review in your numbers'] },
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
            <div className="pa-lead">
              <p className="mono pa-n">01</p>
              <div className="pa-lead-copy">
                <h3 className="d3">{BUILD.k}</h3>
                <p className="body">{BUILD.b}</p>
              </div>
            </div>

            <ul className="caps pa-eg">
              {BUILD.examples.map((slug, j) => {
                const cap = catalogue.find((c) => c.slug === slug)
                return cap ? <CapCard key={slug} cap={cap} i={j} /> : null
              })}
              <li className="pa-more" data-r style={{ '--rd': '120ms' }}>
                <a href="#catalogue" className="pa-more-in">
                  <span className="pa-more-n">{catalogue.length}</span>
                  <span className="body">systems in total, across six teams and six sectors.</span>
                  <span className="pa-more-cta">
                    View them all
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </li>
            </ul>

            <ul className="pa-rest">
              {PRACTICES.map((c, i) => (
                <li key={c.id} data-r style={{ '--rd': `${i * 70}ms` }} data-tone={c.tone}>
                  <span className="pa-art" aria-hidden="true">
                    <img src={`/void/${c.art}.webp`} alt="" loading="lazy" decoding="async" />
                  </span>
                  <p className="mono pa-n">{c.n}</p>
                  <p className="mono pa-k">{c.k}</p>
                  <h3 className="pa-t">{c.t}</h3>
                  <p className="body pa-b">{c.b}</p>
                  <ul className="pa-items">
                    {c.items.map((t) => (
                      <li key={t}>
                        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                          <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.6" fill="none"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={c.href} className="cat-more">
                    {c.cta}
                    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
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
