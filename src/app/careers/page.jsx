import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import RoleSheet from '@/components/void/RoleSheet'
import { roles } from '@/data/careers'

export const metadata = {
  title: 'Careers',
  description:
    'Open roles at PulpLabs. An AI consultancy and engineering firm hiring people who want to ship into production rather than prototype.',
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
            <h1 className="d1 phead-h">
              We are looking for interns.
              <br />
              <span className="dim">The work is real.</span>
            </h1>
            <p className="lede phead-l">
              You pick up tickets from the same board as everyone else, your pull requests go through the same
              review, and what you build gets deployed. That is the whole offer, and it is the reason to come.
            </p>
          </div>
        </section>

        {/* Just the roles. Each one is laid out in full rather than hidden
            behind a toggle: with a list this short, collapsing it only puts a
            click between someone and the thing they came to read. */}
        <section className="sec-sm">
          <div className="shell">
            {open.length === 0 ? (
              <p className="lede measure-w rs-none">
                Nothing open right now. If you think you should be here anyway, tell us what you have shipped and
                we will keep it on file.
              </p>
            ) : (
              <div className="rs-stack">
                {open.map((r) => (
                  <RoleSheet key={r.slug} role={r} />
                ))}
              </div>
            )}
          </div>
        </section>

        <NextPage href="/team" title="Team" />
      </main>

      <Footer />
    </div>
  )
}
