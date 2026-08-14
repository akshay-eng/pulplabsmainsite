import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NextPage from '@/components/void/NextPage'
import Chevron from '@/components/apple/Chevron'
import SolCard from '@/components/void/SolCard'
import { functions, industries, getFunction, getIndustry } from '@/data/functions'
import { byFunction, getSolution } from '@/data/capabilities'

/* One route for both category kinds. They render identically — a category is
   a heading, a paragraph of what makes it different, and the solutions inside
   it — so two near-duplicate routes would only drift apart over time. */
function resolve(slug) {
  const f = getFunction(slug)
  if (f) return { ...f, kind: 'function', items: byFunction(f.id) }
  const i = getIndustry(slug)
  if (i) return { ...i, kind: 'industry', items: i.solutions.map(getSolution).filter(Boolean) }
  return null
}

export function generateStaticParams() {
  return [...functions, ...industries].map((c) => ({ slug: c.id }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const c = resolve(slug)
  if (!c) return {}
  const kind = c.kind === 'function' ? 'by team' : 'by sector'
  return {
    title: `${c.name} — PulpLabs`,
    description: c.blurb,
    alternates: { canonical: `/services/for/${c.id}` },
    openGraph: { title: `${c.name} — AI solutions ${kind}`, description: c.blurb, url: `/services/for/${c.id}` },
  }
}

export default async function Category({ params }) {
  const { slug } = await params
  const c = resolve(slug)
  if (!c) notFound()

  const siblings = c.kind === 'function' ? functions : industries
  const next = siblings[(siblings.findIndex((x) => x.id === c.id) + 1) % siblings.length]

  return (
    <div className="grain">
      <Nav />
      <main id="main">
        <section className="cat-head">
          <div className="cat-head-art" aria-hidden="true">
            <img src={`/void/cat/${c.kind === 'function' ? 'dept' : 'ind'}-${c.id}.webp`} alt="" fetchPriority="high" decoding="async" />
          </div>
          <div className="shell cat-head-in">
            <p className="mono cdet-crumb">
              <Link href="/services">Capabilities</Link>
              <span aria-hidden="true">/</span>
              {c.kind === 'function' ? 'By team' : 'By sector'}
            </p>
            <h1 className="d1 cat-h">{c.name}</h1>
            <p className="mono cat-tag">{c.tag}</p>
            <p className="lede cat-l">{c.blurb}</p>
            {c.note && (
              <p className="cat-note">
                <span className="mono">Worth saying up front</span>
                {c.note}
              </p>
            )}
          </div>
        </section>

        <section className="sec-sm">
          <div className="shell">
            <header className="sec-head" data-r>
              <h2 className="d3">{c.items.length} solutions.</h2>
              <p className="lede measure-w">
                Each one links through to what it does, what it plugs into, what it produces, and what it will not do.
              </p>
            </header>
            <ul className="sols">
              {c.items.map((s, i) => <SolCard key={s.slug} sol={s} i={i} />)}
            </ul>
          </div>
        </section>

        <section className="close">
          <div className="close-img" aria-hidden="true">
            <img src="/void/hero-pause.webp" alt="" loading="lazy" decoding="async" />
          </div>
          <div className="shell center close-in">
            <h2 className="d2 measure" data-r>Not seeing your workflow?</h2>
            <p className="lede measure-w close-l" data-r style={{ '--rd': '80ms' }}>
              This is what we have built more than once. Most engagements start with something that is not on the list —
              tell us what is eating your week and we will say honestly whether it is worth building.
            </p>
            <div className="close-cta" data-r style={{ '--rd': '160ms' }}>
              <Link href="/contact" className="btn">Start the conversation <Chevron /></Link>
            </div>
          </div>
        </section>

        <NextPage href={`/services/for/${next.id}`} title={next.name} />
      </main>
      <Footer />
    </div>
  )
}
