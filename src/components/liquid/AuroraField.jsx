'use client'

import { useEffect, useRef, useState } from 'react'

/* ==========================================================================
   AuroraField — the hero's light band, drawn live instead of played back.

   The band used to be a 1280×720 video, which is soft on any display wider
   than that and can never be sharp on a 4K panel. This draws the same thing
   — three interleaved ribbons of light, deep blue on the left through green
   to amber on the right — as a fragment shader, so it is computed per device
   pixel at whatever resolution the screen has.

   Details that matter at 4K:
     • dithering: a large, slow gradient on 8-bit output bands visibly at
       2160 lines; a sub-1/255 hash noise breaks the steps up.
     • adaptive scale: the band is pure soft light, so if a GPU cannot hold
       60fps at native size the internal resolution steps down (to 0.75, then
       0.5) — invisible on a gradient this soft, and it keeps motion smooth.
     • it pauses off-screen and in background tabs, draws one still frame
       under reduced motion, and the poster image stays underneath as the
       no-WebGL fallback.

   The pointer gently pulls the nearest ribbon toward it.
   ========================================================================== */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float uTime;
uniform float uAspect;
uniform vec2 uPointer;
uniform float uPull;
uniform float uIntro;
uniform vec2 uRes;

vec3 spectral(float x) {
  x = clamp(x, 0.0, 1.0);
  vec3 a = vec3(0.10, 0.22, 0.95);
  vec3 b = vec3(0.12, 0.70, 0.90);
  vec3 c = vec3(0.40, 0.92, 0.45);
  vec3 d = vec3(1.00, 0.62, 0.22);
  if (x < 0.33) return mix(a, b, x / 0.33);
  if (x < 0.62) return mix(b, c, (x - 0.33) / 0.29);
  return mix(c, d, (x - 0.62) / 0.38);
}

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

void main() {
  vec2 uv = vUv;
  float x = uv.x;
  float t = uTime;

  // Pointer pull, in aspect-correct space
  vec2 d = (uv - uPointer) * vec2(uAspect, 1.0);
  float pull = exp(-dot(d, d) * 6.0) * uPull;

  float light = 0.0;
  vec3 col = vec3(0.0);
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float y0 = 0.5
      + 0.11 * sin(x * 3.1 + t * 0.22 + fk * 2.1)
      + 0.045 * sin(x * 7.3 - t * 0.31 + fk * 1.3)
      + (fk - 1.0) * 0.07;
    y0 += (uPointer.y - y0) * pull * 0.35;
    float w = 0.075 + 0.035 * sin(x * 2.3 + t * 0.17 + fk * 3.0);
    float dy = (uv.y - y0) / w;
    float band = exp(-dy * dy);
    // Brightness travels along each ribbon
    float shimmer = 0.55 + 0.45 * sin(x * 4.2 - t * 0.5 + fk * 1.7);
    float b = band * shimmer * (1.0 - fk * 0.18);
    light += b;
    col += spectral(x + 0.06 * sin(uv.y * 4.0 + t * 0.12 + fk)) * b;
  }

  // A wide, faint halo so the ribbons glow into the black
  float halo = exp(-pow((uv.y - 0.5) / 0.28, 2.0)) * 0.12;
  col += spectral(x) * halo;

  // Fade the outer edges; the intro sweeps the light in from the centre
  float edge = smoothstep(0.0, 0.18, x) * smoothstep(1.0, 0.82, x);
  float intro = smoothstep(abs(x - 0.5) * 1.6, abs(x - 0.5) * 1.6 + 0.4, uIntro);
  col *= edge * intro * 1.15;

  // Dither to break 8-bit banding across a 2160-line gradient
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;

  outColor = vec4(max(col, 0.0), 1.0);
}`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'compile')
  return s
}

export default function AuroraField({ className = '', poster }) {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = canvas.current
    const host = wrap.current
    if (!el || !host) return
    const gl = el.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' })
    if (!gl) return

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    let prog
    try {
      prog = gl.createProgram()
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog))
    } catch (err) {
      console.warn('[AuroraField]', err)
      return
    }
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const U = (n) => gl.getUniformLocation(prog, n)
    const u = { time: U('uTime'), aspect: U('uAspect'), pointer: U('uPointer'), pull: U('uPull'), intro: U('uIntro'), res: U('uRes') }

    // Render scale: 1 = native device pixels (4K on a 4K panel)
    let scale = 1
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * scale
      const r = host.getBoundingClientRect()
      const w = Math.max(1, Math.round(r.width * dpr))
      const h = Math.max(1, Math.round(r.height * dpr))
      if (el.width !== w || el.height !== h) {
        el.width = w
        el.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform1f(u.aspect, r.width / Math.max(1, r.height))
      gl.uniform2f(u.res, w, h)
    }
    resize()

    const ptr = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, p: 0, tp: 0 }
    const onMove = (e) => {
      const r = host.getBoundingClientRect()
      ptr.tx = (e.clientX - r.left) / r.width
      ptr.ty = 1 - (e.clientY - r.top) / r.height
      ptr.tp = ptr.tx > 0 && ptr.tx < 1 && ptr.ty > 0 && ptr.ty < 1 ? 1 : 0
    }

    const t0 = performance.now()
    const draw = (t) => {
      ptr.x += (ptr.tx - ptr.x) * 0.06
      ptr.y += (ptr.ty - ptr.y) * 0.06
      ptr.p += (ptr.tp - ptr.p) * 0.03
      gl.uniform1f(u.time, t + 6)
      gl.uniform2f(u.pointer, ptr.x, ptr.y)
      gl.uniform1f(u.pull, ptr.p)
      gl.uniform1f(u.intro, reduced ? 2 : Math.min(2, t / 1.6))
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    let raf = 0
    let visible = true
    let last = performance.now()
    let slow = 0
    const loop = (now) => {
      raf = 0
      if (!visible || document.hidden) return
      const dt = now - last
      last = now
      // Adaptive scale: sustained frames over ~18ms step the resolution down
      if (dt < 100) {
        slow = dt > 18 ? slow + 1 : Math.max(0, slow - 1)
        if (slow > 40 && scale > 0.5) {
          scale -= 0.25
          slow = 0
          resize()
        }
      }
      draw((now - t0) / 1000)
      raf = requestAnimationFrame(loop)
    }
    const kick = () => {
      if (reduced) return draw(4.2)
      if (!raf && visible && !document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduced) draw(4.2)
    })
    ro.observe(host)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      kick()
    })
    io.observe(host)
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', kick)

    setLive(true)
    kick()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', kick)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <div ref={wrap} className={`aurora ${className}`} data-live={live || undefined} aria-hidden="true">
      {poster && <img src={poster} alt="" decoding="async" />}
      <canvas ref={canvas} />
    </div>
  )
}
