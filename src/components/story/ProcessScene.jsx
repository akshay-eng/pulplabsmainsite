'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import AdaptiveQuality, { nativeDpr } from '@/components/three/AdaptiveQuality'

/* ==========================================================================
   ProcessScene — one particle system, four formations, driven by scroll.

   Each point carries four target positions, one per engagement stage:

     0  Discover        scattered clusters — the work lives in silos
     1  Scope           a precise lattice, seen in perspective — the blueprint
     2  Build           a sphere ringed by three orbits — the system and its
                        evaluation gates
     3  Hand over       a steady ring around a dense core — it keeps running

   The vertex shader blends between neighbouring formations with a per-point
   stagger, and lifts each point off its path mid-transition so a morph reads
   as a swarm re-organising rather than a crossfade. All positions live on
   the GPU; scroll only writes one float.

   Colour is the hero's spectral band mapped across x, so the scene looks lit
   by the same light as the top of the page — the void rule, kept.
   ========================================================================== */

const VERT = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  attribute vec3 aB;
  attribute vec3 aC;
  attribute vec3 aD;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 spectral(float x) {
    x = clamp(x, 0.0, 1.0);
    vec3 a = vec3(0.20, 0.38, 1.00);
    vec3 b = vec3(0.25, 0.88, 1.00);
    vec3 c = vec3(0.50, 1.00, 0.55);
    vec3 d = vec3(1.00, 0.70, 0.30);
    if (x < 0.33) return mix(a, b, x / 0.33);
    if (x < 0.66) return mix(b, c, (x - 0.33) / 0.33);
    return mix(c, d, (x - 0.66) / 0.34);
  }

  void main() {
    float p = clamp(uProgress, 0.0, 3.0);
    float seg = min(floor(p), 2.0);
    float f = p - seg;

    // Stagger: each point starts its move at a different moment
    float st = smoothstep(aSeed * 0.4, aSeed * 0.4 + 0.6, f);

    vec3 from = seg < 0.5 ? position : (seg < 1.5 ? aB : aC);
    vec3 to   = seg < 0.5 ? aB       : (seg < 1.5 ? aC : aD);
    vec3 pos = mix(from, to, st);

    // Mid-transition lift — strongest halfway, zero at rest
    float mid = sin(st * 3.14159);
    pos += vec3(
      sin(aSeed * 41.0 + uTime * 0.9),
      cos(aSeed * 29.0 + uTime * 0.7),
      sin(aSeed * 17.0 - uTime * 0.5)
    ) * mid * 0.9;

    // Idle breathing so a resting formation is never frozen
    pos += vec3(
      sin(uTime * 0.6 + aSeed * 23.0),
      cos(uTime * 0.5 + aSeed * 19.0),
      sin(uTime * 0.4 + aSeed * 13.0)
    ) * 0.035;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = -mv.z;
    gl_PointSize = uSize * (0.55 + fract(aSeed * 7.31) * 0.9) * (10.0 / depth);

    // Colour across the formation, with a little per-point variance
    vColor = spectral(pos.x / 9.0 + 0.5 + (fract(aSeed * 3.7) - 0.5) * 0.12);
    vAlpha = smoothstep(24.0, 5.0, depth) * (0.85 + mid * 0.3);
  }
`

const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    // Bright core, soft falloff — reads as emitted light
    float core = smoothstep(0.5, 0.0, d);
    float a = pow(core, 1.35) * vAlpha;
    gl_FragColor = vec4(mix(vColor, vec3(1.0), pow(core, 4.0) * 0.6) * a, a);
  }
`

/* -------------------------------------------------------------- formations */

