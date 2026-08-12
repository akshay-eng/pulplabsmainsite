'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import Chevron from '@/components/apple/Chevron'
import NextPage from '@/components/void/NextPage'

/* Names are still placeholders in src/data/team.js. Rather than invent six
   people for a real company's team page, each card carries the role, the
   discipline and a real description of the work — and says plainly that the
   name is pending. A fabricated roster is the one thing on this page that
   would actually mislead someone. */
const PEOPLE = [
  {
    role: 'Founder & AI architect',
    disc: 'Architecture',
    b: 'Owns the shape of every engagement — what gets built, what gets refused, and where the evaluation gates sit.',
  },
  {
    role: 'Delivery lead',
    disc: 'Delivery',
    b: 'Runs the week-by-week increments and the handover. The person who tells you when a scope has moved.',
  },
  {
    role: 'ML engineer',
    disc: 'Modelling',
    b: 'Builds and scores the evaluation harnesses. Decides when a model is good enough to touch a live queue.',
  },
  {
    role: 'Platform engineer',
    disc: 'Infrastructure',
    b: 'Deploys inside your estate and wires into your ITSM and CMDB without opening a hole in your boundary.',
  },
  {
    role: 'Enablement instructor',
    disc: 'Enablement',
    b: 'Runs the briefings and bootcamps on your workflows. Certified across all four platforms.',
  },
  {
    role: 'Growth & partnerships',
    disc: 'Commercial',
    b: 'Scoping, discovery and the honest conversation about whether the thing you asked for is the thing you need.',
  },
]

const CERTS = [
  ['Claude architects', 'Anthropic'],
  ['OpenAI practitioners', 'OpenAI'],
  ['Copilot Studio', 'Microsoft'],
  ['watsonx Orchestrate', 'IBM'],
]

/* Deliberately separate from CERTS. These are things we build on, not things
   we hold a certification in — merging the two lists would claim credentials
   that do not exist. */
const STACK = [
  ['Models', ['Claude', 'GPT', 'Gemini', 'Llama', 'Mistral']],
  ['Orchestration', ['LangGraph', 'LlamaIndex', 'Temporal', 'Airflow', 'n8n']],
  ['Platforms', ['Azure AI Foundry', 'AWS Bedrock', 'Google Vertex AI', 'Databricks']],
  ['Data', ['Snowflake', 'Postgres', 'pgvector', 'Elasticsearch', 'Redis']],
  ['ITSM & ops', ['ServiceNow', 'Jira Service Management', 'PagerDuty', 'Datadog']],
  ['Runtime', ['Kubernetes', 'Docker', 'Terraform', 'GitHub Actions']],
]

const PRINCIPLES = [
  ['We say no', 'If AI does not help your case, we tell you in the discovery call rather than selling you a pilot that stalls.'],
  ['We evaluate first', 'Nothing reaches a production queue without being scored against your own historical cases.'],
  ['We hand over', 'Your code, your documentation, your trained team. Staying on is your option, not a dependency we engineer in.'],
]

export default function Team() {
  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="phead grid-bg team-head">
          <div className="phead-light" aria-hidden="true">
            <img src="/void/deep-field.webp" alt="" fetchPriority="high" decoding="async" />
          </div>

          <div className="shell phead-in">
            <p className="mono">Team</p>
            <h1 className="d1 phead-h">
              Six people.
              <br />
              <span className="dim">Four platforms.</span>
            </h1>
            <p className="lede phead-l">
              Small enough that the person who scoped your engagement is the person who builds it. Certified across
              every platform we deploy on, and deliberately not growing faster than we can staff properly.
            </p>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell-wide">
            <ul className="roster">
              {PEOPLE.map((p, i) => (
                <li key={p.role} data-r style={{ '--rd': `${i * 60}ms` }}>
                  {/* A portrait slot, sized and framed like the real thing so
                      the layout is already correct when photographs arrive. A
                      generated face here would read as a named employee. */}
                  <span className="roster-photo" aria-hidden="true">
                    <svg viewBox="0 0 40 40" width="34" height="34">
                      <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                      <circle cx="20" cy="20" r="4.5" fill="currentColor" opacity="0.85" />
                      <path
                        d={`M20 1 A19 19 0 ${i % 2 ? 1 : 0} 1 ${20 + 19 * Math.cos((i + 1) * 1.1)} ${20 + 19 * Math.sin((i + 1) * 1.1)}`}
                        fill="none" stroke="currentColor" strokeWidth="1.4"
                      />
                    </svg>
                    <span className="mono roster-photo-l">Photo</span>
                  </span>
                  <div className="roster-body">
                    <p className="mono">{p.disc}</p>
                    <h2 className="d3">{p.role}</h2>
                    <p className="body">{p.b}</p>
                  </div>
                  <span className="mono roster-name">Name pending</span>
                </li>
              ))}
            </ul>
            <p className="mono roster-note" data-r>
              Names, photographs and links are placeholders in src/data/team.js — replace before launch.
            </p>
          </div>
        </section>

        <section className="plate team-plate">
          <div className="plate-img" aria-hidden="true">
            <img src="/void/grid-horizon.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell plate-in">
            <p className="mono">Certified</p>
            <p className="d2 plate-h">
              Every platform we deploy on,
              <br />
              <span className="dim">we are certified to deploy on.</span>
            </p>
            <ul className="certs-grid">
              {CERTS.map(([n, issuer], i) => (
                <li key={n} data-r style={{ '--rd': `${i * 60}ms` }}>
                  <span className="h4">{n}</span>
                  <span className="mono">{issuer}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">The stack</p>
              <h2 className="d2">What we build on.</h2>
              <p className="lede">
                Certifications above are the four platforms we are accredited on. This is everything else we deploy,
                integrate and operate against.
              </p>
            </header>

            <ul className="stack">
              {STACK.map(([group, items], i) => (
                <li key={group} data-r style={{ '--rd': `${i * 55}ms` }}>
                  <p className="mono">{group}</p>
                  <ul>
                    {items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">How we work</p>
              <h2 className="d2">Three things we will not trade.</h2>
            </header>

            <ul className="prin">
              {PRINCIPLES.map(([t, b], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 70}ms` }}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="d3">{t}</h3>
                  <p className="body">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/aperture-glow.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>
              Work with the people who build it.
            </h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              No account managers between you and the engineer. Thirty minutes, and a straight answer.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">
                Start a project <Chevron />
              </Link>
            </div>
          </div>
        </section>
        <NextPage
          href="/contact"
          kicker="Next"
          title="Contact"
          blurb="Thirty minutes with an engineer. You will leave with a straight answer on whether AI helps here."
        />
      </main>

      <Footer />
    </div>
  )
}
