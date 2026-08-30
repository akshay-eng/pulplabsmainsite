'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PlatformMark from '@/components/void/PlatformMark'
import { platforms, formats, curriculum, custom } from '@/data/enablement'

/* Fifteen curricula plus a custom option is far more than anyone will read.
   Two axes, one panel: pick a platform, pick a length, see that one. Everything
   not selected stays collapsed to a single line of label — the shape of the
   catalogue is legible without any of its contents being in the way. */
export default function EnablementExplorer() {
  const [p, setP] = useState('claude')
  const [f, setF] = useState('three-day')

  /* Deep links arrive as /services/enablement#one-week. Read on mount and on
     hashchange — a hash rather than a query string, because useSearchParams
     would force this whole page under a Suspense boundary for one string. */
  useEffect(() => {
    const ids = new Set([...formats.map((x) => x.id), 'custom'])
    const apply = () => {
      const h = window.location.hash.slice(1)
      if (ids.has(h)) setF(h)
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  const platform = platforms.find((x) => x.id === p)
  const isCustom = f === 'custom'
  const format = formats.find((x) => x.id === f)
  const c = isCustom ? null : curriculum[p][f]

  return (
    <div className="ex">
      <div className="ex-pick">
        <p className="mono ex-lbl" id="ex-platform">Platform</p>
        <div className="ex-tabs" role="tablist" aria-labelledby="ex-platform">
          {platforms.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={p === x.id}
              className="ex-tab" data-on={p === x.id || undefined} onClick={() => setP(x.id)}>
              <span className="ex-tab-n"><PlatformMark id={x.id} />{x.name}</span>
              <span className="mono ex-tab-v">{x.vendor}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="body ex-blurb">{platform.blurb}</p>

      <div className="ex-pick">
        <p className="mono ex-lbl" id="ex-format">Format</p>
        <div className="ex-tabs is-fmt" role="tablist" aria-labelledby="ex-format">
          {formats.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={f === x.id}
              className="ex-tab" data-on={f === x.id || undefined} onClick={() => setF(x.id)}>
              <span className="ex-tab-n">{x.name}</span>
              <span className="mono ex-tab-v">{x.length}</span>
            </button>
          ))}
          <button type="button" role="tab" aria-selected={isCustom}
            className="ex-tab" data-on={isCustom || undefined} onClick={() => setF('custom')}>
            <span className="ex-tab-n">Custom</span>
            <span className="mono ex-tab-v">Scoped</span>
          </button>
        </div>
      </div>

      {/* Keyed so the panel re-mounts on every change and the reveal replays —
          otherwise swapping curricula silently rewrites text in place and it is
          easy to miss that anything happened. */}
      <div className="ex-panel" key={`${p}-${f}`}>
        {isCustom ? (
          <>
            <header className="ex-head">
              <h3 className="h4">{custom.name} · {platform.name}</h3>
              <p className="mono">By arrangement</p>
            </header>
            <p className="body ex-lede">{custom.blurb}</p>
            <ul className="ex-mods">
              {custom.points.map(([t, d], i) => (
                <li key={t}>
                  <span className="mono ex-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ex-mt">{t}</span>
                  <span className="body ex-md">{d}</span>
                </li>
              ))}
            </ul>
            <div className="ex-out is-cta">
              <p className="body">Tell us the platforms, the constraints and who is in the room. We will come back with a curriculum and a price.</p>
              <Link href="/contact" className="btn">Scope a custom cohort</Link>
            </div>
          </>
        ) : (
          <>
            <header className="ex-head">
              <h3 className="h4">{platform.name} · {format.name}</h3>
              <p className="mono">{format.length} · {format.cohort} people</p>
            </header>
            <p className="body ex-lede">{format.who}</p>

            <ul className="ex-mods">
              {c.modules.map(([t, d], i) => (
                <li key={t}>
                  <span className="mono ex-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ex-mt">{t}</span>
                  <span className="body ex-md">{d}</span>
                </li>
              ))}
            </ul>

            <div className="ex-out">
              <p className="mono ex-lbl">By the end, your team can</p>
              <ul className="ex-outs">
                {c.outcomes.map((o) => (
                  <li key={o}>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.5" fill="none"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="body">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
