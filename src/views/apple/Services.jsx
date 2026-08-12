'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/apple/Nav'
import Footer from '@/components/apple/Footer'
import Chevron from '@/components/apple/Chevron'

const CATALOGUE = [
  {
    id: 'advisory',
    k: 'Advisory & strategy',
    t: 'Find out where AI pays back — and where it does not.',
    b: 'We map your workflows, the data behind them and the constraints around them before anyone writes code. You get a written view of what is worth automating, what is not, and what has to change first.',
    items: ['AI readiness assessment', 'Use-case discovery', 'Adoption roadmap', 'Governance & risk framework'],
  },
  {
    id: 'accelerators',
    k: 'Enterprise accelerators',
    t: 'Four systems for IT operations, already built.',
    b: 'Production-tested and deployed inside your estate rather than as multi-tenant SaaS, integrated with the ITSM and CMDB you already run. Your data does not leave your boundary for us to operate them.',
    items: [
      ['Incident Intelligence', 'Triage, correlation and suggested remediation on your live queue.'],
      ['Change Copilot', 'Risk scoring and change-record drafting against your CAB rules.'],
      ['Patch Orchestrator', 'Patch sequencing with rollback paths, around your maintenance windows.'],
      ['Agent Migration', 'Moving RPA flows onto agents without breaking the audit trail.'],
    ],
  },
  {
    id: 'small-business',
    k: 'Small business solutions',
    t: 'Live in about four weeks.',
    b: 'Growth and operations systems for small teams, tuned monthly. Every one of them keeps a human approval step that you control — nothing sends or commits on your behalf unless you decide it should.',
    items: ['Lead Engine', 'Support Desk', 'Marketing Studio', 'Social Autopilot'],
  },
  {
    id: 'enablement',
    k: 'Enablement & workshops',
    t: 'Capability transfer, not a training day.',
    b: 'Certified instructors across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate. Every session runs on your workflows and your data, not a generic exercise. Each cohort leaves with something in production.',
    items: [
      ['Executive briefing', 'Half a day, for the people who approve the budget.'],
      ['Builder bootcamp', 'Two days, hands-on for the people who ship.'],
      ['Embedded enablement', 'Six weeks alongside your team, on live work.'],
    ],
  },
  {
    id: 'managed',
    k: 'Managed AI operations',
    t: 'We run what we build.',
    b: 'Monitoring, evaluation and tuning for as long as you want us. Handover is real — your code, your documentation, your trained team — and staying on is your option, not a dependency we engineer in.',
    items: ['Monitoring & alerting', 'Evaluation harnesses', 'Model & prompt tuning', 'Quarterly review'],
  },
]

export default function Services() {
  // The catalogue is long. An accordion keeps the whole shape scannable and
  // lets someone open only what they came for.
  const [open, setOpen] = useState('accelerators')

  return (
    <>
      <Nav />

      <main id="main">
        <section className="page-head">
          <div className="u-shell">
            <h1 className="t-display page-h">
              Everything we build,
              <br />
              <span className="t-accent">scoped to you.</span>
            </h1>
            <p className="t-lede page-l">
              No fixed menus. No rate cards. Every engagement starts with discovery, and the scope, timeline and
              estimate are built from what your business actually needs.
            </p>
          </div>
        </section>

        <section className="sec-tight">
          <div className="u-shell">
            <ul className="cat">
              {CATALOGUE.map((c, i) => {
                const isOpen = open === c.id
                return (
                  <li key={c.id} className="cat-row" data-open={isOpen || undefined} data-r style={{ '--rd': `${i * 50}ms` }}>
                    <h2>
                      <button
                        type="button"
                        className="cat-trigger"
                        aria-expanded={isOpen}
                        aria-controls={`panel-${c.id}`}
                        onClick={() => setOpen(isOpen ? null : c.id)}
                      >
                        <span className="cat-k t-eyebrow">{c.k}</span>
                        <span className="cat-t">{c.t}</span>
                        <span className="cat-sign" aria-hidden="true">
                          <span />
                          <span />
                        </span>
                      </button>
                    </h2>

                    {/* height is the one property allowed to animate here —
                        there is no transform equivalent for an accordion. */}
                    <div className="cat-panel" id={`panel-${c.id}`} role="region" hidden={!isOpen}>
                      <div className="cat-panel-in">
                        <p className="t-body cat-b">{c.b}</p>

                        <ul className="cat-items">
                          {c.items.map((it) =>
                            Array.isArray(it) ? (
                              <li key={it[0]}>
                                <span className="cat-item-t">{it[0]}</span>
                                <span className="t-caption">{it[1]}</span>
                              </li>
                            ) : (
                              <li key={it}>
                                <span className="cat-item-t">{it}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <section className="sec is-dark">
          <div className="u-shell u-center">
            <h2 className="t-headline u-measure" data-r>
              Pricing comes out of discovery.
            </h2>
            <p className="t-body u-measure-wide close-l" data-r style={{ '--rd': '80ms' }}>
              There is no price list, because the answer depends on scope, estate size and whether you want us to keep
              running it. Engagements start with a paid discovery that produces a written scope with success criteria —
              so you know what you are buying before you buy it.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">
                Get a scope <Chevron />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
