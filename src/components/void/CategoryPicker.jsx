'use client'

import { useState } from 'react'
import Link from 'next/link'
import { functions, industries } from '@/data/functions'

/* Pick a category, then go and read it.
 *
 * An earlier pass filtered all seventeen systems in place on this page. It
 * worked, but it put the entire catalogue under the tiles by default, which is
 * exactly the wall this section exists to avoid. So the tiles are links again
 * — the difference from the version before that is there is now ONE grid with
 * a lens toggle, rather than two grids stacked as competing taxonomies.
 */
export default function CategoryPicker() {
  const [lens, setLens] = useState('team')
  const cats = lens === 'team' ? functions : industries

  return (
    <div className="picker">
      <div className="picker-bar">
        <div className="finder-lens" role="tablist" aria-label="Browse the catalogue by">
          {[['team', 'By team'], ['sector', 'By sector']].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={lens === id}
              className="finder-lb" data-on={lens === id || undefined} onClick={() => setLens(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="tiles" key={lens}>
        {cats.map((c, i) => (
          <li className="tile" key={c.id} style={{ '--rd': `${i * 45}ms` }}>
            <Link href={`/services/for/${c.id}`} className="tile-link">
              <span className="tile-art">
                <img src={`/void/cat/${lens === 'team' ? 'dept' : 'ind'}-${c.id}.webp`} alt="" loading="lazy" decoding="async" />
                <span className="tile-chip">{c.name}</span>
              </span>
              <span className="tile-body">
                <span className="tile-t">{c.name}</span>
                <span className="body tile-d">{c.tag}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
