import Link from 'next/link'
import Chevron from '@/components/apple/Chevron'

/* A deliberate hand-off at the foot of every page. Without it each page is a
   dead end and the only way onward is back up to the nav — this makes the
   site a sequence: overview → capabilities → team → contact. */
export default function NextPage({ href, kicker, title, blurb }) {
  return (
    <section className="next">
      <div className="shell-wide">
        <Link href={href} className="next-card" data-r>
          <span className="mono">{kicker}</span>
          <span className="next-t d2">{title}</span>
          <span className="body next-b">{blurb}</span>
          <span className="next-go" aria-hidden="true">
            <Chevron />
          </span>
        </Link>
      </div>
    </section>
  )
}
