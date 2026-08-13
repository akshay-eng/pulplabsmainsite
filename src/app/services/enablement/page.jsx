import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import EnablementExplorer from '@/components/void/EnablementExplorer'
import { delivery, platforms, formats } from '@/data/enablement'

export const metadata = {
  title: 'Enablement & workshops — PulpLabs',
  description:
    'Certified instruction across Claude, OpenAI and Codex, Microsoft Copilot Studio, Gemini and IBM watsonx Orchestrate. One-day, three-day and one-week formats, on-site or online, run on your own workflows.',
  alternates: { canonical: '/services/enablement' },
  openGraph: { images: [{ url: '/void/enablement-workshops.webp', width: 1600, height: 900 }] },
}

export default function Enablement() {
  return (
    <div className="grain">
      <Nav />
      <main id="main">
        <section className="phead grid-bg">
          <div className="phead-light" aria-hidden="true">
            <img src="/void/flare-column.webp" alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell phead-in">
            <p className="mono">
              <Link href="/services" className="crumb-a">Capabilities</Link> / Enablement &amp; workshops
            </p>
            <h1 className="d1 phead-h">Capability transfer, not a training day.</h1>
            <p className="lede phead-l">
              Five platforms, three fixed lengths, on-site or online — every one of them run on your workflows and
              your data rather than a generic exercise. Each cohort leaves with something in production.
            </p>
          </div>
        </section>

        {/* The three numbers that decide whether this is even worth reading. */}
        <section className="sec-sm">
          <div className="shell">
            <ul className="enb-facts">
              {[['05', 'Platforms taught'], ['03', 'Fixed formats, plus custom'], ['01', 'Thing in production per cohort']].map(([n, l]) => (
                <li key={l} data-r>
                  <span className="enb-fn">{n}</span>
                  <span className="mono">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell">
            <header className="sec-head" data-r>
              <h2 className="d3">How it runs.</h2>
              <p className="lede measure-w">
                The remote format is restructured rather than the same six hours on a call — shorter blocks, more
                days, same labs.
              </p>
            </header>
            <ul className="enb-del">
              {delivery.map(([t, d], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 60}ms` }}>
                  <h3 className="h4">{t}</h3>
                  <p className="body">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell">
            <header className="sec-head" data-r>
              <h2 className="d3">Pick a platform and a length.</h2>
              <p className="lede measure-w">
                {platforms.length} platforms × {formats.length} formats, plus custom. Choose two and the curriculum
                for exactly that combination appears below — nothing else.
              </p>
            </header>
            <EnablementExplorer />
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell">
            <figure className="enb-photo" data-r>
              <img src="/void/enablement-workshops.webp"
                alt="An instructor leaning in over a participant's shoulder while a mixed cohort works at laptops."
                loading="lazy" decoding="async" />
              <figcaption className="mono">
                Builder bootcamp — cohorts capped so everyone ships something.
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/hero-pause.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>Tell us who is in the room.</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              Roles, platforms, and the workflow you want the cohort to work on. We will come back with a curriculum
              built around it — and say so if a shorter format would do the same job.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">Plan a cohort <Chevron /></Link>
            </div>
          </div>
        </section>

        <NextPage href="/services/advisory" title="Advisory & strategy" />
      </main>
      <Footer />
    </div>
  )
}
