import Link from 'next/link'
import LoopVideo from '@/components/void/LoopVideo'

/* Case studies as two side-by-side cards rather than a tab strip.
 *
 * Tabs hid half the evidence behind a click, and with only two engagements
 * that is a control standing in front of the content it controls. Both are
 * visible now, and the section is shorter than one tab used to be.
 *
 * The media is real-world footage of the client's actual working environment —
 * a packaging warehouse, a desk of marked-up transcripts — not an invented
 * interface. A generated screen says "here is a mockup"; a room says "this
 * happened somewhere". It is also the one thing Veo does well: photoreal
 * footage with real depth of field, rather than type it cannot render.
 *
 * Server component: no state left to hold once the tabs are gone.
 */
export default function CaseStudies({ cases = [] }) {
  if (!cases.length) return null

  return (
    <ul className="cse">
      {cases.map((c, i) => (
        <li key={c.slug} data-r style={{ '--rd': `${i * 80}ms` }}>
          <Link href={`/case-studies/${c.slug}`} className="cse-card">
            <span className="cse-media">
              {c.loop_video ? (
                <LoopVideo src={c.loop_video} poster={c.cover_image} className="cse-loop" />
              ) : (
                c.cover_image && <img src={c.cover_image} alt="" loading="lazy" decoding="async" />
              )}
              {/* The footage is the ground the copy sits on, so it needs a
                  scrim — legibility over a moving image cannot be left to
                  whatever frame happens to be showing. */}
              <span className="cse-scrim" aria-hidden="true" />

              <span className="cse-over">
                <span className="mono cse-k">
                  {c.client}
                  {c.industry ? ` · ${c.industry}` : ''}
                </span>
                <span className="cse-t">{c.title}</span>
              </span>
            </span>

            <span className="cse-foot">
              <span className="body cse-s">{c.summary}</span>

              {c.metrics?.length > 0 && (
                <span className="cse-out">
                  {c.metrics.slice(0, 3).map((m) => (
                    <span key={m.figure + m.caption}>
                      <b>{m.figure}</b>
                      <span className="mono">{m.caption}</span>
                    </span>
                  ))}
                </span>
              )}

              <span className="cse-more">
                Read the story
                <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.4" fill="none"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
