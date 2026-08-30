import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import StartCta from '@/components/void/StartCta'

export const metadata = {
  title: 'Managed operations · PulpLabs',
  description:
    'Monitoring, evaluation, tuning and quarterly review for what we build, for as long as you want us and no longer. Handover happens first; staying on is your option.',
  alternates: { canonical: '/services/managed' },
  openGraph: { images: [{ url: '/void/managed/mo-hero.webp', width: 1600, height: 900 }] },
}

/* Four services, each written as what we watch and what we do about it —
   an SLA nobody reads is not a differentiator, and neither is "we monitor". */
const SERVICES = [
  {
    n: '01',
    id: 'monitoring',
    art: 'mo-monitoring',
    k: 'Monitoring & alerting',
    t: 'On behaviour, not just uptime.',
    b: 'A model that is up and answering badly passes every infrastructure check you have. We watch the things that actually degrade: answer quality against a held-out set, refusal and escalation rates, retrieval hit rate, latency and cost per run, and we alert on the ones that move. Drift is slow and quiet, which is exactly why it needs a threshold rather than a person noticing.',
    out: ['Quality, refusal and drift tracked against a baseline', 'Alerts routed into the on-call you already run', 'Cost and latency per run, visible'],
  },
  {
    n: '02',
    id: 'evaluation',
    art: 'mo-evaluation',
    k: 'Evaluation harnesses',
    t: 'A passing suite that still means something.',
    b: 'An eval set written at launch measures the world at launch. Your estate changes, your documentation changes, the questions people ask change, and a suite that never changes with them keeps passing while the system gets worse. We add cases from live traffic, retire ones that no longer represent anything, and keep the gate in CI so a prompt change cannot ship on a hunch.',
    out: ['Cases added from real traffic, not invented', 'Regression gate wired into your pipeline', 'Failures reported with the case that caught them'],
  },
  {
    n: '03',
    id: 'tuning',
    art: 'mo-tuning',
    k: 'Model & prompt tuning',
    t: 'Nothing is tuned straight into production.',
    b: 'Model versions get deprecated, prices change, a better one arrives. Each change is a candidate, not an upgrade: it runs against the full suite, gets compared on quality, latency and cost, and ships behind a flag with the previous version one toggle away. Prompts are versioned like code because that is what they are.',
    out: ['Every change scored before it ships', 'Prompt and model versions in source control', 'Rollback that is a toggle, not a rebuild'],
  },
  {
    n: '04',
    id: 'review',
    art: 'mo-review',
    k: 'Quarterly review',
    t: 'What it saved, in your numbers.',
    b: 'Once a quarter we put the measure agreed at scoping next to what actually happened, in the units your finance team uses rather than ours. That includes the quarters where the honest answer is "not much". If a system stops earning its keep, saying so is part of the job. A review that only ever reports success is a renewal pitch.',
    out: ['Measured against the criteria set at scoping', 'Written in your units, not ours', 'An explicit recommendation, including to stop'],
  },
]

export default function Managed() {
  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="cat-head">
          <div className="cat-head-art" aria-hidden="true">
            <img src="/void/managed/mo-hero.webp" alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell cat-head-in">
            <p className="mono cdet-crumb">
              <Link href="/services">Capabilities</Link>
              <span aria-hidden="true">/</span>
              Managed operations
            </p>
            <h1 className="d1 cat-h">We run what we build.</h1>
            <p className="lede cat-l">
              Monitoring, evaluation and tuning for as long as you want us and no longer. Handover happens first,
              not at the end of a notice period.
            </p>
            <p className="cat-note">
              <span className="mono">Worth saying up front</span>
              Staying on is your option, not a dependency we engineer in. Your team gets the code, the documentation
              and the training whether or not you keep us.
            </p>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell">
            <header className="sec-head" data-r>
              <h2 className="d3">What running it actually means.</h2>
              <p className="lede measure-w">
                Four things, each written as what we watch and what we do about it. &ldquo;We monitor&rdquo; is not a
                service.
              </p>
            </header>

            <ul className="mo-list">
              {SERVICES.map((x, i) => (
                <li key={x.id} id={x.id} data-r style={{ '--rd': `${i * 70}ms` }}>
                  <div className="mo-art" aria-hidden="true">
                    <img src={`/void/managed/${x.art}.webp`} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="mo-copy">
                    <p className="mono mo-k"><span className="mo-n">{x.n}</span>{x.k}</p>
                    <h3 className="mo-t">{x.t}</h3>
                    <p className="body mo-b">{x.b}</p>
                    <ul className="mo-out">
                      {x.out.map((o) => (
                        <li key={o}>
                          <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                            <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" fill="none"
                              strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="body">{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/hero-pause.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>Already running something that needs watching?</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              We pick up systems we did not build, provided we can evaluate them honestly first. If the right answer
              is to retire it rather than operate it, we will say so before you sign anything.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <StartCta message="Hi PulpLabs, I have a system running that needs monitoring and support.">Talk to an engineer <Chevron /></StartCta>
            </div>
          </div>
        </section>

        <NextPage href="/services/advisory" title="Advisory & strategy" />
      </main>

      <Footer />
    </div>
  )
}
