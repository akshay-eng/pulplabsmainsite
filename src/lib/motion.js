'use client'

import { useEffect, useRef, useState } from 'react'

/* Guarded for SSR: client components still render once on the server, where
   there is no window. Every caller must tolerate `false` on that first pass. */
const REDUCED = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)

/* --------------------------------------------------------------------------
   useRevealObserver — mounted once at app level.

   One IntersectionObserver for the whole document plus a MutationObserver to
   pick up nodes added on route change. Per-component observers were the
   alternative; this keeps the JSX to a bare `data-reveal` attribute and means
   a new section animates without wiring anything up.
   -------------------------------------------------------------------------- */
export function useRevealObserver() {
  useEffect(() => {
    if (REDUCED()) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.setAttribute('data-reveal', 'in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const passed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0
          if (!entry.isIntersecting && !passed) continue
          entry.target.setAttribute('data-reveal', 'in')
          io.unobserve(entry.target) // reveal is one-way; re-animating on scroll-up is nauseating
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    const scan = () => {
      document.querySelectorAll('[data-reveal=""], [data-reveal]:not([data-reveal="in"])').forEach((el) => io.observe(el))
    }

    scan()

    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}

/* --------------------------------------------------------------------------
   useStuck — true once the page has scrolled past `offset`.
   Drives the navbar's glass treatment.
   -------------------------------------------------------------------------- */
export function useStuck(offset = 8) {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    let frame = null
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        setStuck(window.scrollY > offset)
        frame = null
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [offset])

  return stuck
}

/* --------------------------------------------------------------------------
   useCountUp — animates 0 → target once the node scrolls into view.
   Eased with the same expo-out curve as the reveal so numbers and cards feel
   like one system.
   -------------------------------------------------------------------------- */
export function useCountUp(target, { duration = 1500, decimals = 0 } = {}) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    // Reduced motion: jump straight to the final value rather than counting.
    if (REDUCED()) {
      setValue(target)
      return
    }

    let raf = null
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()

        const start = performance.now()
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 4) // expo-out
          setValue(Number((target * eased).toFixed(decimals)))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    io.observe(node)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [target, duration, decimals])

  return [ref, value]
}

/* --------------------------------------------------------------------------
   useMagnetic — element leans toward the cursor, then springs back.
   Pointer-type gated: on touch there is no hover, and running this on a tap
   would fight the scroll.
   -------------------------------------------------------------------------- */
export function useMagnetic(strength = 0.14, max = 5) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || REDUCED()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const clamp = (v) => Math.max(-max, Math.min(max, v))

    const onMove = (e) => {
      const r = node.getBoundingClientRect()
      // Clamped hard: unbounded, a wide button tracked the cursor across its
      // whole width and read as the button "dancing" rather than responding.
      const dx = clamp((e.clientX - (r.left + r.width / 2)) * strength)
      const dy = clamp((e.clientY - (r.top + r.height / 2)) * strength)
      node.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
    }
    const onLeave = () => {
      node.style.transform = 'translate3d(0,0,0)'
    }

    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    return () => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return ref
}

/* --------------------------------------------------------------------------
   useSpotlight — writes cursor position into --mx/--my so CSS can paint a
   radial glow that tracks the pointer across a card.
   -------------------------------------------------------------------------- */
export function useSpotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = (e) => {
      const r = node.getBoundingClientRect()
      node.style.setProperty('--mx', `${e.clientX - r.left}px`)
      node.style.setProperty('--my', `${e.clientY - r.top}px`)
    }

    node.addEventListener('pointermove', onMove)
    return () => node.removeEventListener('pointermove', onMove)
  }, [])

  return ref
}

/* --------------------------------------------------------------------------
   useParallax — translates a node against scroll. Bounded so a long page
   cannot drift the art off its stage.
   -------------------------------------------------------------------------- */
export function useParallax(depth = 0.12, max = 60) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || REDUCED()) return

    let frame = null
    const update = () => {
      frame = null
      const r = node.getBoundingClientRect()
      const centre = r.top + r.height / 2 - window.innerHeight / 2
      const shift = Math.max(-max, Math.min(max, -centre * depth))
      node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [depth, max])

  return ref
}
