/* Aperture — the hero's centrepiece, replacing the citrus wheel.
 *
 * Keeps the wheel's radial-segment DNA so the brand still reads, but resolves
 * it as an instrument iris rather than a fruit: measured tick ring, three
 * counter-rotating data arcs, six precision blades. Geometry is generated
 * rather than hand-authored so the ticks and blades stay exact. */

const TAU = Math.PI * 2

const polar = (cx, cy, r, angle) => [cx + r * Math.cos(angle - Math.PI / 2), cy + r * Math.sin(angle - Math.PI / 2)]

/** SVG arc path between two angles (radians). */
function arc(cx, cy, r, from, to) {
  const [x1, y1] = polar(cx, cy, r, from)
  const [x2, y2] = polar(cx, cy, r, to)
  const large = to - from > Math.PI ? 1 : 0
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

/** One iris blade.
 *
 * The inner vertex is swept *forward* past the blade's own arc (spread × 1.9)
 * rather than pointing at the centre. That is what makes six blades overlap
 * into a mechanical iris with a hexagonal opening — aiming them at the centre
 * instead produced a six-pointed star, which read as a sun. */
function blade(cx, cy, rOuter, rInner, angle, spread) {
  const [ax, ay] = polar(cx, cy, rOuter, angle - spread)
  const [bx, by] = polar(cx, cy, rOuter, angle + spread)
  const [ix, iy] = polar(cx, cy, rInner, angle + spread * 1.9)
  return (
    `M ${ax.toFixed(2)} ${ay.toFixed(2)}` +
    ` A ${rOuter} ${rOuter} 0 0 1 ${bx.toFixed(2)} ${by.toFixed(2)}` +
    ` L ${ix.toFixed(2)} ${iy.toFixed(2)} Z`
  )
}

export default function Aperture({ size = 360, className = '', style }) {
  const c = 100
  const ticks = Array.from({ length: 72 }, (_, i) => i)
  const blades = Array.from({ length: 6 }, (_, i) => i)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={`aperture ${className}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ap-warm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFC93C" />
          <stop offset="45%" stopColor="#FF8A2B" />
          <stop offset="100%" stopColor="#F0384B" />
        </linearGradient>
        <linearGradient id="ap-blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF8A2B" />
          <stop offset="100%" stopColor="#D9520F" />
        </linearGradient>
        <radialGradient id="ap-core" cx="50%" cy="38%">
          <stop offset="0%" stopColor="#FFF3E4" />
          <stop offset="100%" stopColor="#FFE3C6" />
        </radialGradient>
        <filter id="ap-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground disc — barely there, just enough to seat the marks */}
      <circle cx={c} cy={c} r="88" fill="#FFF6EC" />
      <circle cx={c} cy={c} r="88" fill="none" stroke="rgba(255,107,26,.14)" strokeWidth="0.75" />

      {/* Measured tick ring — every sixth tick reads as a major graduation */}
      <g className="ap-ticks">
        {ticks.map((i) => {
          const a = (i / ticks.length) * TAU
          const major = i % 6 === 0
          const [x1, y1] = polar(c, c, major ? 79 : 83, a)
          const [x2, y2] = polar(c, c, 87, a)
          return (
            <line
              key={i}
              x1={x1.toFixed(2)}
              y1={y1.toFixed(2)}
              x2={x2.toFixed(2)}
              y2={y2.toFixed(2)}
              stroke={major ? 'rgba(217,82,15,.5)' : 'rgba(31,23,16,.16)'}
              strokeWidth={major ? 1.4 : 0.7}
              strokeLinecap="round"
            />
          )
        })}
      </g>

      {/* Data arcs — three radii, counter-rotating, uneven sweeps so it never
          resolves into a symmetrical (and therefore static-looking) figure */}
      <g className="ap-arc ap-arc-a">
        <path d={arc(c, c, 71, 0.15 * TAU, 0.62 * TAU)} stroke="url(#ap-warm)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d={arc(c, c, 71, 0.72 * TAU, 0.86 * TAU)} stroke="rgba(255,107,26,.32)" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="ap-arc ap-arc-b">
        <path d={arc(c, c, 60, 0.05 * TAU, 0.3 * TAU)} stroke="#FF5C93" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.65" />
        <path d={arc(c, c, 60, 0.44 * TAU, 0.95 * TAU)} stroke="rgba(31,23,16,.12)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
      <g className="ap-arc ap-arc-c">
        <path d={arc(c, c, 50, 0.55 * TAU, 0.92 * TAU)} stroke="#7BC043" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* Iris — six overlapping blades closing on a hexagonal aperture.
          Uniform opacity: the overlaps do the shading, so alternating it (as
          the first pass did) only flattened them back into a starburst. */}
      <g className="ap-iris">
        {blades.map((i) => (
          <path
            key={i}
            d={blade(c, c, 40, 15, (i / 6) * TAU, TAU / 12)}
            fill="url(#ap-blade)"
            opacity="0.82"
            stroke="rgba(255,246,236,.5)"
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* Core — the aperture opening, lit from inside */}
      <circle cx={c} cy={c} r="11" fill="url(#ap-core)" filter="url(#ap-glow)" />
      <circle cx={c} cy={c} r="11" fill="none" stroke="rgba(217,82,15,.3)" strokeWidth="0.8" />
      <circle cx={c} cy={c} r="3.2" fill="#FF6B1A" />
    </svg>
  )
}
