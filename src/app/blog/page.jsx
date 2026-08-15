import Link from 'next/link'
import Navbar from '@/components/Navbar'
import HeroMarker from '@/components/HeroMarker'
import { FooterSlim } from '@/components/Footer'
import Squiggle from '@/components/Squiggle'
import NewsletterForm from '@/components/NewsletterForm'
import PostCard, { PostRow } from '@/components/PostCard'
import { listPublished, allCategories, allTags } from '@/lib/posts'
import { repos } from '@/data/blog'

export const metadata = {
  title: 'Blog',
  description:
    'Engineering field notes and playbooks from live AI work — evals, agent migrations, adoption and the things that broke.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — PulpLabs',
    description: 'Engineering field notes and playbooks from live AI work.',
    url: '/blog',
  },
}

/* Server component. Reads SQLite directly — no API round trip, because the
   query runs in the same process that renders the HTML. */
export default async function BlogIndex({ searchParams }) {
  const params = await searchParams
  const category = params?.category || undefined
  const tag = params?.tag || undefined

  const posts = listPublished({ limit: 60, category, tag })
  const categories = allCategories()
  const tags = allTags().slice(0, 12)

  const [featured, ...rest] = posts
  const filtered = Boolean(category || tag)

  return (
    <div className="page">
      <Navbar />

      <main id="main">
      <section className="hero">
        <div className="dots" />
        <div
          className="blob bob-slower"
          style={{
            right: -40,
            bottom: -80,
            width: 220,
            height: 220,
            border: '24px solid rgba(255,201,60,.4)',
            background: 'transparent',
          }}
        />
        <div className="hero-inner" data-reveal>
          <HeroMarker tone="strawberry">Notes from live work</HeroMarker>
          <h1 className="page-title">
            What we shipped, learned and <Squiggle>open-sourced.</Squiggle>
          </h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 56 }}>
        {/* Filters. Plain links, not client state — so a filtered view is a
            real URL that can be shared, bookmarked and indexed. */}
        {(categories.length > 0 || tags.length > 0) && (
          <nav className="blog-filters" aria-label="Filter posts" data-reveal>
            <Link href="/blog" className="filter-chip" data-active={!filtered || undefined}>
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.category}
                href={`/blog?category=${encodeURIComponent(c.category)}`}
                className="filter-chip"
                data-active={category === c.category || undefined}
              >
                {c.category} <span className="filter-count">{c.n}</span>
              </Link>
            ))}
          </nav>
        )}

        {posts.length === 0 ? (
          <p className="blog-empty">
            No posts here yet{filtered ? ' for that filter' : ''}.{' '}
            {filtered && <Link href="/blog">Show everything</Link>}
          </p>
        ) : (
          <div className="blog-layout">
            <div>
              {featured && <PostCard post={featured} featured />}

              <div className="post-list">
                {rest.map((post, i) => (
                  <PostRow key={post.slug} post={post} index={i} />
                ))}
              </div>
            </div>

            <aside className="blog-aside">
              {tags.length > 0 && (
                <div className="oss-panel" data-reveal>
                  <div className="card-body">
                    <h3 style={{ marginTop: 0 }}>Topics</h3>
                    <div className="tag-cloud">
                      {tags.map((t) => (
                        <Link
                          key={t.tag}
                          href={`/blog?tag=${encodeURIComponent(t.tag)}`}
                          className="filter-chip"
                          data-active={tag === t.tag || undefined}
                        >
                          {t.tag} <span className="filter-count">{t.n}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="oss-panel" data-reveal>
                <div className="blob" style={{ right: -30, top: -30, width: 110, height: 110, background: '#DDF0C8' }} />
                <div className="card-body">
                  <div className="oss-handle">
                    <span />
                    github.com/pulplabs
                  </div>
                  <h3>Open source bits</h3>
                  <p>The eval harnesses and connectors we reuse on every engagement. Take them.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {repos.map((repo) => (
                      <a key={repo.name} href={repo.href} className="repo-card" target="_blank" rel="noreferrer">
                        <div className="repo-name">{repo.name}</div>
                        <div className="repo-desc">{repo.description}</div>
                        <div className="repo-meta">{repo.meta}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="aside-newsletter" data-reveal>
                <div className="blob" style={{ right: -26, bottom: -30, width: 100, height: 100, background: '#FFECA8' }} />
                <div className="card-body">
                  <h3>Fresh from the lab, monthly.</h3>
                  <p>One email a month on what we shipped, learned and open-sourced.</p>
                  <NewsletterForm variant="stacked" />
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
      </main>

      <FooterSlim />
    </div>
  )
}
