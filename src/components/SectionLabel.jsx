import { Link } from 'react-router-dom'

// Coloured dot · mono eyebrow · hairline rule — one fruit per section.
export default function SectionLabel({ dot = '#FF6B1A', children, trailTo, trailLabel, note }) {
  return (
    <div className="section-label">
      <span className="dot" style={{ background: dot }} />
      <span className="eyebrow">{children}</span>
      <span className="rule" />
      {trailTo && (
        <Link className="trail" to={trailTo}>
          {trailLabel}
        </Link>
      )}
      {note && <span style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--muted-warm)' }}>{note}</span>}
    </div>
  )
}
