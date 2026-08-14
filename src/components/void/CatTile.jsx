import Link from 'next/link'

/* A category tile: a flat pastel illustration with the name overlaid, in the
   manner of OpenAI's department cards. The label sits in HTML rather than
   baked into the image so it stays crisp at any size, is selectable, and can
   be translated — and so a generated illustration can never misspell it. */
export default function CatTile({ cat, kind, i = 0 }) {
  return (
    <li className="tile" data-r style={{ '--rd': `${i * 55}ms` }}>
      <Link href={`/services/for/${cat.id}`} className="tile-link">
        <span className="tile-art">
          <img src={`/void/cat/${kind === 'function' ? 'dept' : 'ind'}-${cat.id}.webp`} alt="" loading="lazy" decoding="async" />
          <span className="tile-chip">{cat.name}</span>
        </span>
        <span className="tile-body">
          <span className="tile-t">{cat.name}</span>
          <span className="body tile-d">{cat.tag}</span>
        </span>
      </Link>
    </li>
  )
}
