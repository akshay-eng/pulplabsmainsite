import Link from 'next/link'
import { IconArrowUpRight } from '@/components/icons/Glyphs'

/* Post presentation for the journal, in the void system. Server components.
   No per-post accent colour: on the void, colour only arrives through
   imagery, so a post without a cover gets the spectral plate instead. */

export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function FeaturePost({ post }) {
  const kicker = [post.category, post.reading_time && `${post.reading_time} min read`].filter(Boolean).join(' · ')
  return (
    <Link href={`/blog/${post.slug}`} className="jr-feature" data-r>
      <span className="jr-feature-art" aria-hidden="true">
        {post.cover_image && <img src={post.cover_image} alt="" loading="lazy" decoding="async" />}
      </span>
      <span className="jr-feature-copy">
        <span className="mono jr-badge">Latest{kicker && ` · ${kicker}`}</span>
        <h2>{post.title}</h2>
        <span className="body">{post.description}</span>
        <span className="mono">
          {post.author}
          {post.published_at && ` · ${formatDate(post.published_at)}`}
        </span>
      </span>
    </Link>
  )
}

export function PostRow({ post, index = 0 }) {
  return (
    <li data-r style={{ '--rd': `${index * 60}ms` }}>
      <Link href={`/blog/${post.slug}`} className="jr-row">
        <span className="jr-thumb" aria-hidden="true">
          {post.cover_image && <img src={post.cover_image} alt="" loading="lazy" decoding="async" />}
        </span>
        <span>
          <span className="mono">
            {[post.category, post.published_at && formatDate(post.published_at)].filter(Boolean).join(' · ')}
          </span>
          <span className="jr-row-t" style={{ display: 'block' }}>
            {post.title}
          </span>
          <span className="body">{post.description}</span>
        </span>
        <IconArrowUpRight size={20} className="jr-arrow" />
      </Link>
    </li>
  )
}
