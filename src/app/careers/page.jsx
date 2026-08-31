import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import RoleAccordion from '@/components/void/RoleAccordion'
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
          <section className="sec-sm">
            <div className="shell">
              <p className="mono roles-count">
                {open.length} open {open.length === 1 ? 'role' : 'roles'}
              </p>
              <ul className="roles">
                {open.map((r, i) => (
                  /* Sole role opens by default: collapsing the only thing on
                     the page hides the whole point of visiting it. With more
                     than one, everything starts closed so the list is the
                     first thing you see. */
                  <RoleAccordion key={r.slug} role={r} defaultOpen={open.length === 1} />
                ))}
              </ul>
            </div>
          </section>
        )}

        <NextPage href="/team" title="Team" />
      </main>

      <Footer />
    </div>
  )
}
