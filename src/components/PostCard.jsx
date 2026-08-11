import Link from 'next/link'

/* Post presentation, shared by the index and the "read next" strip.
 * Server components — no interactivity beyond the link itself. */

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Deterministic accent per post so a given slug always gets the same colour,
 *  rather than the palette shuffling whenever the feed is reordered. */
const ACCENTS = [
  { fg: '#C42B3D', bg: '#FFE1E4' },
  { fg: '#4F8A1D', bg: '#EAF6DC' },
  { fg: '#B02A5F', bg: '#FFE4EE' },
  { fg: '#A87B00', bg: '#FFF3C4' },
  { fg: '#D9520F', bg: '#FFEBD9' },
]

export function accentFor(slug = '') {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return ACCENTS[h % ACCENTS.length]
}

export default function PostCard({ post, featured = false }) {
  const accent = accentFor(post.slug)

  return (
    <Link href={`/blog/${post.slug}`} className="card card-lift featured-post" data-reveal>
      <div className="featured-art" style={{ background: accent.bg }}>
        {post.cover_image ? (
          <img src={post.cover_image} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="featured-art-mark" style={{ background: accent.fg }} aria-hidden="true" />
        )}
      </div>

      <div className="featured-copy">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {featured && <span className="badge-featured">FEATURED</span>}
          <span className="kicker" style={{ color: accent.fg }}>
            {[post.category, `${post.reading_time ?? ''}`.trim() && `${post.reading_time} min`]
              .filter(Boolean)
              .join(' · ')
              .toUpperCase()}
          </span>
        </div>

        <h2>{post.title}</h2>
        <p>{post.description}</p>

        <div className="post-byline">
          {post.author}
          {post.published_at && ` · ${formatDate(post.published_at)}`}
        </div>
      </div>
    </Link>
  )
}

export function PostRow({ post, index = 0 }) {
  const accent = accentFor(post.slug)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="post-row"
      data-reveal
      style={{ '--reveal-delay': `${index * 70}ms`, '--row-accent': accent.fg }}
    >
      <div className="post-thumb" style={{ background: accent.bg }}>
        {post.cover_image ? (
          <img src={post.cover_image} alt="" loading="lazy" decoding="async" />
        ) : (
          <span style={{ width: 28, height: 28, borderRadius: 9, background: accent.fg }} />
        )}
      </div>

      <div>
        <div className="kicker" style={{ color: accent.fg }}>
          {[post.category, post.published_at && formatDate(post.published_at)].filter(Boolean).join(' · ').toUpperCase()}
        </div>
        <div className="headline">{post.title}</div>
        <p className="post-row-desc">{post.description}</p>
      </div>
    </Link>
  )
}
