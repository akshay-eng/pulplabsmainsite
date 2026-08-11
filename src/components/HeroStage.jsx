import { lazy, Suspense, useEffect, useState } from 'react'

const HeroCore = lazy(() => import('./HeroCore'))

/** WebGL support probe. Cached — creating throwaway contexts is not free, and
 *  browsers cap how many live at once. */
let webglOk = null
function supportsWebGL() {
  if (webglOk !== null) return webglOk
  try {
    const canvas = document.createElement('canvas')
    webglOk = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    webglOk = false
  }
  return webglOk
}

/* Static stand-in: shown while the WebGL chunk loads, and permanently when
   WebGL is unavailable or the visitor asked for reduced motion. Pure CSS, so
   it costs nothing and never looks like a broken canvas. */
export function CoreFallback() {
  return (
    <div className="core-fallback" aria-hidden="true">
      <span className="core-fallback-orb" />
      <span className="core-fallback-ring" />
      <span className="core-fallback-ring core-fallback-ring-2" />
    </div>
  )
}

export default function HeroStage() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // A continuously animating shader is exactly what reduced-motion is for.
    if (reduced || !supportsWebGL()) return

    // Defer past first paint so the shader compile never delays the headline.
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setEnabled(true), { timeout: 1200 })
      : setTimeout(() => setEnabled(true), 400)

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id)
      else clearTimeout(id)
    }
  }, [])

  if (!enabled) return <CoreFallback />

  return (
    <Suspense fallback={<CoreFallback />}>
      <div className="core-canvas">
        <HeroCore />
      </div>
    </Suspense>
  )
}
