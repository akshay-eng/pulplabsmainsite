'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import * as Tabs from '@radix-ui/react-tabs'
import Chevron from '@/components/apple/Chevron'
import SolCard from './SolCard'
import ProjectCard from './ProjectCard'
import { functions } from '@/data/functions'
import { byFunction } from '@/data/capabilities'
import { products, accelerators } from '@/data/products'

/* The catalogue, cut two ways, in one rail.
 *
 * The top two tabs are what PulpLabs has built and published — code a visitor
 * can go and read. The three below them are the client catalogue, cut by the
 * team that owns the queue, because that is how buyers arrive: "I run IT
 * operations", not "I would like to browse practice areas".
 *
 * The order is the argument. A consultancy claiming engineering depth should
 * lead with the engineering, and a repository is the only claim on this page
 * that a sceptical reader can verify for themselves in thirty seconds. The
 * client catalogue follows, and defaults to open, because that is what most
 * visitors came for.
 *
 * Radix Tabs carries the mechanics — tablist/tabpanel roles, roving focus,
 * vertical arrow-key navigation — and imposes no styles, so the whole look
 * stays in void.css. Inactive panels are unmounted, which means a tab switch
 * re-adds the cards to the DOM and the reveal observer in lib/apple-motion
 * staggers them in again.
 */

const OPEN_TABS = [
  {
    id: 'products',
    label: 'Our Products',
    group: 'Built here',
    heading: ['Products we build', 'and publish.'],
    blurb:
      'Open repositories, not case studies. Each one came out of a problem we hit on client work and kept hitting, so we built the general version and published it. Read the code before you decide whether we can engineer.',
    items: products,
  },
  {
    id: 'accelerators',
    label: 'Our Accelerators',
    group: 'Built here',
    heading: ['Accelerators that', 'shorten an engagement.'],
    blurb:
      'An accelerator removes the expensive, repetitive part of a piece of work without removing the review. This one is open, so you can see exactly what it automates and exactly where it stops and asks a person.',
    items: accelerators,
  },
]

export default function FunctionExplorer() {
  /* Defaults to the client catalogue rather than the first tab: most visitors
     arrive wanting to know what we do for them, and the two open-source tabs
     are there for the reader who wants proof, not as the lead. */
  const [active, setActive] = useState('it-operations')
  const listRef = useRef(null)

  /* Below 900px the rail collapses to a horizontal scroller, and the default
     tab is the third chip — so it starts off-screen and a visitor sees two
     chips that do NOT match the panel underneath them. Bring the active chip
     into view.

     scrollLeft rather than scrollIntoView: the latter also scrolls the
     document, which would yank the page on load. */
  useEffect(() => {
    const list = listRef.current
    if (!list || list.scrollWidth <= list.clientWidth) return

    const chip = list.querySelector('[data-state="active"]')
    if (!chip) return

    const left = chip.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    list.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' })
  }, [active])

  return (
    <Tabs.Root
      className="xp"
      value={active}
      onValueChange={setActive}
      orientation="vertical"
      activationMode="automatic"
    >
      <aside className="xp-rail" data-r>
        <p className="mono xp-hint">Use tabs to explore more</p>

        <Tabs.List className="xp-tabs" aria-label="What PulpLabs builds" ref={listRef}>
          <span className="mono xp-group" aria-hidden="true">Built here</span>
          {OPEN_TABS.map((t) => (
            <Tabs.Trigger key={t.id} value={t.id} className="mono xp-tab">
              {t.label}
              <span className="xp-dot" aria-hidden="true" />
            </Tabs.Trigger>
          ))}

          <span className="mono xp-group" aria-hidden="true">Built for you</span>
          {functions.map((f) => (
            <Tabs.Trigger key={f.id} value={f.id} className="mono xp-tab">
              {f.name}
              <span className="xp-dot" aria-hidden="true" />
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </aside>

      {/* ── Open source: products and accelerators ────────────────────── */}
      {OPEN_TABS.map((t) => (
        <Tabs.Content key={t.id} value={t.id} className="xp-panel">
          <h3 className="d3 xp-h">
            {t.heading[0]} <span className="dim">{t.heading[1]}</span>
          </h3>
          <p className="body xp-blurb">{t.blurb}</p>

          {/* A lone card in a two-up grid leaves half a row empty and reads as
              a missing item rather than a deliberate one. data-single flips it
              to a side-on featured layout that fills the row. */}
          <ul className="projs" data-single={t.items.length === 1 || undefined}>
            {t.items.map((p, i) => (
              <ProjectCard key={p.slug} project={p} i={i} />
            ))}
          </ul>

          <div className="xp-more">
            <Link href="/contact" className="btn">
              Talk to whoever built it <Chevron />
            </Link>
            <a href="https://github.com/pulplabs" className="btn btn-ghost" target="_blank" rel="noreferrer">
              More on GitHub
            </a>
          </div>
        </Tabs.Content>
      ))}

      {/* ── Client catalogue, by team ─────────────────────────────────── */}
      {functions.map((f) => (
        <Tabs.Content key={f.id} value={f.id} className="xp-panel">
          <h3 className="d3 xp-h">
            AI for <span className="dim">{f.name}.</span>
          </h3>
          <p className="body xp-blurb">{f.blurb}</p>

          <ul className="caps xp-caps">
            {byFunction(f.id).map((sol, i) => (
              <SolCard key={sol.slug} sol={sol} i={i} />
            ))}
          </ul>

          {/* The two claims that used to be full-width sections of their own.
              Read here, next to the systems they describe, they are answers to
              a question the cards above have just raised. */}
          <ul className="xp-assure">
            {f.assurances.map(([t, d], i) => (
              <li key={t} data-r style={{ '--rd': `${i * 70}ms` }}>
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" fill="none"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  <b className="h4">{t}</b>
                  <span className="body">{d}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="xp-more">
            <Link href={`/services/for/${f.id}`} className="btn">
              Everything for {f.name} <Chevron />
            </Link>
            <Link href="/services" className="btn btn-ghost">
              Explore the full catalogue
            </Link>
          </div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
