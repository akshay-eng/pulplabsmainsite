import { spotlight, LEARN_FIELD_URL } from '@/data/spotlight'

/* Two pieces of writing from PulpLabs Learn, on the marketing site.
 *
 * Every link here leaves for another origin, so each one says so rather than
 * relying on the reader noticing the domain afterwards: an external-link glyph
 * on the card, and a visually-hidden "on PulpLabs Learn" inside the accessible
 * name so it is announced too. next/link is deliberately not used — these are
 * cross-origin URLs and prefetching them would do nothing but leak a request.
 */

function fmt(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export default function Spotlight() {
  return (
    <>
      <ul className="spot">
        {spotlight.map((s, i) => (
          <li key={s.slug} data-r style={{ '--rd': `${i * 80}ms` }}>
            <a className="spot-card" href={s.href} target="_blank" rel="noreferrer">
              <span className="spot-art" aria-hidden="true">
                <img src={s.art} alt="" loading="lazy" decoding="async" />
              </span>

              <span className="spot-body">
                <span className="spot-meta">
                  <span className="mono spot-kind">{s.kind}</span>
                  <span className="mono spot-dot" aria-hidden="true">·</span>
                  <span className="mono">{s.minutes} min read</span>
                </span>

                <span className="d3 spot-t">
                  {s.title}
                  <span className="sr-only"> — on PulpLabs Learn</span>
                </span>

                <span className="body spot-d">{s.summary}</span>

                <span className="spot-foot">
                  <span className="mono spot-src">
                    {s.client ?? s.sector}
                    {fmt(s.published) && <> · {fmt(s.published)}</>}
                  </span>
                  <span className="spot-go" aria-hidden="true">
                    Read on Learn
                    <svg width="12" height="12" viewBox="0 0 14 14">
                      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mono spot-all">
        <a className="link" href={LEARN_FIELD_URL} target="_blank" rel="noreferrer">
          Every case study, engagement note and interview on PulpLabs Learn
          <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </p>
    </>
  )
}
