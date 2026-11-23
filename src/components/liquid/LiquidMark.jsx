'use client'

import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   LiquidMark — the PulpLabs mark (or wordmark) as liquid chrome.

   The approach follows the liquid-logo idea: turn a flat 2D shape into a
   height field, then shade that height field as polished metal.

     1. Rasterise the real logo paths (the same geometry as the nav SVG)
        into an offscreen canvas.
     2. Run an exact Euclidean distance transform over it: every inside pixel
        learns how far it is from the edge.
     3. Map that distance through a circular profile, so a stroke becomes a
        rounded tube and a filled glyph gets a soft bevel.
     4. Precompute normals once, on the CPU, into a float texture.
     5. The fragment shader then only has to: wobble the lookup (the liquid),
        add a ripple where the pointer is, and reflect a studio environment
        whose horizon is the same blue-green-amber band as the hero light.
        R, G and B each sample a slightly different reflection, which gives
        the rim its chromatic edge.

   No three.js — a single full-screen triangle and one texture does not need a
   scene graph, and keeping it raw keeps this off the 3D chunk.

   It renders only while on screen, pauses in background tabs, draws a single
   still frame under prefers-reduced-motion, and falls back to a static SVG
   when WebGL is unavailable.
   ========================================================================== */

/* ----------------------------------------------------------------- shapes */

// The mark, in the nav SVG's 20×20 coordinate space
function drawMark(ctx, W, H, weight) {
  const pad = 0.14
  const span = 16 + weight // geometry width plus stroke
  const s = (Math.min(W, H) * (1 - 2 * pad)) / span
  ctx.save()
  ctx.translate(W / 2, H / 2)
  ctx.scale(s, s)
  ctx.translate(-10, -10)
  ctx.lineWidth = weight
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#fff'
  ctx.beginPath()
  ctx.moveTo(2, 14)
  ctx.lineTo(10, 3)
  ctx.lineTo(18, 14)
  ctx.moveTo(6, 17)
  ctx.lineTo(14, 17)
  ctx.stroke()
  ctx.restore()
  return s * weight * 0.5 // tube radius in px
}

function drawWordmark(ctx, W, H, _weight, family) {
  const size = H * 0.72
  ctx.font = `600 ${size}px ${family}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  // Fit to width
  const m = ctx.measureText('PulpLabs')
  const k = Math.min(1, (W * 0.94) / m.width)
  ctx.save()
  ctx.translate(W / 2, H / 2 + size * 0.04)
  ctx.scale(k, k)
  // Heavy negative tracking, matching the display type on the site
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${-size * 0.045}px`
  ctx.fillText('PulpLabs', 0, 0)
  ctx.restore()
  // Roughly half a stem: glyphs inflate into full tubes like the mark
  return size * k * 0.068
}

/* ------------------------------------------------- distance transform --- */

// Felzenszwalb & Huttenlocher 1D squared EDT
function edt1d(f, n, d, v, z) {
  let k = 0
  v[0] = 0
  z[0] = -Infinity
  z[1] = Infinity
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    while (s <= z[k]) {
      k--
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = Infinity
  }
  k = 0
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
  }
}

/** Distance from each inside pixel to the nearest outside pixel. */
function insideDistance(alpha, W, H) {
  const INF = 1e20
  const grid = new Float64Array(W * H)
  for (let i = 0; i < W * H; i++) grid[i] = alpha[i] > 0.5 ? INF : 0
  const n = Math.max(W, H)
  const f = new Float64Array(n)
  const d = new Float64Array(n)
  const v = new Int32Array(n)
  const z = new Float64Array(n + 1)
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) f[y] = grid[y * W + x]
    edt1d(f, H, d, v, z)
    for (let y = 0; y < H; y++) grid[y * W + x] = d[y]
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) f[x] = grid[y * W + x]
    edt1d(f, W, d, v, z)
    for (let x = 0; x < W; x++) grid[y * W + x] = Math.sqrt(d[x])
  }
  return grid
}

