'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* Client testimonials, one at a time.
 *
 * Each slide carries its client's brand: the logo on a plate in the company's
 * own ground colour, and a wash of their accent behind the quote. That is the
 * one place on this site where colour is not ours — which is the point, since
 * the whole section is somebody else speaking.
 *
 * The logos are shown unmodified on their own background rather than knocked
 * out or recoloured. A trademark recoloured to fit a palette stops being the
 * trademark, and keying white out of a 150px JPEG-adjacent PNG leaves fringing
 * on every antialiased edge. */
const VOICES = [
  {
    q: 'Quotes that took our team two days now go out in twenty minutes. The PulpLabs team understood our pricing rules better than some of our own hires.',
    name: 'Name Surname',
    role: 'Director',
    org: 'Power & Pack Solutions',
    logo: '/logos/client-pps.webp',
    ground: '#f8f8f8',
    accent: '222, 0, 13',
    // 143x39 in the original, so it is held small deliberately — scaled up it
    // would only be a bigger blur.
    small: true,
  },
  {
    q: 'Our researchers stopped tagging transcripts and started interpreting them. The coding framework is still ours — the machine just keeps up with it now.',
    name: 'Name Surname',
    role: 'Principal',
    org: 'Urban Ethnographers',
    logo: '/logos/client-ue.webp',
    ground: '#f8c808',
    accent: '248, 200, 8',
  },
]

export default function Voices() {
  const [i, setI] = useState(0)
  const live = useRef(null)
  const v = VOICES[i]

  const go = useCallback((n) => setI((c) => (n + VOICES.length) % VOICES.length), [])

  // Left/right arrows work when the carousel itself has focus, which is what
  // a keyboard user expects from a role="group" carousel.
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1) }
  }

  useEffect(() => {
    // No autoplay: a quote you cannot finish reading is worse than no quote.
    // Announce changes instead, so a screen reader follows the manual moves.
    if (live.current) live.current.textContent = `Testimonial ${i + 1} of ${VOICES.length}`
  }, [i])

  return (
    <div
      className="vx"
      role="group"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      tabIndex={0}
      onKeyDown={onKey}
      style={{ '--accent': v.accent }}
    >
      <div className="vx-wash" aria-hidden="true" />

      <blockquote className="vx-slide" key={i}>
        <p className="vx-q">{v.q}</p>

        <footer className="vx-foot">
          <span className="vx-plate" style={{ background: v.ground }}>
            <img
              src={v.logo}
              alt={v.org}
              className={v.small ? 'is-small' : undefined}
              loading="lazy"
              decoding="async"
            />
          </span>
          <span className="vx-who">
            <span className="vx-name">{v.name}</span>
            <span className="mono vx-role">{v.role} · {v.org}</span>
          </span>
        </footer>
      </blockquote>

      <div className="vx-bar">
        <div className="vx-dots">
          {VOICES.map((x, n) => (
            <button
              key={x.org}
              type="button"
              className="vx-dot"
              data-on={n === i || undefined}
              aria-label={`Show testimonial from ${x.org}`}
              aria-current={n === i ? 'true' : undefined}
              onClick={() => setI(n)}
            />
          ))}
        </div>

        <div className="vx-nav">
          <button type="button" className="vx-btn" aria-label="Previous testimonial" onClick={() => go(i - 1)}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="vx-btn" aria-label="Next testimonial" onClick={() => go(i + 1)}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <p ref={live} className="sr-only" aria-live="polite" />
    </div>
  )
}
