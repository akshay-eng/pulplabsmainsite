/* A drawn mark per practice area.
 *
 * Vector rather than generated raster. Three passes of background imagery were
 * rejected here and each failed the same way — a photographic or rendered
 * plate behind text is either loud enough to fight the copy or quiet enough to
 * be noise. A 44px line drawing is neither: it is crisp at any density, it
 * loads with the markup, it carries no colour to compete with the flagship
 * products, and it says what the practice is rather than decorating it.
 */
const MARKS = {
  // Stacked modules on a shared base — systems assembled on an estate.
  build: (
    <g>
      <rect x="3" y="25" width="10" height="8" rx="1" />
      <rect x="17" y="25" width="10" height="8" rx="1" />
      <rect x="10" y="12" width="10" height="8" rx="1" />
      <path d="M8 25v-2h14v2M15 23v-3" />
      <path d="M2 37h26" />
    </g>
  ),
  // A fork where most branches stop and one carries on — ranked by payback.
  advisory: (
    <g>
      <path d="M4 20h5" />
      <path d="M9 20l6-9h13" />
      <path d="M9 20l6 9h8" />
      <path d="M9 20h7" />
      <circle cx="28" cy="11" r="2" />
      <path d="M22 29h1.5M15.5 20h1.5" />
    </g>
  ),
  // Concentric transfer outward from a source — capability moving to a team.
  enablement: (
    <g>
      <circle cx="15" cy="20" r="2.5" />
      <path d="M22 13a10 10 0 0 1 0 14" />
      <path d="M26.5 8.5a16.5 16.5 0 0 1 0 23" />
      <path d="M8 13a10 10 0 0 0 0 14" />
    </g>
  ),
  // A monitored trace with one excursion — behaviour, not uptime.
  managed: (
    <g>
      <path d="M2 22h6l3-6 3 12 3-9 2 3h10" />
      <path d="M2 32h26" />
      <path d="M6 32v3M14 32v3M22 32v3" />
    </g>
  ),
}

export default function PracticeMark({ id }) {
  return (
    <svg className="pm" width="30" height="40" viewBox="0 0 30 40" aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      {MARKS[id] ?? null}
    </svg>
  )
}
