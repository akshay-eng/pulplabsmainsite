'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ==========================================================================
   HeroCore — the hero's WebGL centrepiece.

   A noise-displaced core inside a slowly counter-rotating wireframe shell,
   wrapped in an orbiting particle field. Reads as a living compute core
   rather than a logo: enterprise-AI, not fruit.

   Deliberately imports only `three` and `@react-three/fiber` — no drei. Every
   drei helper drags in a large dependency tree, and none of this needs one.
   Lazy-loaded from Home so /services, /team and /blog never pay for it.
   ========================================================================== */

/* Ashima Arts simplex noise (MIT). Standard GLSL implementation — used here
   for the organic surface displacement. */
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

const CORE_VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying float vDisp;
varying vec3 vNormal;
varying vec3 vView;

${SIMPLEX}

void main() {
  // Two octaves: a slow large swell plus faster fine detail.
  float n1 = snoise(position * 1.5 + vec3(0.0, 0.0, uTime * 0.20));
  float n2 = snoise(position * 3.6 - vec3(uTime * 0.14));
  float disp = n1 * 0.55 + n2 * 0.18;

  vDisp = disp;
  vec3 p = position + normal * disp * uAmp;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

const CORE_FRAG = /* glsl */ `
uniform vec3 uDeep;
uniform vec3 uMid;
uniform vec3 uRim;
varying float vDisp;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  // Fresnel: grazing angles pick up the rim colour, which is what sells the
  // surface as lit rather than flat-shaded.
  float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.3);
  float t = clamp(vDisp * 1.15 + 0.5, 0.0, 1.0);

  vec3 base = mix(uDeep, uMid, t);
  vec3 col  = mix(base, uRim, fres * 0.95);

  // Crests glow hotter than troughs
  col += uRim * smoothstep(0.5, 1.0, t) * 0.3;

  // Lift the floor so no facet falls into mud — this surface should never
  // read darker than the warm page behind it.
  col = max(col, uDeep * 0.92);

  gl_FragColor = vec4(col, 1.0);
}
`

function Core({ amp = 0.34 }) {
  const mat = useRef(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: amp },
      /* Kept well clear of the dark end: the first pass used #C7420A as the
         trough colour and the core read as burnt brown rather than lit. */
      uDeep: { value: new THREE.Color('#F0562A') },
      uMid: { value: new THREE.Color('#FF9440') },
      uRim: { value: new THREE.Color('#FFE08A') },
    }),
    [amp],
  )

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt
  })

  return (
    <mesh>
      {/* Detail 48 gives a smooth displaced surface; the geometry is built
          once and the vertex shader does the animating, so this stays cheap. */}
      <icosahedronGeometry args={[1, 48]} />
      <shaderMaterial ref={mat} vertexShader={CORE_VERT} fragmentShader={CORE_FRAG} uniforms={uniforms} />
    </mesh>
  )
}

function Shell() {
  const ref = useRef(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y -= dt * 0.06
    ref.current.rotation.x += dt * 0.02
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.62, 2]} />
      <meshBasicMaterial color="#FF8A2B" wireframe transparent opacity={0.22} />
    </mesh>
  )
}

function Particles({ count = 700 }) {
  const ref = useRef(null)

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Even-ish shell distribution: uniform in cos(phi) avoids the pole
      // clustering you get from sampling phi uniformly.
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.95 + Math.random() * 0.85
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])

  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.045
    ref.current.rotation.z += dt * 0.012
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#FF6B1A" size={0.028} sizeAttenuation transparent opacity={0.72} depthWrite={false} />
    </points>
  )
}

/** Eases the whole rig toward the pointer — parallax without a jump cut. */
function PointerRig({ children, strength = 0.16 }) {
  const group = useRef(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y += (pointer.x * strength - group.current.rotation.y) * 0.045
    group.current.rotation.x += (-pointer.y * strength - group.current.rotation.x) * 0.045
  })

  return <group ref={group}>{children}</group>
}

export default function HeroCore({ className = '' }) {
  return (
    <Canvas
      className={className}
      /* Cap at 1.5: a 3× retina buffer on a full-bleed shader costs a lot of
         fill rate for a difference nobody sees on an organic surface. */
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <PointerRig>
        <Core />
        <Shell />
        <Particles />
      </PointerRig>
    </Canvas>
  )
}
