'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ==========================================================================
   Case study carousel.

   Built on native scroll-snap rather than a carousel library: the track is a
   real horizontally scrollable list, so trackpad, touch-swipe and keyboard all
   work for free, it degrades to a plain scroller without JS, and there is no
   dependency to keep current. The arrows and dots just drive scrollTo.
   ========================================================================== */

export default function CaseCarousel({ items = [] }) {
  const track = useRef(null)
  const [index, setIndex] = useState(0)
  const [bounds, setBounds] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setBounds({ start: scrollLeft < 8, end: scrollLeft + clientWidth >= scrollWidth - 8 })

    // Nearest slide to the left edge, so the dots track a free scroll too.
    const slides = [...el.children]
    let nearest = 0
    let best = Infinity
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - el.scrollLeft - el.offsetLeft)
      if (d < best) {
        best = d
        nearest = i
      }
    })
    setIndex(nearest)
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      el.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  const goTo = (i) => {
    const el = track.current
    const slide = el?.children?.[i]
    if (!el || !slide) return
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }

  const step = (dir) => goTo(Math.max(0, Math.min(items.length - 1, index + dir)))

  if (items.length === 0) return null

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        ref={track}
        /* Keyboard users get arrow-key scrolling from the browser once the
           track is focusable, and a role/label so it announces sensibly. */
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Case studies"
      >
        {items.map((c, i) => (
          <article
            className="case-slide"
            key={c.slug}
            style={{ '--case-accent': c.accent }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
          >
            <Link href={`/case-studies/${c.slug}`} className="case-slide-inner">
              <div className="case-slide-art">
                {c.cover_image ? (
                  <img src={c.cover_image} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="case-slide-fallback" />
                )}
              </div>

              <div className="case-slide-copy">
                <div className="case-slide-client">
                  {c.client}
                  {c.industry && <span> · {c.industry}</span>}
                </div>
                <h3>{c.title}</h3>
                <p>{c.summary}</p>

                {c.metrics.length > 0 && (
                  <div className="case-slide-metrics">
                    {c.metrics.map((m) => (
                      <div key={m.caption + m.figure}>
                        <div className="figure">{m.figure}</div>
                        <div className="caption">{m.caption}</div>
                      </div>
                    ))}
                  </div>
                )}

                <span className="case-slide-more">Read the case study →</span>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {items.length > 1 && (
        <div className="carousel-controls">
          <div className="carousel-dots">
            {items.map((c, i) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to case study ${i + 1}`}
                aria-current={i === index || undefined}
                className="carousel-dot"
              />
            ))}
          </div>

          <div className="carousel-arrows">
            <button type="button" onClick={() => step(-1)} disabled={bounds.start} aria-label="Previous case study">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button type="button" onClick={() => step(1)} disabled={bounds.end} aria-label="Next case study">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
