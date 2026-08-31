import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import ApplyModal from '@/components/void/ApplyModal'
import { roles } from '@/data/careers'

export const metadata = {
  title: 'Careers · PulpLabs',
  description:
    'Open roles at PulpLabs. We are a small AI consultancy and engineering firm, and we hire people who want to ship into production rather than prototype.',
  alternates: { canonical: '/careers' },
}

export default function Careers() {
  const open = roles.filter((r) => r.open)

  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="phead grid-bg">
          <div className="phead-light" aria-hidden="true">
            <img src="/void/aperture-glow.webp" alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell phead-in">
            <p className="mono">Careers</p>
            <h1 className="d1 phead-h">We are looking for interns.</h1>
            <p className="lede phead-l">
              A small team means an intern here is not writing throwaway prototypes. You pick up tickets from the
              same board as everyone else, your pull requests go through the same review, and what you build gets
              deployed.
            </p>
          </div>
        </section>

        {open.length === 0 ? (
          <section className="sec-sm">
            <div className="shell">
              <p className="lede measure-w">
                Nothing open right now. If you think you should be here anyway, tell us what you have shipped.
              </p>
            </div>
          </section>
        ) : (
          open.map((r) => (
            <section className="sec-sm" id={r.slug} key={r.slug}>
              <div className="shell">
                <div className="cr">
                  <header className="cr-head">
                    <div>
                      <p className="mono cr-k">{r.team}</p>
                      <h2 className="cr-t">{r.title}</h2>
                      <p className="body cr-s">{r.summary}</p>
                    </div>
                    <ul className="cr-facts">
                      {[['Type', r.type], ['Length', r.length], ['Where', r.location]].map(([k, v]) => (
                        <li key={k}>
                          <span className="mono">{k}</span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </header>

                  <p className="body cr-about">{r.about}</p>

                  <div className="cr-grid">
                    <div>
                      <p className="mono cr-lbl">What we need you to already have</p>
                      <ul className="cr-need">
                        {r.need.map(([t, d]) => (
                          <li key={t}>
                            <span className="cr-need-t">{t}</span>
                            <span className="body">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="cr-side">
                      <div>
                        <p className="mono cr-lbl">What you will be doing</p>
                        <ul className="cr-list">
                          {r.doing.map((d) => <li key={d} className="body">{d}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="mono cr-lbl">Nice to have</p>
                        <ul className="cr-list">
                          {r.nice.map((d) => <li key={d} className="body">{d}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <p className="cr-honest">
                    <span className="mono">Worth saying up front</span>
                    {r.honest}
                  </p>

                  <div className="cr-cta">
                    <ApplyModal role={r} />
                  </div>
                </div>
              </div>
            </section>
          ))
        )}

        <NextPage href="/team" title="Team" />
      </main>

      <Footer />
    </div>
  )
}
