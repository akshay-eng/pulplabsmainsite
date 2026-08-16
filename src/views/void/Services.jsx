'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import CapCard from '@/components/void/CapCard'
import { byParent } from '@/data/capabilities'
import CategoryPicker from '@/components/void/CategoryPicker'
import { allSolutions } from '@/data/capabilities'

const CAT = [
  { id: 'advisory', n: '01', art: 'adv-board', alt: 'An assessment report: a workflow map with high-payback steps ringed, an opportunity scoring table, a readiness heatmap and effort estimates.', more: ['/services/advisory', 'How we run an assessment'], k: 'Advisory & strategy', t: 'Find out where AI pays back — and where it does not.',
    b: 'We map your workflows, the data behind them and the constraints around them before anyone writes code. You get a written view of what is worth automating, what is not, and what has to change first.',
    tracks: [
      ['AI readiness assessment', 'Artefact 01', 'Where you actually are, not where a vendor says you are.', 'readiness'],
      ['Use-case discovery', 'Artefact 02', 'Ranked by payback, not by novelty — with a do-not-automate list.', 'discovery'],
      ['Adoption roadmap', 'Artefact 03', 'Sequenced so each phase funds the next, with an abandon condition.', 'roadmap'],
      ['Governance & risk', 'Artefact 04', 'The framework your auditors will ask for, written for your risk function.', 'governance'],
    ] },
  { id: 'accelerators', n: '02', k: 'Enterprise accelerators', t: 'Four systems for IT operations, already built.',
    b: 'Production-tested and deployed inside your estate rather than as multi-tenant SaaS, integrated with the ITSM and CMDB you already run. Your data does not leave your boundary for us to operate them.',
    items: [['Incident Intelligence', 'Triage, correlation and suggested remediation on your live queue.'], ['Change Copilot', 'Risk scoring and change-record drafting against your CAB rules.'], ['Patch Orchestrator', 'Sequencing with rollback paths, around your maintenance windows.'], ['Agent Migration', 'RPA and legacy bots onto modern runtimes, audit trail intact.']] },
  { id: 'small-business', n: '03', k: 'Small business systems', t: 'Live in about four weeks.',
    b: 'Growth and operations systems for small teams, tuned monthly. Every one keeps a human approval step you control — nothing sends or commits on your behalf unless you decide it should.',
    items: [['Lead Engine', 'Enquiries answered and qualified around the clock.'], ['Support Desk', 'First-line resolution with escalation you define.'], ['Marketing Studio', 'Campaign drafting against your own positioning.'], ['Social Autopilot', 'Scheduled, on-brand, always reviewable.']] },
  { id: 'enablement', n: '04', photo: 'enablement-workshops', alt: 'An instructor working through a build alongside a cohort at their laptops.', more: ['/services/enablement', 'Platforms, formats and curricula'], k: 'Enablement & workshops', t: 'Capability transfer, not a training day.',
    b: 'Certified instructors across Claude, OpenAI, Copilot Studio and IBM watsonx Orchestrate. Every session runs on your workflows and your data. Each cohort leaves with something in production.',
    tracks: [
      ['Executive briefing', 'One day', 'For the people who approve the budget. One working artefact by the end.', 'one-day'],
      ['Builder bootcamp', 'Three days', 'Hands-on for the people who ship. Agents, tools and evaluation.', 'three-day'],
      ['Embedded enablement', 'One week', 'Alongside your team on live work, taking one workflow into production.', 'one-week'],
      ['Custom cohort', 'Scoped', 'Mixed platforms, a regulated estate, or roles split across separate tracks.', 'custom'],
    ] },
  { id: 'managed', n: '05', more: ['/services/managed', 'How we run it after handover'], k: 'Managed operations', t: 'We run what we build.',
    b: 'Monitoring, evaluation and tuning for as long as you want us. Handover is real — your code, your documentation, your trained team — and staying on is your option, not a dependency we engineer in.',
    tracks: [
      ['Monitoring & alerting', 'Ongoing', 'On the behaviour that matters, not just uptime — quality, refusals and drift.', 'monitoring', 'mo-monitoring'],
      ['Evaluation harnesses', 'Ongoing', 'Re-scored as your estate changes, so a passing suite still means something.', 'evaluation', 'mo-evaluation'],
      ['Model & prompt tuning', 'On change', 'Regression-checked before it ships, never tuned straight into production.', 'tuning', 'mo-tuning'],
      ['Quarterly review', 'Quarterly', 'What it saved, in your numbers — including the quarters where the answer is not much.', 'review', 'mo-review'],
    ] },
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

        {/* The spine. Five ways to engage is the top-level abstraction —
            everything else on this page is a way of narrowing inside two of
            them, so it has to come first and read as an index. */}
        <section className="sec-sm">
          <div className="shell">
            <header className="sec-head" data-r>
              <p className="mono step-k">Step one</p>
              <h2 className="d3">How we engage.</h2>
              <p className="lede measure-w">
                Five practice areas. Two of them come with a catalogue of systems; the other three are the work
                around it. Open one to see what is inside.
              </p>
            </header>
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
                        {c.tracks && (
                          <ul className="tracks">
                            {c.tracks.map(([t, len, d, f, art], j) => (
                              <li key={t} data-r style={{ '--rd': `${j * 60}ms` }}>
                                <Link href={`${c.more[0]}#${f}`} className="track" data-art={art || undefined}>
                                  {/* Optional: advisory and enablement tracks are
                                      routes, managed ones are things with a face. */}
                                  {art && (
                                    <span className="track-art" aria-hidden="true">
                                      <img src={`/void/managed/${art}.webp`} alt="" loading="lazy" decoding="async" />
                                    </span>
                                  )}
                                  <span className="track-top">
                                    <span className="h4">{t}</span>
                                    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                                      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4"
                                        fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </span>
                                  <span className="body track-d">{d}</span>
                                  <span className="mono track-l">{len}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                        {byParent(c.id).length ? (
                          <ul className="caps">
                            {byParent(c.id).map((cap, j) => <CapCard key={cap.slug} cap={cap} i={j} />)}
                          </ul>
                        ) : c.items ? (
                          <ul className="cat-items">
                            {c.items.map(([t, d]) => (
                              <li key={t}>
                                <span className="h4">{t}</span>
                                <span className="body">{d}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {/* Advisory and enablement are people work. A diagram
                            would misrepresent what those engagements are. */}
                        {(c.photo || c.art) && (
                          <figure className={`cat-photo${c.art ? ' is-art' : ''}`}>
                            <img src={`/void/${c.photo ?? c.art}.webp`} alt={c.alt} loading="lazy" decoding="async" />
                          </figure>
                        )}
                        {c.more && (
                          <Link href={c.more[0]} className="cat-more">
                            {c.more[1]}
                            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                              <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                                strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
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
                {allSolutions.length} systems sit inside <strong>Enterprise accelerators</strong> and{' '}
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
