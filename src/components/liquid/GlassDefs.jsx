'use client'

import { useEffect, useState } from 'react'

/* ==========================================================================
   GlassDefs — the refraction engine behind every liquid-glass surface.

   Mounted once in the root layout. It does three things:

   1. Builds displacement maps for two shapes (a pill and a card) from a
      rounded-rectangle signed distance field. Each pixel stores the inward
      normal of the nearest edge, weighted so the bend is strongest at the rim
      and zero in the middle — the profile of a thick convex lens. That is
      what makes the edge of the glass visibly *bend* what sits behind it,
      rather than just blurring it.

   2. Renders those maps into SVG filters that split the backdrop into R, G
      and B and displace each by a slightly different amount, so the rim
      carries the faint chromatic fringe real glass has.

   3. Tracks the pointer over glass surfaces and writes its position to
      --mx / --my, which liquid.css uses for a specular highlight.

   Refraction through `backdrop-filter: url(#…)` only works in Chromium, so
   the filters are switched on with html[data-lg="refract"]. Safari and
   Firefox keep the frosted fallback, which is still a finished material.
   ========================================================================== */

/** Signed distance to a rounded box centred at the origin. */
function sdRoundBox(px, py, hx, hy, r) {
  const qx = Math.abs(px) - hx + r
  const qy = Math.abs(py) - hy + r
  const ox = Math.max(qx, 0)
  const oy = Math.max(qy, 0)
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r
}

/**
 * Displacement map for a w×h rounded rectangle.
 *   band — how far in from the edge the bend reaches, in map pixels
 * Encodes the displacement as R (x) and G (y) around a neutral 128.
 */
function buildMap(w, h, radius, band) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(w, h)
  const hx = w / 2
  const hy = h / 2
  const e = 0.75 // finite-difference step for the normal

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hx
      const py = y + 0.5 - hy
      const d = sdRoundBox(px, py, hx, hy, radius)
      const i = (y * w + x) * 4

      let r = 128
      let g = 128
      if (d < 0) {
        // Outward normal from the gradient of the distance field
        const nx = sdRoundBox(px + e, py, hx, hy, radius) - sdRoundBox(px - e, py, hx, hy, radius)
        const ny = sdRoundBox(px, py + e, hx, hy, radius) - sdRoundBox(px, py - e, hx, hy, radius)
        const len = Math.hypot(nx, ny) || 1
        // 1 at the rim, 0 at `band` px in — squared so the centre stays flat
        const t = Math.max(0, 1 - -d / band)
        const m = t * t
        // Sample from further inward: a convex lens magnifies toward its edge
        r = 128 - (nx / len) * m * 127
        g = 128 - (ny / len) * m * 127
      }
      img.data[i] = r
      img.data[i + 1] = g
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return c.toDataURL('image/png')
}

/* A filter that splits the backdrop by channel and displaces each one a
   little differently — the R/B spread is what reads as dispersion. */
function GlassFilter({ id, map, scale, blur, split = true }) {
  const ch = (k) =>
    k === 'r'
      ? '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'
      : k === 'g'
        ? '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'
        : '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'

  // Single pass: one displacement, no channel split. Used for the large nav
  // bar, which re-filters on every scroll frame across the full width — a
  // third of the cost, and at that size the fringe is barely visible anyway.
  if (!split) {
    return (
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={map} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
        <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="soft" />
        <feDisplacementMap in="soft" in2="map" scale={scale} xChannelSelector="R" yChannelSelector="G" result="d" />
        <feColorMatrix in="d" type="saturate" values="1.5" />
      </filter>
    )
  }

  return (
    <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feImage href={map} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
      <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="soft" />
      {[
        ['r', scale * 1.12],
        ['g', scale],
        ['b', scale * 0.88],
      ].map(([k, s]) => (
        <g key={k}>
          <feDisplacementMap in="soft" in2="map" scale={s} xChannelSelector="R" yChannelSelector="G" result={`d${k}`} />
          <feColorMatrix in={`d${k}`} type="matrix" values={ch(k)} result={k} />
        </g>
      ))}
      <feBlend in="r" in2="g" mode="screen" result="rg" />
      <feBlend in="rg" in2="b" mode="screen" result="rgb" />
      <feColorMatrix in="rgb" type="saturate" values="1.5" />
    </filter>
  )
}

/* Elements that get the pointer-tracked highlight. Kept to selectors that
   already exist so pages do not need a wrapper component. */
const SHEEN = '.btn, .lg, .nv-in, .dock-composer, .xp-tab'

export default function GlassDefs() {
  const [maps, setMaps] = useState(null)

  useEffect(() => {
    // Chromium only exposes userAgentData; it is also the only engine that
    // renders an SVG filter inside backdrop-filter.
    const chromium = 'userAgentData' in navigator
    const reducedTransparency = window.matchMedia?.('(prefers-reduced-transparency: reduce)').matches
    if (chromium && !reducedTransparency) {
      setMaps({
        // Pill: a 6:1 capsule, radius = half the height
        pill: buildMap(384, 64, 32, 22),
        // Bar: the nav capsule, ~18:1
        bar: buildMap(720, 40, 20, 16),
        // Card: ~4:3 with a soft corner
        card: buildMap(320, 240, 22, 26),
      })
      document.documentElement.dataset.lg = 'refract'
    }

    let frame = 0
    let last = null
    const onMove = (e) => {
      last = e
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const el = last.target instanceof Element ? last.target.closest(SHEEN) : null
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${last.clientX - r.left}px`)
        el.style.setProperty('--my', `${last.clientY - r.top}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  if (!maps) return null

  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <GlassFilter id="lg-pill" map={maps.pill} scale={38} blur={2.5} />
        {/* The nav carries text over moving content, so its centre is
            properly frosted before the rim bends it. */}
        <GlassFilter id="lg-bar" map={maps.bar} scale={44} blur={9} split={false} />
        <GlassFilter id="lg-card" map={maps.card} scale={46} blur={2} />
      </defs>
    </svg>
  )
}
