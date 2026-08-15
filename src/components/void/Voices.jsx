'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* Client testimonials, two at a time.
 *
 * A scroll-snap track rather than index maths: it gives native touch swipe on
 * phones for free, and lets the same markup show two side by side on a wide
 * screen and one on a narrow one without the component knowing which.
 *
 * Each quote carries its client's brand — their mark on a plate in their own
 * ground colour, and a wash of their accent in the corner. That is the one
 * place colour on this site is not ours, which is the point: the section is
 * somebody else speaking. The logos are shown unmodified rather than knocked
 * out or recoloured; a trademark recoloured to fit a palette stops being the
 * trademark. */
const VOICES = [
  {
    q: 'Quotes that took our team two days now go out in twenty minutes. The PulpLabs team understood our pricing rules better than some of our own hires.',
    name: 'Name Surname',
    role: 'Director',
    org: 'Power & Pack Solutions',
    logo: '/logos/client-pps.webp',
    ground: '#f8f8f8',
    accent: '222, 0, 13',
    // 143x39 in the source, so it is held small on purpose — scaled to match
    // the other it would only be a bigger blur.
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
  const track = useRef(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)

  // How many pages there are depends on how many fit, which depends on the
  // viewport — so it is measured rather than assumed.
  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)))
    setPage(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener('scroll', measure, { passive: true })
    return () => { ro.disconnect(); el.removeEventListener('scroll', measure) }
  }, [measure])

  const goTo = (n) => {
    const el = track.current
    if (!el) return
    const clamped = Math.max(0, Math.min(n, pages - 1))
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(page + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(page - 1) }
  }

  return (
    <div className="vx" role="group" aria-roledescription="carousel" aria-label="Client testimonials">
      <div className="vx-track" ref={track} tabIndex={0} onKeyDown={onKey}>
        {VOICES.map((v) => (
          <blockquote className="vx-item" key={v.org} style={{ '--accent': v.accent }}>
            <span className="vx-wash" aria-hidden="true" />
            <p className="vx-q">{v.q}</p>
            <footer className="vx-foot">
              <span className="vx-plate" style={{ background: v.ground }}>
                <img src={v.logo} alt={v.org} className={v.small ? 'is-small' : undefined}
                  loading="lazy" decoding="async" />
              </span>
              <span className="vx-who">
                <span className="vx-name">{v.name}</span>
                <span className="mono vx-role">{v.role} · {v.org}</span>
              </span>
            </footer>
          </blockquote>
        ))}
      </div>

      {/* Hidden when everything already fits — controls that page through one
          page are furniture pretending to be a control. */}
      {pages > 1 && (
        <div className="vx-bar">
          <div className="vx-dots">
            {Array.from({ length: pages }, (_, n) => (
              <button key={n} type="button" className="vx-dot" data-on={n === page || undefined}
                aria-label={`Go to page ${n + 1} of ${pages}`} aria-current={n === page ? 'true' : undefined}
                onClick={() => goTo(n)} />
            ))}
          </div>
          <div className="vx-nav">
            <button type="button" className="vx-btn" aria-label="Previous testimonials"
              disabled={page === 0} onClick={() => goTo(page - 1)}>
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" className="vx-btn" aria-label="Next testimonials"
              disabled={page >= pages - 1} onClick={() => goTo(page + 1)}>
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
