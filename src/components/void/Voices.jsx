'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getClient } from '@/data/clients'

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
  /* The client record is spread FIRST and the quote's own fields follow it —
     the record carries `name` for the company, this carries `name` for the
     person, and the person has to win. */
  {
    ...getClient('pps'),
    org: getClient('pps').name,
    q: 'Quotes that took our team two days now go out in twenty minutes. The PulpLabs team understood our pricing rules better than some of our own hires.',
    name: 'Srinivas',
    role: 'Director',
  },
  {
    ...getClient('ue'),
    org: getClient('ue').name,
    q: 'Our researchers stopped tagging transcripts and started interpreting them. The coding framework is still ours. The machine just keeps up with it now.',
    name: 'Padmini Ram',
    role: 'Principal',
  },

  /* DRAFT QUOTES. The clients are real, the logos are theirs, the names are
     the people who actually hold those roles, but THE WORDS ARE STILL OURS.
     Naming a person raises the stakes rather than lowering them: an invented
     sentence in Ashok's mouth is worse than the same sentence unattributed,
     because it now looks like something he said. Get all four signed off in
     writing before launch. The two above are drafts as well. */
  {
    ...getClient('moveforward'),
    org: getClient('moveforward').name,
    q: 'They shipped the boring half first, the bit that cleaned up our data. It made everything after it cheaper, which nobody else had suggested.',
    name: 'Ashok',
    role: 'Founder',
    draft: true,
  },
  {
    ...getClient('bluesea'),
    org: getClient('bluesea').name,
    q: 'Our field reports used to sit in an inbox for a week. They are summarised and routed the same day now, and the escalation rules are ones we wrote.',
    name: 'Ananth',
    role: 'Operations Director',
    draft: true,
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
          <blockquote className="vx-item" key={v.org} data-ph={!v.logo || undefined}
            style={{ '--accent': v.accent ?? '255, 255, 255' }}>
            <span className="vx-wash" aria-hidden="true" />
            <p className="vx-q">{v.q}</p>
            <footer className="vx-foot">
              {!v.logo ? (
                <span className="vx-mark" aria-hidden="true" />
              ) : (
                <span className="vx-plate" style={{ background: v.ground }}>
                  <img src={v.logo} alt={v.org} data-shape={v.shape} loading="lazy" decoding="async" />
                </span>
              )}
              <span className="vx-who">
                {v.name && <span className="vx-name">{v.name}</span>}
                <span className="mono vx-role">{v.role}{v.name ? ' · ' : ''}{v.name ? v.org : ''}</span>
                {!v.name && <span className="mono vx-org">{v.org}</span>}
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
