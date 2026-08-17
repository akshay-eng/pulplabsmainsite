'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Tabs from '@radix-ui/react-tabs'
import Chevron from '@/components/apple/Chevron'
import LoopVideo from '@/components/void/LoopVideo'

/* Case studies as a tab strip over a full-bleed stage: a centred row of client
   tabs, and below it one wide media panel with the story card overlaid on the
   left. Same Radix Tabs primitive as FunctionExplorer, horizontal this time.

   Content comes from the case_studies table (seeded from the two engagements
   the clients have signed off), passed down from the server route — this
   component renders nothing if the table is empty, so an unseeded database
   never shows an empty frame. */
export default function CaseStudies({ cases = [] }) {
  const [active, setActive] = useState(cases[0]?.slug)
  if (!cases.length) return null

  return (
    <Tabs.Root value={active} onValueChange={setActive} activationMode="automatic">
      <Tabs.List className="cse-tabs" aria-label="Case studies">
        {cases.map((c) => (
          <Tabs.Trigger key={c.slug} value={c.slug} className="cse-tab">
            {c.client}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {cases.map((c) => (
        <Tabs.Content key={c.slug} value={c.slug} className="cse-stage">
          <div className="cse-media" aria-hidden="true">
            {c.loop_video ? (
              /* Real footage of the client's working environment. LoopVideo
                 refuses to fetch under reduced-motion, Save-Data or off-screen
                 and falls back to cover_image, so the stage is never empty. */
              <LoopVideo src={c.loop_video} poster={c.cover_image} className="cse-loop" />
            ) : (
              c.cover_image && <img src={c.cover_image} alt="" loading="lazy" decoding="async" />
            )}
            <span className="cse-scrim" aria-hidden="true" />
          </div>

          <article className="cse-card" data-r>
            <p className="mono cse-k">
              {c.client}
              {c.industry ? ` · ${c.industry}` : ''}
            </p>
            <h3 className="d3 cse-t">{c.title}</h3>
            <p className="body cse-s">{c.summary}</p>

            {c.metrics?.length > 0 && (
              <ul className="cse-out">
                {c.metrics.map((m) => (
                  <li key={m.figure + m.caption}>
                    <b>{m.figure}</b>
                    <span className="mono">{m.caption}</span>
                  </li>
                ))}
              </ul>
            )}

            <Link href={`/case-studies/${c.slug}`} className="cse-more">
              Read the story <Chevron />
            </Link>
          </article>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