function gauss(rand) {
  // Box–Muller
  const u = 1 - rand()
  const v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

// Seeded so server and every visit lay out the same composition
function mulberry32(a) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildFormations(count) {
  const rand = mulberry32(7)
  const A = new Float32Array(count * 3)
  const B = new Float32Array(count * 3)
  const C = new Float32Array(count * 3)
  const D = new Float32Array(count * 3)
  const seed = new Float32Array(count)

  // A — six clusters of uneven size, scattered: data in silos
  const clusters = Array.from({ length: 6 }, (_, i) => ({
    x: Math.cos(i * 1.9 + 0.4) * (2.2 + (i % 3) * 0.7),
    y: Math.sin(i * 2.3 + 0.2) * 1.9,
    z: Math.sin(i * 1.3) * 2.2,
    s: 0.45 + (i % 4) * 0.22,
  }))

  // B — a 13×13 grid of lines on a floor plane
  const LINES = 13
  const perLine = Math.ceil(count / (LINES * 2))

  // C — fibonacci sphere (70%) + three orbit rings (30%)
  const sphereN = Math.floor(count * 0.7)
  const golden = Math.PI * (3 - Math.sqrt(5))

  // D — wide ring (82%) and a dense core (18%)
  const ringN = Math.floor(count * 0.82)

  for (let i = 0; i < count; i++) {
    const k = i * 3
    seed[i] = rand()

    const cl = clusters[i % clusters.length]
    A[k] = cl.x + gauss(rand) * cl.s + gauss(rand) * 0.6 * rand()
    A[k + 1] = cl.y + gauss(rand) * cl.s
    A[k + 2] = cl.z + gauss(rand) * cl.s

    // Points are dealt onto grid lines (alternating x- and z-running) so the
    // lattice reads as drawn lines of light, not a carpet of dots.
    {
      const line = i % (LINES * 2)
      const along = (Math.floor(i / (LINES * 2)) / perLine - 0.5) * 8
      const across = ((line % LINES) / (LINES - 1) - 0.5) * 8
      const runsX = line < LINES
      B[k] = runsX ? along : across
      B[k + 1] = -0.7
      B[k + 2] = runsX ? across : along
    }

    if (i < sphereN) {
      const y = 1 - (i / (sphereN - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = golden * i
      C[k] = Math.cos(th) * r * 2.1
      C[k + 1] = y * 2.1
      C[k + 2] = Math.sin(th) * r * 2.1
    } else {
      const j = i - sphereN
      const ring = j % 3
      const a = rand() * Math.PI * 2
      const R = 2.8 + ring * 0.4
      const x = Math.cos(a) * R
      const z = Math.sin(a) * R
      // Each ring on its own axis — gates around the system
      const rx = [0.35, -0.6, 1.25][ring]
      C[k] = x
      C[k + 1] = z * Math.sin(rx)
      C[k + 2] = z * Math.cos(rx)
    }

    if (i < ringN) {
      const a = rand() * Math.PI * 2
      const R = 3.3 + gauss(rand) * 0.09
      const x = Math.cos(a) * R
      const z = Math.sin(a) * R
      D[k] = x
      D[k + 1] = z * Math.sin(0.42) + gauss(rand) * 0.04
      D[k + 2] = z * Math.cos(0.42)
    } else {
      const u = rand() * 2 - 1
      const a = rand() * Math.PI * 2
      const r = Math.cbrt(rand()) * 0.95
      const s = Math.sqrt(1 - u * u)
      D[k] = Math.cos(a) * s * r
      D[k + 1] = u * r
      D[k + 2] = Math.sin(a) * s * r
    }
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(A, 3))
  g.setAttribute('aB', new THREE.BufferAttribute(B, 3))
  g.setAttribute('aC', new THREE.BufferAttribute(C, 3))
  g.setAttribute('aD', new THREE.BufferAttribute(D, 3))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  // Formations reach well past the origin; skip frustum culling of the whole
  // cloud based on the first formation's bounds.
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12)
  return g
}

/* ------------------------------------------------------------------ scene */

// Camera distance and yaw per stage, so each formation is framed on purpose
const SHOTS = [
  { z: 12.0, y: 0.2, yaw: 0.0 },
  { z: 9.5, y: 4.2, yaw: 0.55 },
  { z: 12.8, y: 0.4, yaw: -0.2 },
  { z: 12.2, y: 1.0, yaw: 0.1 },
]

function Swarm({ progress, count }) {
  const mat = useRef(null)
  const group = useRef(null)
  const geometry = useMemo(() => buildFormations(count), [count])
  const uniforms = useMemo(() => ({ uProgress: { value: 0 }, uTime: { value: 0 }, uSize: { value: 5.5 } }), [])
  const { camera, pointer, size, viewport } = useThree()
  const eased = useRef(0)

  useFrame((_, dt) => {
    const target = (progress.current ?? 0) * 3
    // Critically-damped-ish follow: scroll drives it, but never snaps
    eased.current += (target - eased.current) * Math.min(1, dt * 4.5)
    const p = eased.current

    if (mat.current) {
      mat.current.uniforms.uProgress.value = p
      mat.current.uniforms.uTime.value += dt
      // gl_PointSize is in device pixels, so scale by the canvas DPR
      mat.current.uniforms.uSize.value = (size.width < 700 ? 7 : 9) * viewport.dpr
    }

    // Interpolate the camera between the two nearest shots
    const i = Math.min(2, Math.floor(p))
    const f = THREE.MathUtils.smoothstep(p - i, 0, 1)
    const a = SHOTS[i]
    const b = SHOTS[i + 1]
    camera.position.z = THREE.MathUtils.lerp(a.z, b.z, f)
    camera.position.y = THREE.MathUtils.lerp(a.y, b.y, f)
    camera.lookAt(0, 0, 0)

    if (group.current) {
      const yaw = THREE.MathUtils.lerp(a.yaw, b.yaw, f)
      group.current.rotation.y += (yaw + pointer.x * 0.18 + uniforms.uTime.value * 0.04 - group.current.rotation.y) * 0.05
      group.current.rotation.x += (-pointer.y * 0.08 - group.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={mat}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default function ProcessScene({ progress, active }) {
  const count = typeof window !== 'undefined' && window.innerWidth < 700 ? 4200 : 9000
  return (
    <Canvas
      // Native resolution (4K on a 2x panel), stepped down only if the GPU
      // cannot hold 60fps
      dpr={nativeDpr(2)}
      camera={{ position: [0, 0.2, 11.5], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      // Stop rendering entirely while the section is off-screen
      frameloop={active ? 'always' : 'never'}
      style={{ background: 'transparent' }}
    >
      <AdaptiveQuality min={1} max={2} />
      <Swarm progress={progress} count={count} />
    </Canvas>
  )
}
