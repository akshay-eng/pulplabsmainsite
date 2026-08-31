'use client'

import Link from 'next/link'
import StartCta from '@/components/void/StartCta'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import Chevron from '@/components/apple/Chevron'
import NextPage from '@/components/void/NextPage'

/* Real people, real photographs, from src/data/team.js. The name leads each
   card: it used to sit under the bio in the dimmest tier at 26% opacity, which
   made it invisible in practice and left the page reading as a list of generic
   roles rather than a team.

   The roles paired to each person here have not been confirmed against who
   actually does what. That used to be said out loud in a note under the grid;
   it is not any more, so the only record of it is this comment. */
import { people as ROSTER } from '@/data/team'

const PEOPLE = [
  {
    role: 'Founder & AI architect',
    disc: 'Architecture',
    b: 'Owns the shape of every engagement: what gets built, what gets refused, and where the evaluation gates sit.',
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
    b: 'Runs the briefings and bootcamps on your workflows, on the platforms we are accredited on.',
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
            {/* No counts. A headcount and a certification tally both go stale
                the moment either changes, and the claim underneath is what
                actually matters anyway. */}
            <h1 className="d1 phead-h">
              The people who build it.
              <br />
              <span className="dim">Certified where it counts.</span>
            </h1>
            <p className="lede phead-l">
              The person who scopes your engagement is the person who builds it. You will not be handed to a delivery
              team you have never met once the contract is signed. We are certified across every platform we deploy
              on, and we hire only as fast as we can staff properly.
            </p>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell-wide">
            <ul className="roster">
              {PEOPLE.map((p, i) => (
                <li key={p.role} data-r style={{ '--rd': `${i * 60}ms` }}>
                  {/* alt is empty on purpose: the name sits next to the
                      portrait as a heading, so describing it again only makes a
                      screen reader say it twice. */}
                  <span className="roster-photo">
                    <img
                      src={ROSTER[i]?.photo ?? '/avatars/member-01.webp'}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: ROSTER[i]?.photoPosition ?? '50% 20%' }}
                    />
                  </span>
                  <div className="roster-body">
                    <p className="mono">{p.disc}</p>
                    <h2 className="d3 roster-name">{ROSTER[i]?.name ?? 'Name pending'}</h2>
                    <p className="roster-role">{p.role}</p>
                    <p className="body">{p.b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="plate team-plate">
          <div className="plate-img" aria-hidden="true">
            <img src="/void/grid-horizon.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell plate-in">
            <p className="mono">Accreditation</p>
            <p className="d2 plate-h">
              Certified where it counts,
              <br />
              <span className="dim">fluent across the rest.</span>
            </p>
            <p className="body plate-b">
              We hold formal accreditation on the platforms below. Beyond those we build on, integrate and operate
              against the wider ecosystem: frontier and open-weight models, the major cloud AI platforms, and the
              orchestration, data and ITSM tooling around them. Ask about anything specific and we will tell you
              straight whether we have shipped on it.
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
              <StartCta message="Hi PulpLabs, I'd like to talk to your team about an AI project.">Start a project <Chevron /></StartCta>
            </div>
          </div>
        </section>
        <NextPage
          href="/contact"
          title="Contact"
        />
      </main>

      <Footer />
    </div>
  )
}
