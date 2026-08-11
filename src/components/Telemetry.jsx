'use client'

/* Telemetry primitives — radial gauges and line icons for the outcomes panel.
 *
 * Gauges are plain SVG with a dash-offset transition rather than a chart
 * library: one arc per metric doesn't justify a dependency, and this way the
 * fill animates off the same reveal system as everything else. */

import { useEffect, useRef, useState } from 'react'

/** Circumference of the r=26 track, precomputed so the dash maths stays exact. */
const R = 26
const CIRC = 2 * Math.PI * R

export function GaugeRing({
  value = 0,
  max = 100,
  accent = 'var(--tangerine)',
  icon = null,
  size = 74,
  /* The lead gauge sits on the tangerine ground rather than a white card, so
     its track has to be light instead of ink to stay visible. */
  track = 'rgba(31,23,16,.12)',
}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { threshold: 0.5 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  const pct = Math.max(0, Math.min(1, value / max))

  return (
    <div className="gauge" ref={ref} style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
        {/* Track */}
        <circle cx="32" cy="32" r={R} fill="none" stroke={track} strokeWidth="3" />
        {/* Fill — rotated so 0 starts at 12 o'clock */}
        <circle
          className="gauge-fill"
          cx="32"
          cy="32"
          r={R}
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
          strokeDasharray={CIRC}
          strokeDashoffset={shown ? CIRC * (1 - pct) : CIRC}
        />
      </svg>
      {icon && <span className="gauge-icon" style={{ color: accent }}>{icon}</span>}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Line icons — 24px grid, 1.7 stroke, round caps to match the existing set.
   -------------------------------------------------------------------------- */

const base = {
  viewBox: '0 0 24 24',
  width: 22,
  height: 22,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconPulse = () => (
  <svg {...base}>
    <path d="M2 12h4l3-8 4 16 3-8h6" />
  </svg>
)

export const IconBolt = () => (
  <svg {...base}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
)

export const IconClock = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)

export const IconStack = () => (
  <svg {...base}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>
)

export const IconBadge = () => (
  <svg {...base}>
    <path d="M12 2.5 15 6l4.7.7-3.4 3.3.8 4.7L12 12.5 6.9 14.7l.8-4.7L4.3 6.7 9 6l3-3.5Z" />
    <path d="M8.5 15.5 7 22l5-2.6L17 22l-1.5-6.5" />
  </svg>
)
