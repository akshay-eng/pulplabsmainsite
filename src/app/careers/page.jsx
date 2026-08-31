import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import RoleAccordion from '@/components/void/RoleAccordion'
import { roles, expectations, hiring } from '@/data/careers'

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

        {/* Roles first. A candidate came here for the job, and making them
            scroll past three sections of culture copy to find it is the most
            common thing careers pages get wrong. Everything that explains the
            place sits underneath, where it answers a question they now have. */}
        <section className="sec-sm cx-roles">
          <div className="shell">
            <p className="mono cx-eyebrow">Open roles</p>
            {open.length === 0 ? (
              <p className="lede measure-w cx-none">
                Nothing open right now. If you think you should be here anyway, tell us what you have shipped and
                we will keep it on file.
              </p>
            ) : (
              <ul className="roles">
                {open.map((r) => (
                  /* Sole role opens by default: collapsing the only thing on
                     the page hides the whole point of visiting it. With more
                     than one, everything starts closed so the list is the
                     first thing you see. */
                  <RoleAccordion key={r.slug} role={r} defaultOpen={open.length === 1} />
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="sec-sm cx-band">
          <div className="shell">
            <p className="mono cx-eyebrow">What to expect</p>
            <h2 className="d2 cx-h">
              Three things we will hold ourselves to.
            </h2>
            <ul className="cx-expect">
              {expectations.map(([t, b], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 70}ms` }}>
                  <span className="mono cx-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="h4 cx-expect-t">{t}</h3>
                  <p className="body">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="plate cx-plate">
          <div className="plate-img" aria-hidden="true">
            <img src="/void/grid-horizon.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell plate-in">
            <p className="mono">How hiring works</p>
            <p className="d2 plate-h">
              Four steps,
              <br />
              <span className="dim">and an answer either way.</span>
            </p>
            <ol className="cx-steps">
              {hiring.map(([t, b], i) => (
                <li key={t} data-r style={{ '--rd': `${i * 60}ms` }}>
                  <span className="mono cx-step-n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="h4 cx-step-t">{t}</p>
                    <p className="body">{b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell cx-spec" data-r>
            <div>
              <h2 className="d3 cx-spec-h">Nothing here fits?</h2>
              <p className="body cx-spec-b">
                We open roles when the work demands them rather than on a schedule, so the list above is short more
                often than not. If you have built something you think we should see, send it. We would rather read
                about a real project than a CV written to match a posting.
              </p>
            </div>
            <Link href="/contact" className="btn cx-spec-cta">
              Send us your work
            </Link>
          </div>
        </section>

        <NextPage href="/team" title="Team" />
      </main>

      <Footer />
    </div>
  )
}
