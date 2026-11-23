'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { regions } from '@/data/regions'
import { IconArrowUpRight } from '@/components/icons/Glyphs'

/* Local time in a zone, e.g. "14:05". Empty on the server and on the first
   client render — the time differs between the two, and rendering it during
   hydration would be a guaranteed mismatch. */
function useClock(tz) {
  const [now, setNow] = useState(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    let id
    tick()
    // Align to the minute boundary, then tick once a minute
    const align = setTimeout(() => {
      tick()
      id = setInterval(tick, 60_000)
    }, 60_000 - (Date.now() % 60_000))
    return () => {
      clearTimeout(align)
      clearInterval(id)
    }
  }, [tz])
  if (!now) return { time: '', hours: false }
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(now)
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', weekday: 'short', hour12: false }).formatToParts(now)
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const wd = parts.find((p) => p.type === 'weekday')?.value
  // Describes the region's local business day — not a promise of availability
  const hours = wd !== 'Sat' && wd !== 'Sun' && h >= 9 && h < 18
  return { time, hours }
}

function RegionCard({ r, i }) {
  const { time, hours } = useClock(r.tz)
  return (
    <li className="rg-card lg lg-card" data-r style={{ '--rd': `${i * 90}ms` }}>
      <div className="rg-top">
        <h3 className="d3 rg-name">{r.name}</h3>
        <span className="mono rg-state" data-on={hours || undefined}>
          <span className="rg-dot" aria-hidden="true" />
          {time ? (hours ? 'Working hours' : 'After hours') : ' '}
        </span>
      </div>
      <p className="rg-time" aria-label={time ? `Local time in ${r.name}: ${time}` : undefined}>
        {time || '--:--'}
      </p>
      <p className="mono rg-zones">{r.zones}</p>
    </li>
  )
}

/* "Where we work" — the three regions as glass cards with live local time.
   The clock is the point: it says "we keep your hours" without a claim
   that needs footnoting. */
export default function Regions() {
  return (
    <section className="sec rg" aria-labelledby="rg-title">
      <div className="shell-wide">
        <header className="sec-h rg-head" data-r>
          <p className="mono">Where we work</p>
          <h2 className="d2" id="rg-title">
            India, Canada and Europe. <span className="dim">In your hours, inside your rules.</span>
          </h2>
          <p className="lede rg-lede">
            We work with teams across three regions. Calls and builds run in your time zone, and systems deploy inside
            your own boundary — so your data stays in your region, not ours.
          </p>
        </header>

        <ul className="rg-grid">
          {regions.map((r, i) => (
            <RegionCard key={r.id} r={r} i={i} />
          ))}
        </ul>

        <div className="rg-cta" data-r>
          <Link href="/contact" className="btn">
            Book a call in your time zone <IconArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* Compact chips for the hero */
export function RegionChips() {
  return (
    <div className="rg-chips">
      <span className="mono">Working with teams in</span>
      <ul>
        {regions.map((r) => (
          <li key={r.id} className="rg-chip lg lg-pill">
            <span className="rg-dot" aria-hidden="true" />
            {r.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
