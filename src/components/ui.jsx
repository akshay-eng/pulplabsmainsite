'use client'

/* Shared interactive primitives — grouped like icons.jsx rather than split into
 * one file each, since none of them carry meaningful weight alone. */

import { Children } from 'react'
import { useCountUp, useMagnetic, useSpotlight } from '../lib/motion'

/* --------------------------------------------------------------------------
   Marquee — seamless horizontal loop.

   Children are rendered twice and the track translates exactly -50%, so the
   second copy lands where the first began and the seam is invisible. Pauses on
   hover so a reader can actually stop on a logo.
   -------------------------------------------------------------------------- */
export function Marquee({ children, speed = 42, reverse = false, className = '' }) {
  const items = Children.toArray(children)
  return (
    <div className={`marquee ${className}`} data-reverse={reverse ? 'true' : undefined}>
      <div className="marquee-track" style={{ '--marquee-duration': `${speed}s` }}>
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
            {items.map((child, i) => (
              <div className="marquee-item" key={i}>
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Counter — a stat that counts up when it scrolls into view.
   `prefix`/`suffix` sit outside the animated value so "-38%" and "4×" keep
   their glyphs while only the number moves.
   -------------------------------------------------------------------------- */
export function Counter({ to, prefix = '', suffix = '', decimals = 0, duration = 1500, className = '' }) {
  const [ref, value] = useCountUp(to, { duration, decimals })
  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* --------------------------------------------------------------------------
   SpotlightCard — a warm radial glow that tracks the cursor across the card.
   The glow lives in a ::before painted from --mx/--my (see components.css);
   on touch devices the vars never update and it stays invisible.
   -------------------------------------------------------------------------- */
export function SpotlightCard({ children, className = '', as: Tag = 'div', ...rest }) {
  const ref = useSpotlight()
  return (
    <Tag ref={ref} className={`spotlight ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/* --------------------------------------------------------------------------
   Magnetic — wraps a control so it leans toward the cursor.
   Fine-pointer only; see useMagnetic.
   -------------------------------------------------------------------------- */
export function Magnetic({ children, strength = 0.14, max = 5, className = '' }) {
  const ref = useMagnetic(strength, max)
  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  )
}

/* --------------------------------------------------------------------------
   Stat — a labelled figure used across the bento grids.
   -------------------------------------------------------------------------- */
export function Stat({ value, label, accent = 'var(--tangerine)', prefix = '', suffix = '', decimals = 0 }) {
  const numeric = typeof value === 'number'
  return (
    <div className="stat">
      <div className="stat-value" style={{ color: accent }}>
        {numeric ? (
          <Counter to={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        ) : (
          value
        )}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
