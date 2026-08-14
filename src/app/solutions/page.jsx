import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import SolCard from '@/components/void/SolCard'
import { functions } from '@/data/functions'
import { byFunction, allSolutions } from '@/data/capabilities'

export const metadata = {
  title: 'Solutions by function — PulpLabs',
  description:
    'What we build, arranged by the team that uses it: IT operations, sales, customer support, marketing, finance and back office, data and reporting.',
  alternates: { canonical: '/solutions' },
  openGraph: { images: [{ url: '/void/cards/incident-intelligence.webp', width: 1200, height: 675 }] },
}

const inProd = allSolutions.filter((s) => s.status === 'production').length

export default function Solutions() {
  return (
    <div className="grain">
      <Nav />

      <main id="main">
        <section className="phead grid-bg">
          <div className="phead-light" aria-hidden="true">
            <img src="/void/aperture-glow.webp" alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell phead-in">
            <p className="mono">Solutions</p>
            <h1 className="d1 phead-h">Find yours by the team that uses it.</h1>
            <p className="lede phead-l">
              The same catalogue as our practice areas, cut a different way. If you already know the function you are
              trying to fix, start here — every solution links through to what it does, what it plugs into, and what
              it will not do.
            </p>
          </div>
        </section>

        {/* Two labels, one honest distinction. A catalogue that hides which
            things are built and which are scoped is a promise, not a menu. */}
        <section className="sec-sm sol-key-sec">
          <div className="shell sol-key">
            <p className="body" data-r>
              <span className="sol-status is-production">Accelerator</span>
              Production-tested and deployed inside your estate. {inProd} of them, running today.
            </p>
            <p className="body" data-r style={{ '--rd': '70ms' }}>
              <span className="sol-status is-scope">Built to scope</span>
              A shape we have built before, fitted to your systems during the engagement rather than installed.
            </p>
          </div>
        </section>

        {functions.map((f, i) => {
          const items = byFunction(f.id)
          return (
            <section className="sec-sm sol-sec" id={f.id} key={f.id}>
              <div className="shell">
                <header className="sol-head" data-r>
                  <div>
                    <p className="mono sol-n">{String(i + 1).padStart(2, '0')}</p>
                    <h2 className="d3">{f.name}</h2>
                  </div>
                  <div className="sol-head-r">
                    <p className="mono">{f.tag}</p>
                    <p className="body">{f.blurb}</p>
                  </div>
                </header>

                <ul className="sols">
                  {items.map((s, j) => <SolCard key={s.slug} sol={s} i={j} />)}
                </ul>
              </div>
            </section>
          )
        })}

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/hero-pause.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>Not seeing your workflow?</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              This list is what we have built more than once. Most engagements start with something that is not on it —
              tell us what is eating your week and we will say honestly whether it is worth building.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">Start the conversation <Chevron /></Link>
            </div>
          </div>
        </section>

        <NextPage href="/services" title="Capabilities" />
      </main>

      <Footer />
    </div>
  )
}
