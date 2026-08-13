import Link from 'next/link'
import LoopVideo from '@/components/void/LoopVideo'

/* A capability widget: generated artwork over black, the name, one line, and
   the number that matters. The whole tile is one link — no nested interactive
   elements, so there is a single tab stop and the target is the full card
   rather than a four-word phrase. */
export default function CapCard({ cap, i = 0 }) {
  return (
    <li className="cap" data-r style={{ '--rd': `${i * 60}ms` }}>
      <Link href={`/services/${cap.slug}`} className="cap-link">
        {/* Motion only where time is part of what the system does — things
            arriving, resolving, queueing. LoopVideo already refuses to fetch
            under reduced-motion, Save-Data or off-screen, and falls back to
            the poster, so a card is never blank and never costs a visitor
            who did not ask for it. */}
        <span className="cap-art" aria-hidden="true">
          {cap.media === 'video' ? (
            <LoopVideo src={`/void/cards/${cap.slug}`} poster={`/void/cards/${cap.slug}.webp`} className="cap-loop" />
          ) : (
            <img src={`/void/cards/${cap.slug}.webp`} alt="" loading="lazy" decoding="async" />
          )}
        </span>

        <span className="cap-body">
          <span className="cap-head">
            <span className="h4 cap-n">{cap.name}</span>
            <svg className="cap-arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="body cap-d">{cap.tagline}</span>
          <span className="cap-metric">
            <span className="mono">{cap.metric[0]}</span>
            <span className="cap-v">{cap.metric[1]}</span>
          </span>
        </span>
      </Link>
    </li>
  )
}
