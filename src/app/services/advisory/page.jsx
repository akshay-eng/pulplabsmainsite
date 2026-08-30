import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import StartCta from '@/components/void/StartCta'

export const metadata = {
  title: 'Advisory & strategy — PulpLabs',
  description:
    'A structured assessment of where AI pays back in your business and where it does not — workflow mapping, ranked use cases, an adoption roadmap and the governance framework your auditors will ask for.',
  alternates: { canonical: '/services/advisory' },
  openGraph: { images: [{ url: '/void/adv-board.webp', width: 1800, height: 1012 }] },
}

/* The four things the engagement produces. Each is written as an artefact
   rather than an activity — "we run workshops" is not a deliverable. */
const PILLARS = [
  {
    n: '01',
    id: 'readiness',
    who: 'Your CTO, and whoever owns the data',
    role: 'Engineering',
    k: 'AI readiness assessment',
    t: 'Where you actually are.',
    b: 'Not a maturity score out of five. We look at the data you hold and whether it is usable, the systems that would have to integrate, the permissions already sprawling inside your tenant, and whether anyone owns the workflow end to end. Most readiness problems turn out to be data and ownership problems wearing a different hat.',
    out: ['A written position on data, systems, skills and ownership', 'The specific blockers that must clear before anything ships', 'An honest read on what is fixable this quarter'],
  },
  {
    n: '02',
    id: 'discovery',
    who: 'Whoever carries the P&L for the workflow',
    role: 'Operations',
    k: 'Use-case discovery',
    t: 'Ranked by payback, not by novelty.',
    b: 'We map the workflow as it actually runs — including the steps nobody documented — and cost each one in hours, error rate and delay. Then every candidate gets plotted on payback against effort. The output is a shortlist, and just as usefully, a list of things to leave alone.',
    out: ['A workflow map of how the work really happens', 'Every candidate scored on payback and effort', 'A ranked shortlist, and an explicit do-not-automate list'],
  },
  {
    n: '03',
    id: 'roadmap',
    who: 'Your CFO and the executive sponsor',
    role: 'Finance',
    k: 'Adoption roadmap',
    t: 'Sequenced so each phase funds the next.',
    b: 'Nobody gets a two-year budget on faith. The roadmap is ordered so the first thing delivered is the thing that pays for the second — usually not the most exciting candidate, but the one with the shortest path to a number a CFO recognises. Each phase carries its own success criteria and its own abandon condition.',
    out: ['A phased plan with a measure attached to each phase', 'A written abandon condition per phase', 'Resourcing and skills gaps named in advance'],
  },
  {
    n: '04',
    id: 'governance',
    who: 'Your risk, audit and compliance function',
    role: 'Risk',
    k: 'Governance & risk',
    t: 'The framework your auditors will ask for.',
    b: 'Where a human has to approve, what gets logged, how a model change is reviewed before it reaches production, who is accountable when an agent gets it wrong, and what evidence exists afterwards. Written to be handed to your risk function rather than to impress a board.',
    out: ['An approval and escalation model per workflow', 'Logging and audit requirements, specified', 'A model-change review process that survives contact with a real release'],
  },
]

const RUN = [
  ['Week 1', 'Interviews and observation', 'We sit with the people doing the work. What they describe in a meeting and what they do at their desk are rarely the same process.'],
  ['Week 2', 'Data and systems review', 'What exists, what is usable, what integrates, and what would have to change first.'],
  ['Week 3', 'Scoring and modelling', 'Every candidate costed and plotted. This is where most of the shortlist gets shorter.'],
  ['Week 4', 'Readout and roadmap', 'A written report and a working session — not a slide deck emailed over afterwards.'],
]

