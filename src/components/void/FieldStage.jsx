'use client'

import { lazy, Suspense, useEffect, useState } from 'react'

const Field = lazy(() => import('./Field'))

let ok = null
function hasWebGL() {
  if (typeof document === 'undefined') return false
  if (ok !== null) return ok
  try {
    const c = document.createElement('canvas')
    ok = Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    ok = false
  }
  return ok
}

/* Gates the WebGL layer. A continuously animating point field is exactly what
   prefers-reduced-motion exists for, and there is no static fallback needed —
   the spectral plate behind it already carries the composition. */
export default function FieldStage({ className = '', lattice = true }) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    if (!hasWebGL()) return
    // Deferred past first paint so shader compilation never delays the headline.
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setOn(true), { timeout: 1500 })
      : setTimeout(() => setOn(true), 500)
    return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id))
  }, [])

  if (!on) return null

  return (
    <div className={`field ${className}`} aria-hidden="true">
      <Suspense fallback={null}>
        <Field lattice={lattice} />
      </Suspense>
    </div>
  )
}
