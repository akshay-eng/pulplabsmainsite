'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ==========================================================================
   Field — the WebGL layer for the void.

   A point cloud with a wireframe lattice suspended in it. White points only:
   the design rule is that colour comes from the imagery, so adding a tinted
   shader here would break the one constraint the whole system rests on.
   Depth is carried by size and opacity falloff instead of hue.

   Imports three and @react-three/fiber only — no drei. Every drei helper
   drags in a large dependency tree and none of this needs one.
   ========================================================================== */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  attribute float aSeed;
  varying float vFade;

  void main() {
    vec3 p = position;

    // Each point drifts on its own phase, so the field breathes instead of
    // translating as one rigid block.
    p.y += sin(uTime * 0.18 + aSeed * 6.283) * 0.22;
    p.x += cos(uTime * 0.13 + aSeed * 4.712) * 0.16;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // Fade with distance — the far points dissolve into the black rather than
    // ending at a hard edge.
    vFade = smoothstep(26.0, 6.0, -mv.z);

    gl_PointSize = uSize * aScale * (14.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  varying float vFade;

  void main() {
    // Round the square point sprite and soften its edge; a hard disc reads as
    // a UI dot, a soft one reads as light.
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;

    float alpha = smoothstep(0.5, 0.05, d) * vFade;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.85);
  }
`

function Points({ count = 2600 }) {
  const mat = useRef(null)

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const scale = new Float32Array(count)
    const seed = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // A slab rather than a sphere: the camera looks along it, so the field
      // reads as depth receding rather than a ball floating in frame.
      pos[i * 3] = (Math.random() - 0.5) * 34
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18
      pos[i * 3 + 2] = -Math.random() * 26

      // A few much larger points give the field a foreground.
      scale[i] = Math.random() < 0.04 ? 2.4 + Math.random() * 1.6 : 0.4 + Math.random() * 0.7
      seed[i] = Math.random()
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    return g
  }, [count])

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSize: { value: 9 } }), [])

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt
  })

  return (
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
  )
}

/** A slowly turning wireframe suspended in the field — structure among noise. */
function Lattice() {
  const ref = useRef(null)

  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.045
    ref.current.rotation.x += dt * 0.016
  })

  return (
    <mesh ref={ref} position={[0, 0, -6]}>
      <icosahedronGeometry args={[3.4, 1]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.09} />
    </mesh>
  )
}

/** Eases the rig toward the pointer. Damped, so it follows rather than snaps. */
function Rig({ children, strength = 0.13 }) {
  const g = useRef(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!g.current) return
    g.current.rotation.y += (pointer.x * strength - g.current.rotation.y) * 0.04
    g.current.rotation.x += (-pointer.y * strength * 0.6 - g.current.rotation.x) * 0.04
  })

  return <group ref={g}>{children}</group>
}

export default function Field({ lattice = true }) {
  return (
    <Canvas
      /* Capped at 1.5: additive points over a full-bleed area are fill-rate
         bound, and a 3x retina buffer costs a lot for no visible gain. */
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Rig>
        <Points />
        {lattice && <Lattice />}
      </Rig>
    </Canvas>
  )
}
