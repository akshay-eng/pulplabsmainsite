/* Emphasis stroke under a phrase.
 *
 * Was a wobbly lemon marker line, which read as a child's crayon. Now a
 * precise tapered stroke on a tangerine→lemon gradient that draws itself in
 * when the headline reveals — the same gesture, executed rather than doodled. */
export default function Squiggle({ children, height = 12, weight = 5 }) {
  return (
    <span className="squiggle">
      {children}
      <svg
        width="100%"
        height={height}
        viewBox="0 0 120 12"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sq-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF6B1A" />
            <stop offset="55%" stopColor="#FF8A2B" />
            <stop offset="100%" stopColor="#FFC93C" />
          </linearGradient>
        </defs>
        {/* A single shallow sweep — no return stroke, no overshoot */}
        <path
          className="squiggle-path"
          d="M2 8.5 C 34 4.2, 86 4.2, 118 7.6"
          stroke="url(#sq-grad)"
          strokeWidth={weight}
          fill="none"
          strokeLinecap="round"
          pathLength="1"
        />
      </svg>
    </span>
  )
}
