'use client'

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { engagementSteps } from '@/data/home'
import { stepGlyph } from '@/components/icons/Glyphs'
import SceneBoundary from '@/components/three/SceneBoundary'

const ProcessScene = lazy(() => import('./ProcessScene'))

/* Short labels under each step — each one restates its step's own copy in
   a few words, nothing new is claimed. */
const KEYS = ['Structured audit', 'Fixed scope', 'Evaluation gates', 'Yours to keep']

/* ==========================================================================
   ProcessStory — the engagement, told as one continuous scroll.

   Layout is a tall section with a sticky stage inside it: the reader scrolls
   ~4 screens and the stage stays put while its contents change. Sticky, not
   a GSAP pin — the browser does the pinning, so there is no pin-spacer
   reflow, no jump when the trigger refreshes, and nothing to break when the
   page above it changes height.

   Scroll writes progress into a ref (read every frame by the WebGL scene)
   and into --p on the section (read by CSS for the rail). React state only
   changes when the active step changes — four renders across the whole
   section, not one per frame.

   Under prefers-reduced-motion the section collapses to a plain four-column
   list in CSS and the scene never loads.
   ========================================================================== */
export default function ProcessStory() {
  const section = useRef(null)
  const progress = useRef(0)
  const [step, setStep] = useState(0)
  const [scene, setScene] = useState(false)
  const [onScreen, setOnScreen] = useState(false)

  useEffect(() => {
    const el = section.current
    if (!el) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let webgl = false
    try {
      const c = document.createElement('canvas')
      webgl = Boolean(c.getContext('webgl2') || c.getContext('webgl'))
    } catch {}

    let frame = 0
    const read = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const travel = r.height - window.innerHeight
      const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0
      progress.current = p
      el.style.setProperty('--p', p.toFixed(4))
      // Steps change at quarter marks, biased so the last step gets a full
      // beat of dwell before the section releases.
      const s = Math.min(3, Math.floor(p * 3.999))
      setStep((prev) => (prev === s ? prev : s))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    // Load the 3D chunk when the section is a screen away, and only render
    // frames while any of it is visible.
    const io = new IntersectionObserver(
      ([e]) => {
        setOnScreen(e.isIntersecting)
        if (e.isIntersecting && webgl) setScene(true)
      },
      { rootMargin: '100% 0px' },
    )
    io.observe(el)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      io.disconnect()
    }
  }, [])

  return (
    <section ref={section} className="ps" aria-labelledby="ps-title">
      <div className="ps-stage">
        <div className="ps-canvas" aria-hidden="true">
          {scene && (
            <SceneBoundary>
              <Suspense fallback={null}>
                <ProcessScene progress={progress} active={onScreen} />
              </Suspense>
            </SceneBoundary>
          )}
        </div>

        <div className="shell-wide ps-ui">
          <header className="ps-head">
            <p className="mono">How an engagement runs</p>
            <h2 className="d2" id="ps-title">
              From first call <span className="dim">to still running.</span>
            </h2>
          </header>

          <ol className="ps-steps">
            {engagementSteps.map((s, i) => {
              const Glyph = stepGlyph[i]
              return (
                <li key={s.n} className="ps-step" data-on={i === step || undefined} aria-current={i === step ? 'step' : undefined}>
                  <span className="ps-icon lg" aria-hidden="true">
                    <Glyph size={22} />
                  </span>
                  <span className="mono ps-n">
                    {String(s.n).padStart(2, '0')} <span className="ps-of">/ 04</span>
                  </span>
                  <h3 className="d3 ps-t">{s.title}</h3>
                  <p className="body ps-b">{s.body}</p>
                  <p className="mono ps-k">{KEYS[i]}</p>
                </li>
              )
            })}
          </ol>

          {/* Rail: a track that fills with scroll, and four stops */}
          <div className="ps-rail" aria-hidden="true">
            <span className="ps-fill" />
            {engagementSteps.map((s, i) => (
              <span key={s.n} className="ps-stop" data-on={i <= step || undefined} style={{ '--i': i }}>
                <span className="mono">{s.title}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
