'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import Chevron from '@/components/apple/Chevron'
import FieldStage from '@/components/void/FieldStage'
import LoopVideo from '@/components/void/LoopVideo'
import { useScrollProgress } from '@/lib/apple-motion'

const CHIPS = [
  ['MTTR', '−38%'],
  ['Quotes', '4× faster'],
  ['Certified', '4 platforms'],
]

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

const PRACTICES = [
  ['Advisory & strategy', 'Readiness audits, use-case discovery, roadmap & governance.'],
  ['Enterprise accelerators', 'Incident, change, patch & agent-migration for IT ops.'],
  ['Small business solutions', 'Leads, support, marketing & social — live in ~4 weeks.'],
  ['Enablement & workshops', 'Certified instructors, your workflows, your data.'],
  ['Managed AI operations', 'Monitoring, evals & tuning for as long as you want us.'],
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

const PLATFORMS = ['Certified Claude architects', 'OpenAI', 'Copilot Studio', 'IBM watsonx Orchestrate']

const FORMATS = [
  ['Half day', 'Executive briefing', 'What to fund, what to defer, and what it realistically costs.'],
  ['2 days', 'Builder bootcamp', 'Prompting, tools, agents, evals. Hands on keyboards.'],
  ['6 weeks', 'Embedded enablement', 'We sit with your team until two workflows are in production.'],
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

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
            poster="/void/hero-loop-poster.webp"
            opacity={0.85}
          />
          <FieldStage />

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

            <ul className="chips">
              {CHIPS.map(([k, v], i) => (
                <li key={k} style={{ '--rd': `${300 + i * 90}ms` }}>
                  <span className="mono">{k}</span>
                  <b>{v}</b>
                </li>
              ))}
            </ul>
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

        {/* ── Service catalogue ────────────────────────────────────────── */}
        <section className="sec-sm">
          <div className="shell-wide">
            <header className="sec-h sec-h-row" data-r>
              <div>
                <p className="mono">Service catalogue</p>
                <h2 className="d2">
                  Five practice areas, <span className="dim">zero fixed menus.</span>
                </h2>
              </div>
              <Link href="/services" className="link">
                Full catalogue <Chevron />
              </Link>
            </header>

            <ul className="prac">
              {PRACTICES.map(([t, b], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 55}ms` }}>
                  <span className="mono prac-i">{String(i + 1).padStart(2, '0')}</span>
                  <div className="prac-body">
                    <h3 className="d3">{t}</h3>
                    <p className="body">{b}</p>
                  </div>
                  <Link href="/services" className="link prac-more" aria-label={`More on ${t}`}>
                    <Chevron />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

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

        {/* ── In the room ──────────────────────────────────────────────── */}
        <section className="sec-sm">
          <div className="shell-wide">
            <figure className="photo" data-r>
              <img
                src="/photos/workshop.webp"
                alt="A team working through a system diagram on a whiteboard"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span className="mono">In the room</span>
                Every cohort works on your workflows, at your whiteboard.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── Enablement ───────────────────────────────────────────────── */}
        <section className="sec enable">
          <div className="enable-img" aria-hidden="true">
            <img src="/void/flare-column.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell-wide enable-in">
            <header className="sec-h" data-r>
              <p className="mono">AI enablement</p>
              <h2 className="d2">Capability transfer, not a training day.</h2>
              <p className="lede">
                Certified instructors run sessions on your workflows and your data — not a generic slide deck. Every
                cohort leaves with something in production.
              </p>
            </header>

            <div className="certs" data-r>
              <ul>
                {PLATFORMS.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>

            <ul className="formats">
              {FORMATS.map(([d, t, b], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 70}ms` }}>
                  <span className="mono">{d}</span>
                  <h3 className="d3">{t}</h3>
                  <p className="body">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section className="sec contact-sec" id="contact">
          <LoopVideo className="contact-img" src="/void/hero-loop" poster="/void/hero-loop-poster.webp" opacity={0.55} />
          <div className="shell-wide contact-in">
            <div className="contact-copy" data-r>
              <h2 className="d2">Tell us the workflow that&rsquo;s eating your week.</h2>
              <p className="lede">
                Thirty minutes with an engineer, no deck. You&rsquo;ll leave with a straight answer on whether AI helps
                here — even if that answer is no.
              </p>
              <a className="contact-mail" href="mailto:hello@pulplabs.ai">
                hello@pulplabs.ai
              </a>
            </div>

            <HomeForm />
          </div>
        </section>

        {/* ── Newsletter ───────────────────────────────────────────────── */}
        <section className="sec-sm">
          <div className="shell-wide">
            <div className="news" data-r>
              <div>
                <h2 className="d3">Fresh from the lab, monthly.</h2>
                <p className="body">One email a month on what we shipped, learned and open-sourced. No spam.</p>
              </div>
              <NewsForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* --------------------------------------------------------------------------
   Forms. No backend yet, so both validate and then hand off — the contact
   form to a pre-filled mailto, so the enquiry actually reaches someone rather
   than dying in a fake success state.
   -------------------------------------------------------------------------- */

function HomeForm() {
  const [v, setV] = useState({ name: '', company: '', email: '', problem: '' })
  const [errs, setErrs] = useState({})
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setV((s) => ({ ...s, [k]: e.target.value }))
    if (errs[k]) setErrs((x) => ({ ...x, [k]: undefined }))
  }

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (v.name.trim().length < 2) next.name = 'Please give us a name we can use.'
    if (!EMAIL_RE.test(v.email.trim())) next.email = 'That does not look like a complete email address.'
    if (v.problem.trim().length < 10) next.problem = 'A sentence about the workflow helps us prepare.'
    setErrs(next)
    if (Object.keys(next).length) {
      document.getElementById(Object.keys(next)[0])?.focus()
      return
    }
    setSent(true)
  }

  const mailto = `mailto:hello@pulplabs.ai?subject=${encodeURIComponent(
    `Consultation — ${v.company || v.name}`,
  )}&body=${encodeURIComponent(`Name: ${v.name}\nCompany: ${v.company}\nEmail: ${v.email}\n\n${v.problem}`)}`

  if (sent) {
    return (
      <div className="contact-done" role="status" data-r>
        <h3 className="d3">Almost there, {v.name.split(' ')[0]}.</h3>
        <p className="body">
          This site has no form backend yet, so nothing has been sent. The button below opens a pre-filled email to the
          team, who reply the same working day.
        </p>
        <a className="btn" href={mailto}>
          Send it to the team
        </a>
        <button type="button" className="link contact-back" onClick={() => setSent(false)}>
          Edit the details
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate data-r>
      <div className="f-row">
        <Field id="name" label="Name" placeholder="Jane Doe" value={v.name} onChange={set('name')} error={errs.name} autoComplete="name" />
        <Field id="company" label="Company" placeholder="Acme Ltd" value={v.company} onChange={set('company')} autoComplete="organization" />
      </div>

      <Field
        id="email"
        label="Work email"
        type="email"
        inputMode="email"
        placeholder="jane@acme.com"
        value={v.email}
        onChange={set('email')}
        error={errs.email}
        autoComplete="email"
      />

      <div className="f">
        <label className="f-label" htmlFor="problem">
          What&rsquo;s the problem?
        </label>
        <textarea
          id="problem"
          rows={4}
          value={v.problem}
          onChange={set('problem')}
          placeholder="Our support inbox is three days behind…"
          aria-invalid={errs.problem ? 'true' : undefined}
          aria-describedby={errs.problem ? 'problem-err' : undefined}
        />
        {errs.problem && (
          <p className="f-err" id="problem-err">
            {errs.problem}
          </p>
        )}
      </div>

      <button type="submit" className="btn contact-submit">
        Book the consultation
      </button>
    </form>
  )
}

function NewsForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <form
      className="news-form"
      onSubmit={(e) => {
        e.preventDefault()
        setDone(true)
        setEmail('')
      }}
    >
      <label className="sr-only" htmlFor="news-email">
        Email address
      </label>
      <input
        id="news-email"
        type="email"
        required
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="btn">
        {done ? 'Subscribed' : 'Subscribe'}
      </button>
    </form>
  )
}

/* Visible label above every field. A placeholder is not a label — it vanishes
   the moment someone starts typing, exactly when they need it. */
function Field({ id, label, error, ...rest }) {
  return (
    <div className="f">
      <label className="f-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={rest.type ?? 'text'}
        value={rest.value}
        onChange={rest.onChange}
        placeholder={rest.placeholder}
        inputMode={rest.inputMode}
        autoComplete={rest.autoComplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <p className="f-err" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  )
}
