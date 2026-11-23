import Link from 'next/link'
import Nav from '@/components/void/Nav'
import Footer from '@/components/void/Footer'
import NewsletterForm from '@/components/NewsletterForm'
import { FeaturePost, PostRow } from '@/components/journal/Post'
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
    <div className="grain jr">
      <Nav />

      <main id="main">
        <section className="jr-hero">
          <div className="shell-wide">
            <p className="mono hero-pill-line">Notes from live work</p>
            <h1 className="d1 hero-h">
              <span className="hl" style={{ '--l': 0 }}>
                <span>What we shipped,</span>
              </span>
              <span className="hl" style={{ '--l': 1 }}>
                <span>
                  learned <span className="dim">and open-sourced.</span>
                </span>
              </span>
            </h1>
            <p className="lede hero-l">
              Field notes and playbooks from the engagements themselves — evals, agent migrations, adoption, and the
              things that broke.
            </p>
          </div>
        </section>

        <section className="shell-wide">
          {/* Filters are plain links, not client state — a filtered view is a
              real URL that can be shared, bookmarked and indexed. */}
          {categories.length > 0 && (
            <nav className="jr-filters" aria-label="Filter posts" data-r>
              <Link href="/blog" className="jr-chip" data-active={!filtered || undefined}>
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.category}
                  href={`/blog?category=${encodeURIComponent(c.category)}`}
                  className="jr-chip"
                  data-active={category === c.category || undefined}
                >
                  {c.category} <span>{c.n}</span>
                </Link>
              ))}
            </nav>
          )}

          {posts.length === 0 ? (
            <p className="lede" style={{ paddingBottom: 120 }}>
              No posts here yet{filtered ? ' for that filter' : ''}.{' '}
              {filtered && (
                <Link href="/blog" style={{ color: 'var(--w-1)', textDecoration: 'underline' }}>
                  Show everything
                </Link>
              )}
            </p>
          ) : (
            <div className="jr-layout">
              <div>
                {featured && <FeaturePost post={featured} />}
                {rest.length > 0 && (
                  <ul className="jr-rows">
                    {rest.map((post, i) => (
                      <PostRow key={post.slug} post={post} index={i} />
                    ))}
                  </ul>
                )}
              </div>

              <aside className="jr-aside">
                {tags.length > 0 && (
                  <div className="jr-panel lg lg-card" data-r>
                    <p className="mono">Topics</p>
                    <div className="jr-filters">
                      {tags.map((t) => (
                        <Link
                          key={t.tag}
                          href={`/blog?tag=${encodeURIComponent(t.tag)}`}
                          className="jr-chip"
                          data-active={tag === t.tag || undefined}
                        >
                          {t.tag} <span>{t.n}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="jr-panel lg lg-card" data-r style={{ '--rd': '60ms' }}>
                  <p className="mono">github.com/pulplabs</p>
                  <h3>Open source bits</h3>
                  <p className="body">The eval harnesses and connectors we reuse on every engagement. Take them.</p>
                  {repos.map((repo) => (
                    <a key={repo.name} href={repo.href} className="jr-repo" target="_blank" rel="noreferrer">
                      <strong>{repo.name}</strong>
                      <span className="body">{repo.description}</span>
                      <span className="mono">{repo.meta}</span>
                    </a>
                  ))}
                </div>

                <div className="jr-panel lg lg-card jr-news" data-r style={{ '--rd': '120ms' }}>
                  <p className="mono">Monthly</p>
                  <h3>Fresh from the lab.</h3>
                  <p className="body">One email a month on what we shipped, learned and open-sourced.</p>
                  <NewsletterForm variant="stacked" />
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
