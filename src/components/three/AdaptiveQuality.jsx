'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

/* ==========================================================================
   AdaptiveQuality — holds a scene at display refresh by trading resolution.

   Every WebGL surface on the site starts at the display's native pixel ratio
   (capped at `max`, 2 by default — so a 4K panel at 2× is rendered at its
   full 3840-pixel width). It then watches its own frame time:

     • a sustained run of slow frames (under ~55 fps) steps the pixel ratio
       down by a quarter, never below `min`;
     • a long run of comfortable frames steps it back up.

   Hysteresis is deliberately lopsided — quick to back off, slow to recover —
   so it does not oscillate. Frames from a background tab (huge deltas) are
   ignored rather than read as "this GPU is slow".

   Mount it inside any <Canvas>; it renders nothing.
   ========================================================================== */
export default function AdaptiveQuality({ min = 1, max = 2 }) {
  const { setDpr, viewport } = useThree()
  const slow = useRef(0)
  const fast = useRef(0)
  const avg = useRef(1 / 60)

  useFrame((_, dt) => {
    if (dt > 0.1 || document.hidden) return // background tab or a hitch
    avg.current += (dt - avg.current) * 0.1

    const dpr = viewport.dpr
    const ceiling = Math.min(max, window.devicePixelRatio || 1)

    if (avg.current > 1 / 55) {
      fast.current = 0
      if (++slow.current > 45 && dpr > min) {
        setDpr(Math.max(min, dpr - 0.25))
        slow.current = 0
      }
    } else if (avg.current < 1 / 59) {
      slow.current = 0
      if (++fast.current > 240 && dpr < ceiling) {
        setDpr(Math.min(ceiling, dpr + 0.25))
        fast.current = 0
      }
    }
  })

  return null
}

/** Starting pixel ratio: native, capped — 4K-sharp on a 2× display. */
export function nativeDpr(max = 2) {
  if (typeof window === 'undefined') return 1
  return Math.min(max, window.devicePixelRatio || 1)
}
