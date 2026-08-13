/* The platform marks.
 *
 * All five are the vendors' real marks, supplied as image files. The drawn
 * fallback below stays for any platform that arrives without one — a guessed-at
 * approximation of a trademark is worse than an honest abstract shape.
 *
 * The OpenAI knot ships as mid-grey (rgb 97,97,97), which all but disappears
 * on an AMOLED background, so it was repainted white — the treatment OpenAI
 * itself uses on dark. The other three are untouched.
 *
 * These are the one place colour enters the interface directly rather than
 * through generated light. A brand mark recoloured to fit a palette stops
 * being a brand mark, and at 16–20px the colour reads as a small accent. */
const LOGOS = { claude: 'Anthropic', openai: 'OpenAI', copilot: 'Microsoft', gemini: 'Google', watsonx: 'IBM' }

export default function PlatformMark({ id, className = '' }) {
  if (LOGOS[id]) {
    return (
      <img
        className={`pmark pmark-img ${className}`}
        src={`/logos/${id}.webp`}
        alt=""
        width="40"
        height="40"
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />
    )
  }

  // A stack under rules — a governed catalogue of skills.
  return (
    <svg className={`pmark ${className}`} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.6 3.6h10.8M2.6 8h10.8M2.6 12.4h10.8M5.4 3.6v8.8M10.6 3.6v8.8" />
    </svg>
  )
}
