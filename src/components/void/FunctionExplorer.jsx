'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Tabs from '@radix-ui/react-tabs'
import Chevron from '@/components/apple/Chevron'
import SolCard from './SolCard'
import { functions } from '@/data/functions'
import { byFunction } from '@/data/capabilities'

/* A function-first cut of the catalogue for the home page: a rail of tabs on
   the left, the active function's solutions on the right, rendered with the
   same SolCard the catalogue itself uses so the two surfaces cannot drift.

   Radix Tabs carries the mechanics — tablist/tabpanel roles, roving focus,
   vertical arrow-key navigation — and imposes no styles, so the whole look
   stays in void.css. Inactive panels are unmounted, which means a tab switch
   re-adds the cards to the DOM and the reveal observer in lib/apple-motion
   staggers them in again.

   The default tab is IT Operations for the same reason it leads everywhere
   else on the site: it is where all four production accelerators live. */
export default function FunctionExplorer() {
  const [active, setActive] = useState('it-operations')

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
        <Tabs.List className="xp-tabs" aria-label="Business functions">
          {functions.map((f) => (
            <Tabs.Trigger key={f.id} value={f.id} className="mono xp-tab">
              {f.name}
              <span className="xp-dot" aria-hidden="true" />
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </aside>

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