function boxBlur(src, W, H, r) {
  const tmp = new Float32Array(W * H)
  const out = new Float32Array(W * H)
  const w = 2 * r + 1
  for (let y = 0; y < H; y++) {
    let acc = 0
    for (let x = -r; x <= r; x++) acc += src[y * W + Math.min(W - 1, Math.max(0, x))]
    for (let x = 0; x < W; x++) {
      tmp[y * W + x] = acc / w
      acc += src[y * W + Math.min(W - 1, x + r + 1)] - src[y * W + Math.max(0, x - r)]
    }
  }
  for (let x = 0; x < W; x++) {
    let acc = 0
    for (let y = -r; y <= r; y++) acc += tmp[Math.min(H - 1, Math.max(0, y)) * W + x]
    for (let y = 0; y < H; y++) {
      out[y * W + x] = acc / w
      acc += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x]
    }
  }
  return out
}

/** RGBA float field: normal.x, normal.y, height, coverage. */
function buildField(kind, W, H, weight, family) {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  const radius = kind === 'wordmark' ? drawWordmark(ctx, W, H, weight, family) : drawMark(ctx, W, H, weight)
  const px = ctx.getImageData(0, 0, W, H).data

  const alpha = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++) alpha[i] = px[i * 4 + 3] / 255

  const dist = insideDistance(alpha, W, H)
  const R = Math.max(2, radius)
  let height = new Float32Array(W * H)
  for (let i = 0; i < W * H; i++) {
    // The EDT is measured to pixel centres of a thresholded mask, which
    // steps on diagonals. Nudging by the anti-aliased coverage recovers the
    // sub-pixel edge, so a 45° arm does not shade as a staircase.
    const d = dist[i] > 0 ? dist[i] - 0.5 + alpha[i] : 0
    const t = Math.min(1, d / R)
    // Circular cross-section: a stroke becomes a tube, a fill gets a bevel
    height[i] = Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t)))
  }
  // Three box passes approximate a Gaussian; enough to remove the remaining
  // quantisation without rounding off the silhouette.
  // Glyph corners make the distance field crease into chisel-like ridges;
  // the wordmark gets a heavier blur so its corners round off like poured
  // metal. The mark is all round strokes and keeps a light touch.
  const br = Math.max(1, Math.round(R * (kind === 'wordmark' ? 0.22 : 0.08)))
  height = boxBlur(boxBlur(boxBlur(height, W, H, br), W, H, br), W, H, br)

  const out = new Float32Array(W * H * 4)
  const k = R * 0.5 // height in px for the slope
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x
      const hl = height[y * W + Math.max(0, x - 1)]
      const hr = height[y * W + Math.min(W - 1, x + 1)]
      const hu = height[Math.max(0, y - 1) * W + x]
      const hd = height[Math.min(H - 1, y + 1) * W + x]
      let nx = -(hr - hl) * k
      let ny = -(hd - hu) * k
      const len = Math.hypot(nx, ny, 1)
      out[i * 4] = nx / len
      out[i * 4 + 1] = ny / len
      out[i * 4 + 2] = height[i]
      out[i * 4 + 3] = alpha[i]
    }
  }
  return out
}

/* ---------------------------------------------------------------- shaders */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  // Flip y so uv (0,0) is the canvas's top-left, matching the field
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uField;
uniform float uTime;
uniform vec2 uMouse;      // in uv
uniform float uPress;     // 0..1 pointer influence
uniform float uAspect;    // width / height of the field

const float TAU = 6.28318530718;

// The hero light: deep blue -> cyan -> green -> amber
vec3 spectral(float x) {
  x = clamp(x, 0.0, 1.0);
  vec3 a = vec3(0.16, 0.32, 1.00);
  vec3 b = vec3(0.20, 0.85, 0.95);
  vec3 c = vec3(0.45, 0.95, 0.45);
  vec3 d = vec3(1.00, 0.66, 0.25);
  if (x < 0.33) return mix(a, b, x / 0.33);
  if (x < 0.66) return mix(b, c, (x - 0.33) / 0.33);
  return mix(c, d, (x - 0.66) / 0.34);
}

