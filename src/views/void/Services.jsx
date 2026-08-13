'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import CapCard from '@/components/void/CapCard'
import { byParent } from '@/data/capabilities'

const CAT = [
  { id: 'advisory', n: '01', photo: 'advisory-strategy', alt: 'Consultants mapping a workflow on a glass wall during a discovery session.', k: 'Advisory & strategy', t: 'Find out where AI pays back — and where it does not.',
    b: 'We map your workflows, the data behind them and the constraints around them before anyone writes code. You get a written view of what is worth automating, what is not, and what has to change first.',
    items: [['AI readiness assessment', 'Where you actually are, not where a vendor says you are.'], ['Use-case discovery', 'Ranked by payback, not by novelty.'], ['Adoption roadmap', 'Sequenced so each phase funds the next.'], ['Governance & risk', 'The framework your auditors will ask for.']] },
  { id: 'accelerators', n: '02', k: 'Enterprise accelerators', t: 'Four systems for IT operations, already built.',
    b: 'Production-tested and deployed inside your estate rather than as multi-tenant SaaS, integrated with the ITSM and CMDB you already run. Your data does not leave your boundary for us to operate them.',
    items: [['Incident Intelligence', 'Triage, correlation and suggested remediation on your live queue.'], ['Change Copilot', 'Risk scoring and change-record drafting against your CAB rules.'], ['Patch Orchestrator', 'Sequencing with rollback paths, around your maintenance windows.'], ['Agent Migration', 'RPA and legacy bots onto modern runtimes, audit trail intact.']] },
  { id: 'small-business', n: '03', k: 'Small business systems', t: 'Live in about four weeks.',
    b: 'Growth and operations systems for small teams, tuned monthly. Every one keeps a human approval step you control — nothing sends or commits on your behalf unless you decide it should.',
    items: [['Lead Engine', 'Enquiries answered and qualified around the clock.'], ['Support Desk', 'First-line resolution with escalation you define.'], ['Marketing Studio', 'Campaign drafting against your own positioning.'], ['Social Autopilot', 'Scheduled, on-brand, always reviewable.']] },
  { id: 'enablement', n: '04', photo: 'enablement-workshops', alt: 'An instructor working through a build alongside a cohort at their laptops.', k: 'Enablement & workshops', t: 'Capability transfer, not a training day.',
    b: 'Certified instructors across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate. Every session runs on your workflows and your data. Each cohort leaves with something in production.',
    items: [['Executive briefing', 'Half a day, for the people who approve the budget.'], ['Builder bootcamp', 'Two days, hands-on for the people who ship.'], ['Embedded enablement', 'Six weeks alongside your team, on live work.']] },
  { id: 'managed', n: '05', k: 'Managed operations', t: 'We run what we build.',
    b: 'Monitoring, evaluation and tuning for as long as you want us. Handover is real — your code, your documentation, your trained team — and staying on is your option, not a dependency we engineer in.',
    items: [['Monitoring & alerting', 'On the behaviour that matters, not just uptime.'], ['Evaluation harnesses', 'Re-scored as your estate changes.'], ['Model & prompt tuning', 'Regression-checked before it ships.'], ['Quarterly review', 'What it saved, in your numbers.']] },
]

export default function Services() {
  const [open, setOpen] = useState('accelerators')

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

        <section className="sec-sm">
          <div className="shell">
            <ul className="cat">
              {CAT.map((c, i) => {
                const isOpen = open === c.id
                return (
                  <li key={c.id} className="cat-row" data-open={isOpen || undefined} data-r style={{ '--rd': `${i * 50}ms` }}>
                    <h2>
                      <button type="button" className="cat-btn" aria-expanded={isOpen} aria-controls={`p-${c.id}`}
                        onClick={() => setOpen(isOpen ? null : c.id)}>
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
                        {/* Advisory and enablement are people work. A diagram
                            would misrepresent what those engagements are. */}
                        {c.photo && (
                          <figure className="cat-photo">
                            <img src={`/void/${c.photo}.webp`} alt={c.alt} loading="lazy" decoding="async" />
                          </figure>
                        )}
                        {byParent(c.id).length ? (
                          <ul className="caps">
                            {byParent(c.id).map((cap, j) => <CapCard key={cap.slug} cap={cap} i={j} />)}
                          </ul>
                        ) : (
                          <ul className="cat-items">
                            {c.items.map(([t, d]) => (
                              <li key={t}>
                                <span className="h4">{t}</span>
                                <span className="body">{d}</span>
                              </li>
                            ))}
                          </ul>
                        )}
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
        <NextPage
          href="/team"
          title="Team"
        />
      </main>

      <Footer />
    </div>
  )
}
