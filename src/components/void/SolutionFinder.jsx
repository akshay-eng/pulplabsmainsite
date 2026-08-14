'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import SolCard from '@/components/void/SolCard'
import { functions, industries } from '@/data/functions'
import { allSolutions, byFunction } from '@/data/capabilities'

/* One catalogue, narrowed in place.
 *
 * The page previously carried two separate tile grids — by team and by sector
 * — each linking away to its own list, plus the practice areas. Three flat,
 * co-equal taxonomies and no indication which was the spine, so a visitor had
 * to understand our vocabulary before they could look at anything.
 *
 * Now the practice areas are the spine above this, and this is the one place
 * the seventeen systems live. Pick a lens, pick a category, the grid narrows.
 * Nothing navigates away until you have chosen a system, so a wrong turn costs
 * a click rather than a page load and a back button. */
export default function SolutionFinder() {
  const [lens, setLens] = useState('team')
  const [active, setActive] = useState(null)

  const cats = lens === 'team' ? functions : industries

  const shown = useMemo(() => {
    if (!active) return allSolutions
    if (lens === 'team') return byFunction(active)
    const ind = industries.find((i) => i.id === active)
    return ind ? ind.solutions.map((s) => allSolutions.find((x) => x.slug === s)).filter(Boolean) : allSolutions
  }, [lens, active])

  const activeCat = cats.find((c) => c.id === active)

  function switchLens(next) {
    setLens(next)
    setActive(null) // a category id from one lens means nothing in the other
  }

  return (
    <div className="finder">
      <div className="finder-bar">
        <div className="finder-lens" role="tablist" aria-label="Narrow the catalogue by">
          {[['team', 'By team'], ['sector', 'By sector']].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={lens === id}
              className="finder-lb" data-on={lens === id || undefined} onClick={() => switchLens(id)}>
              {label}
            </button>
          ))}
        </div>

        <p className="mono finder-count" aria-live="polite">
          {shown.length} of {allSolutions.length}
          {active && (
            <button type="button" className="finder-clear" onClick={() => setActive(null)}>
              Clear
            </button>
          )}
        </p>
      </div>

      <ul className="finder-tiles">
        {cats.map((c) => (
          <li key={c.id}>
            <button type="button" className="ftile" data-on={active === c.id || undefined}
              aria-pressed={active === c.id} onClick={() => setActive(active === c.id ? null : c.id)}>
              <span className="ftile-art">
                <img src={`/void/cat/${lens === 'team' ? 'dept' : 'ind'}-${c.id}.webp`} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="ftile-t">{c.name}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* When a category is chosen, say what makes it different before showing
          the cards — otherwise the filter is just a shorter list. */}
      {activeCat && (
        <div className="finder-note" key={activeCat.id}>
          <p className="body">{activeCat.blurb}</p>
          <Link href={`/services/for/${activeCat.id}`} className="cat-more">
            Everything on {activeCat.name}
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}

      <ul className="sols finder-grid" key={`${lens}-${active ?? 'all'}`}>
        {shown.map((s, i) => <SolCard key={s.slug} sol={s} i={Math.min(i, 8)} />)}
      </ul>
    </div>
  )
}