// A studio environment: bright soft-box overhead, dark floor, and the
// spectral band sitting on the horizon. Streaks drift so the metal looks
// like it is flowing.
vec3 env(vec3 r, float h) {
  float y = r.y;
  float sky = smoothstep(-0.25, 0.6, y);
  vec3 c = mix(vec3(0.03), vec3(1.0), sky);

  float flow = sin((r.x * 1.7 + h * 1.4 + uTime * 0.05) * TAU) * 0.5 + 0.5;
  float strip = smoothstep(0.86, 0.99, flow);
  c += strip * 0.55 * (0.35 + sky);

  float horizon = exp(-pow((y + 0.02) * 6.0, 2.0));
  c += spectral(r.x * 0.55 + 0.5 + sin(uTime * 0.15) * 0.08) * horizon * 1.35;

  // A dark band under the horizon — the edge that makes chrome read as chrome
  c *= 1.0 - 0.6 * exp(-pow((y + 0.3) * 5.0, 2.0));
  return c;
}

void main() {
  vec2 uv = vUv;

  // The surface itself never moves — an earlier version wobbled the lookup
  // and rippled it under the cursor, which read as a glitch rather than as
  // liquid metal. The life comes from the light instead: reflections sweep
  // slowly across a still surface, and the cursor tilts them a little, the
  // way a polished object catches light as you move past it.
  vec4 f = texture(uField, uv);
  if (f.a < 0.004) discard;

  // Normal in a y-up frame
  vec3 n = normalize(vec3(f.x, -f.y, sqrt(max(0.0, 1.0 - dot(f.xy, f.xy)))));
  vec2 tilt = (uMouse - 0.5) * vec2(0.35, -0.25) * uPress;
  n = normalize(n + vec3(tilt, 0.0));

  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-V, n);

  // Dispersion: each channel reflects a slightly bent ray
  float spread = 0.06 * (1.0 - n.z) + 0.012;
  vec3 col;
  col.r = env(normalize(R + vec3(spread, 0.0, 0.0)), f.z).r;
  col.g = env(R, f.z).g;
  col.b = env(normalize(R - vec3(spread, 0.0, 0.0)), f.z).b;

  // Key light highlight, top-left
  vec3 L = normalize(vec3(-0.45, 0.7, 0.55));
  col += pow(max(dot(R, L), 0.0), 48.0) * 1.1;

  // Fresnel rim
  float fr = pow(1.0 - n.z, 3.0);
  col = mix(col, vec3(1.0), fr * 0.25);

  // Gentle tone curve so highlights roll off instead of clipping flat
  col = col / (1.0 + col * 0.28);
  col = pow(col, vec3(0.85)) * 1.08;

  float a = smoothstep(0.0, 1.0, f.a);
  outColor = vec4(col * a, a);
}`

/* -------------------------------------------------------------- component */

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s)
    gl.deleteShader(s)
    throw new Error(log || 'shader compile failed')
  }
  return s
}

function StaticMark({ weight }) {
  return (
    <svg viewBox="0 0 20 20" className="lqm-static" aria-hidden="true">
      <defs>
        <linearGradient id="lqm-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.48" stopColor="#c9ccd6" />
          <stop offset="0.52" stopColor="#5b6070" />
          <stop offset="1" stopColor="#e9ebf2" />
        </linearGradient>
      </defs>
      <path d="M2 14 L10 3 L18 14" stroke="url(#lqm-chrome)" strokeWidth={weight} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M6 17 L14 17" stroke="url(#lqm-chrome)" strokeWidth={weight} strokeLinecap="round" />
    </svg>
  )
}

/**
 * @param kind     'mark' | 'wordmark'
 * @param weight   stroke weight in the mark's 20-unit space
 * @param aspect   width / height of the drawing surface (wordmark is wide)
 */
export default function LiquidMark({ kind = 'mark', weight = 2.6, aspect = 1, className = '', label = 'PulpLabs' }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const [mode, setMode] = useState('pending') // pending | gl | static

  useEffect(() => {
    const el = canvas.current
    const host = wrap.current
    if (!el || !host) return

    const gl = el.getContext('webgl2', { premultipliedAlpha: true, antialias: false, alpha: true })
    if (!gl) {
      setMode('static')
      return
    }

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let raf = 0
    let visible = false
    const cleanups = []

    const start = async () => {
      // The wordmark is drawn in the site's own typeface; wait for it so the
      // field is not built from a fallback font.
      let family = 'sans-serif'
      if (kind === 'wordmark') {
        family = getComputedStyle(document.body).fontFamily
        // fonts.ready only covers faces already in use. The 600 weight is not
        // used anywhere else on the page, so ask for it by name.
        try {
          await document.fonts?.load(`600 100px ${family}`, 'PulpLabs')
        } catch {}
      }
      if (disposed) return

      const FH = kind === 'wordmark' ? 360 : 512
      const FW = Math.round(FH * aspect)
      const field = buildField(kind, FW, FH, weight, family)

      let prog
      try {
        prog = gl.createProgram()
        gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
        gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
        gl.linkProgram(prog)
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog))
      } catch (err) {
        console.warn('[LiquidMark]', err)
        setMode('static')
        return
      }
      gl.useProgram(prog)

      // One triangle that covers the viewport
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'aPos')
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, FW, FH, 0, gl.RGBA, gl.FLOAT, field)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      const u = {
        time: gl.getUniformLocation(prog, 'uTime'),
        mouse: gl.getUniformLocation(prog, 'uMouse'),
        press: gl.getUniformLocation(prog, 'uPress'),
        aspect: gl.getUniformLocation(prog, 'uAspect'),
        field: gl.getUniformLocation(prog, 'uField'),
      }
      gl.uniform1i(u.field, 0)
      gl.uniform1f(u.aspect, aspect)
      gl.clearColor(0, 0, 0, 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const r = host.getBoundingClientRect()
        const w = Math.max(1, Math.round(r.width * dpr))
        const h = Math.max(1, Math.round(r.height * dpr))
        if (el.width !== w || el.height !== h) {
          el.width = w
          el.height = h
          gl.viewport(0, 0, w, h)
        }
      }
      resize()
      const ro = new ResizeObserver(() => {
        resize()
        if (reduced) draw(4)
      })
      ro.observe(host)
      cleanups.push(() => ro.disconnect())

      // Pointer: eased toward the cursor, influence decays when it leaves
      const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, p: 0, tp: 0 }
      const onMove = (e) => {
        const r = host.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        const near = x > -0.15 && x < 1.15 && y > -0.15 && y < 1.15
        mouse.tx = x
        mouse.ty = y
        mouse.tp = near ? 1 : 0
      }
      if (!reduced) {
        window.addEventListener('pointermove', onMove, { passive: true })
        cleanups.push(() => window.removeEventListener('pointermove', onMove))
      }

      const t0 = performance.now()
      function draw(tOverride) {
        const t = tOverride ?? (performance.now() - t0) / 1000
        mouse.x += (mouse.tx - mouse.x) * 0.08
        mouse.y += (mouse.ty - mouse.y) * 0.08
        mouse.p += (mouse.tp - mouse.p) * 0.04
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform1f(u.time, t)
        gl.uniform2f(u.mouse, mouse.x, mouse.y)
        gl.uniform1f(u.press, mouse.p)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }

      const loop = () => {
        raf = 0
        if (!visible || document.hidden) return
        draw()
        raf = requestAnimationFrame(loop)
      }
      const kick = () => {
        if (!raf && visible && !document.hidden && !reduced) raf = requestAnimationFrame(loop)
      }

      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting
        kick()
      })
      io.observe(host)
      cleanups.push(() => io.disconnect())
      document.addEventListener('visibilitychange', kick)
      cleanups.push(() => document.removeEventListener('visibilitychange', kick))

      setMode('gl')
      if (reduced) draw(4) // one composed still frame
      cleanups.push(() => {
        gl.deleteTexture(tex)
        gl.deleteBuffer(buf)
        gl.deleteProgram(prog)
      })
    }

    // Build the field off the critical path
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 900 })
      : setTimeout(start, 120)

    return () => {
      disposed = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else clearTimeout(idle)
      if (raf) cancelAnimationFrame(raf)
      cleanups.forEach((fn) => fn())
    }
  }, [kind, weight, aspect])

  return (
    <div
      ref={wrap}
      className={`lqm ${className}`}
      data-mode={mode}
      style={{ aspectRatio: String(aspect) }}
      role="img"
      aria-label={label}
    >
      <canvas ref={canvas} aria-hidden="true" />
      {mode === 'static' && kind === 'mark' && <StaticMark weight={weight} />}
      {mode === 'static' && kind === 'wordmark' && <span className="lqm-word">PulpLabs</span>}
    </div>
  )
}
