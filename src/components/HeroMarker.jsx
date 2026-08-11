/* HeroMarker — replaces the pill badge at the top of every page hero.
 *
 * The old pattern was a lozenge holding three abstract nouns joined by middots
 * ("AI consultancy · Accelerators · Enablement"). That construction says
 * nothing a visitor couldn't guess and reads as filler. This says one concrete
 * thing instead, in the voice the rest of the copy already uses, set as an
 * editorial marker rather than a badge. */
export default function HeroMarker({ children, tone = 'tangerine' }) {
  return (
    <p className="hero-marker" data-tone={tone}>
      <span className="hero-marker-rule" aria-hidden="true" />
      <span className="hero-marker-text">{children}</span>
    </p>
  )
}
