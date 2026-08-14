import Link from 'next/link'

/* Same tile as the capability widget, plus the status badge. The badge is the
   whole point of this page: a catalogue that does not say which things are
   built and which are scoped reads as a claim rather than a menu. */
export default function SolCard({ sol, i = 0 }) {
  return (
    <li className="cap" data-r style={{ '--rd': `${i * 55}ms` }}>
      <Link href={`/services/${sol.slug}`} className="cap-link">
        <span className="cap-art" aria-hidden="true">
          <img src={`/void/cards/${sol.slug}.webp`} alt="" loading="lazy" decoding="async" />
          <span className={`sol-status is-${sol.status} is-float`}>
            {sol.status === 'production' ? 'Accelerator' : 'Built to scope'}
          </span>
        </span>

        <span className="cap-body">
          <span className="cap-head">
            <span className="h4 cap-n">{sol.name}</span>
            <svg className="cap-arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="body cap-d">{sol.tagline}</span>
          <span className="cap-metric">
            <span className="mono">{sol.metric[0]}</span>
            <span className="cap-v">{sol.metric[1]}</span>
          </span>
        </span>
      </Link>
    </li>
  )
}
