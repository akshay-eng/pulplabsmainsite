'use client'

import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import { engagementSteps, principles, alliances, roster } from '@/data/firm'
import { people as ROSTER_ASSETS } from '@/data/team'

export default function About() {
  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="phead grid-bg team-head">
          <div className="phead-light" aria-hidden="true">
            <img src="/void/deep-field.webp" alt="" fetchPriority="high" decoding="async" />
          </div>

          <div className="shell phead-in">
            <p className="mono">About the firm</p>
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

        {/* How an engagement runs. This is the thing a buyer of services is
            actually evaluating, so it sits above the roster. */}
        <section className="sec">
          <div className="shell">
            <header className="sec-h" data-r>
              <p className="mono">How we engage</p>
              <h2 className="d2">
                Discover. Build. <span className="dim">Hand over.</span>
              </h2>
            </header>

            <ol className="proc">
              {engagementSteps.map(([t, b], i) => (
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

        <section className="sec">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">How we work</p>
              <h2 className="d2">Three things we will not trade.</h2>
            </header>

            <ul className="prin">
              {principles.map(([t, b], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 70}ms` }}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="d3">{t}</h3>
                  <p className="body">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Leadership. Names are still placeholders in data/team.js — each card
            carries the role, the discipline and a real description of the work,
            and says plainly that the name is pending. A fabricated roster is the
            one thing on this site that would actually mislead someone. */}
        <section className="sec-sm">
          <div className="shell-wide">
            <header className="sec-h" data-r>
              <p className="mono">The team</p>
              <h2 className="d2 measure">No account managers between you and the engineer.</h2>
            </header>

            <ul className="roster">
              {roster.map((p, i) => (
                <li key={p.role} data-r style={{ '--rd': `${i * 60}ms` }}>
                  {/* Portraits are AI-generated illustrations of fictional
                      people — see public/IMAGE_CREDITS.md. Desaturated so they
                      sit in a monochrome system, and the card still says the
                      name is pending so nobody reads them as real staff. */}
                  <span className="roster-photo">
                    <img
                      src={ROSTER_ASSETS[i]?.photo ?? '/avatars/member-01.webp'}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: ROSTER_ASSETS[i]?.photoPosition ?? '50% 20%' }}
                    />
                  </span>
                  <div className="roster-body">
                    <p className="mono">{p.disc}</p>
                    <h3 className="d3">{p.role}</h3>
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
            <p className="mono">Accreditation</p>
            <p className="d2 plate-h">
              Certified where it counts,
              <br />
              <span className="dim">fluent across the rest.</span>
            </p>
            <p className="body plate-b">
              We hold formal accreditation on the four platforms below. Beyond those we build on, integrate and operate
              against the wider ecosystem — frontier and open-weight models, the major cloud AI platforms, and the
              orchestration, data and ITSM tooling around them. Ask about anything specific and we will tell you
              straight whether we have shipped on it.
            </p>
            <ul className="certs-grid">
              {alliances.map(([n, issuer], i) => (
                <li key={n} data-r style={{ '--rd': `${i * 60}ms` }}>
                  <span className="h4">{n}</span>
                  <span className="mono">{issuer}</span>
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
              Thirty minutes, and a straight answer.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">
                Start a project <Chevron />
              </Link>
            </div>
          </div>
        </section>

        <NextPage href="/contact" title="Contact" />
      </main>

      <Footer />
    </div>
  )
}