export default function Advisory() {
  return (
    <div className="grain">
      <Nav />
      <main id="main">
        <section className="adv-head">
          <div className="adv-art" aria-hidden="true">
            <img src="/void/adv-matrix.webp" alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell adv-in">
            <p className="mono">
              <Link href="/services" className="crumb-a">Capabilities</Link> / Advisory &amp; strategy
            </p>
            <h1 className="d1 adv-h">Find out where AI pays back — and where it does not.</h1>
            <p className="lede adv-l">
              Four weeks, four artefacts, one answer. We map your workflows, the data behind them and the constraints
              around them before anyone writes code — and we tell you which candidates are not worth building.
            </p>
          </div>
        </section>

        {/* The uncomfortable promise, stated plainly and early — it is the
            thing that separates this from a vendor pitch. */}
        <section className="sec-sm">
          <div className="shell">
            <blockquote className="adv-quote" data-r>
              <p className="d3">
                The most valuable line in the report is usually the one that says <em>do not automate this.</em>
              </p>
              <p className="body">
                An assessment that recommends everything is a sales document. Ours names what to leave alone, and why
                — because the cost of building the wrong thing is not just the build, it is the two years you spend
                maintaining it.
              </p>
            </blockquote>
          </div>
        </section>

        <section className="sec-sm adv-cost-sec">
          <div className="shell">
            <ul className="adv-cost">
              {[
                ['4 wks', 'Typical length', 'Two for a single workflow; longer across operating companies.'],
                ['6–8', 'People we talk to', 'The ones doing the work, not only the ones who own it.'],
                ['½ day', 'Of your team\u2019s time', 'Per person, spread across the four weeks. We do the rest.'],
                ['1', 'Written report', 'Not a deck. Read once, then used as a reference.'],
              ].map(([v, k, d], i) => (
                <li key={k} data-r style={{ '--rd': `${i * 55}ms` }}>
                  <span className="adv-cv">{v}</span>
                  <span className="mono">{k}</span>
                  <span className="body">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec-sm adv-art-sec">
          <div className="adv-plate" aria-hidden="true">
            <img src="/void/adv-contour.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell adv-rel">
            <header className="sec-head" data-r>
              <h2 className="d3">What you get.</h2>
              <p className="lede measure-w">Four artefacts, each written for a different reader — the person who needs the readiness picture is not the one who has to sign off the risk position.</p>
            </header>

            <ul className="adv-pillars">
              {PILLARS.map((p, i) => (
                <li key={p.k} id={p.id} data-r style={{ '--rd': `${i * 70}ms` }}>
                  {/* A left rail carrying the reader. The header promises each
                      artefact is written for a different person; without this
                      it never said who, and four identical slabs of prose had
                      nothing to break them up. */}
                  <div className="adv-p-grid">
                    <div className="adv-p-rail">
                      <span className="adv-p-head">
                        <span className="adv-p-n">{p.n}</span>
                        <span className="adv-p-role mono">{p.role}</span>
                      </span>
                      <p className="mono adv-p-k">{p.k}</p>
                      <div className="adv-p-who">
                        <p className="mono">Written for</p>
                        <p className="body">{p.who}</p>
                      </div>
                    </div>
                    <div className="adv-p-body">
                      <h3 className="adv-p-t">{p.t}</h3>
                      <p className="body adv-p-b">{p.b}</p>
                    </div>
                  </div>
                  <ul className="adv-p-out">
                    {p.out.map((o) => (
                      <li key={o}>
                        <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                          <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" fill="none"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="body">{o}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec-sm adv-run-sec">
          <div className="adv-plate is-side" aria-hidden="true">
            <img src="/void/adv-shaft.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell adv-rel">
            <header className="sec-head" data-r>
              <h2 className="d3">How the four weeks run.</h2>
            </header>
            <ol className="adv-run">
              {RUN.map(([w, t, b], i) => (
                <li key={w} data-r style={{ '--rd': `${i * 60}ms` }}>
                  <span className="mono adv-r-w">{w}</span>
                  <span className="adv-r-t">{t}</span>
                  <span className="body adv-r-b">{b}</span>
                </li>
              ))}
            </ol>
            <p className="mono adv-note" data-r>
              Four weeks is the common shape. A single workflow can be done in two; a group with several operating
              companies takes longer.
            </p>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell">
            <header className="sec-head" data-r>
              <h2 className="d3">What a finding looks like.</h2>
              <p className="lede measure-w">
                One row from a real report shape, so the artefacts above are not abstract.
              </p>
            </header>
            <div className="adv-eg" data-r>
              <div className="adv-eg-col">
                <p className="mono">The workflow</p>
                <p className="body">
                  Quote build. Four people, roughly 46 hours a week between them, rekeying line items from an email
                  into the CRM and pricing them against a spreadsheet nobody owns.
                </p>
              </div>
              <div className="adv-eg-col">
                <p className="mono">What we found</p>
                <p className="body">
                  The bottleneck is not the pricing, it is that 12% of quotes go out with a wrong line item and get
                  reworked. Fixing the source data first makes automation worth roughly half what it would be otherwise.
                </p>
              </div>
              <div className="adv-eg-col is-out">
                <p className="mono">The recommendation</p>
                <p className="body">
                  Validate at intake before you automate anything. Payback in eight weeks on the validation alone —
                  and it makes the later build cheaper, not redundant.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/hero-pause.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>Start with the workflow that is eating your week.</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              Thirty minutes with an engineer, no deck. You will get a straight answer on whether an assessment is
              even worth running — sometimes the answer is that you already know what to build.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <StartCta message="Hi PulpLabs — I'd like to book a 30-minute call about an AI assessment.">Book a call <Chevron /></StartCta>
            </div>
          </div>
        </section>

        <NextPage href="/services/enablement" title="Enablement & workshops" />
      </main>
      <Footer />
    </div>
  )
}
