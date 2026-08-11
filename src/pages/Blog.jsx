import Navbar from '../components/Navbar'
import HeroMarker from '../components/HeroMarker'
import { FooterSlim } from '../components/Footer'
import Squiggle from '../components/Squiggle'
import NewsletterForm from '../components/NewsletterForm'
import { featuredPost, posts, repos } from '../data/blog'

// Each list item gets a different flat shape so the column doesn't read as a stack of squares.
function PostShape({ shape, accent }) {
  if (shape === 'diamond') {
    return <span style={{ width: 30, height: 30, background: accent, borderRadius: 8, transform: 'rotate(45deg)' }} />
  }
  if (shape === 'ring') {
    return <span style={{ width: 30, height: 30, borderRadius: '50%', border: `7px solid ${accent}` }} />
  }
  if (shape === 'pill') {
    return <span style={{ width: 34, height: 16, background: accent, borderRadius: 100 }} />
  }
  return (
    <span
      style={{
        width: 0,
        height: 0,
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        borderBottom: `26px solid ${accent === '#FFC93C' ? '#E8B00A' : accent}`,
      }}
    />
  )
}

export default function Blog() {
  return (
    <div className="page">
      <Navbar />

      {/* PAGE HEADER */}
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

      {/* FEATURED + LIST */}
      <section className="section" style={{ paddingTop: 64 }}>
        <div className="blog-layout">
          <div>
            <a
              href={featuredPost.href}
              className="card card-lift"
              data-reveal
              style={{ borderRadius: 24, '--accent': '#FF6B1A', '--accent-shadow': 'rgba(255,107,26,.12)' }}
            >
              <div className="featured-art">
                <img src={featuredPost.art} alt="" loading="lazy" decoding="async" />
              </div>

              <div className="featured-copy">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="badge-featured">FEATURED</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted-warm)' }}>
                    {featuredPost.kicker}
                  </span>
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <div className="byline">
                  {featuredPost.author} · {featuredPost.date}
                </div>
              </div>
            </a>

            <div className="post-list">
              {posts.map((post, i) => (
                <a
                  key={post.title}
                  href={post.href}
                  className="post-row"
                  data-reveal
                  style={{ '--reveal-delay': `${i * 70}ms` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = post.accent
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = ''
                  }}
                >
                  <div className="post-thumb" style={{ background: post.thumbBg }}>
                    <PostShape shape={post.shape} accent={post.accent} />
                  </div>
                  <div>
                    <div className="kicker" style={{ color: post.kickerColor }}>
                      {post.kicker}
                    </div>
                    <div className="headline">{post.title}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ASIDE */}
          <aside className="blog-aside">
            <div className="oss-panel">
              <div className="blob" style={{ right: -30, top: -30, width: 110, height: 110, background: '#DDF0C8' }} />
              <div className="card-body">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    color: 'var(--kiwi-deep)',
                  }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--kiwi)' }} />
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

            <div className="aside-newsletter">
              <div className="blob" style={{ right: -26, bottom: -30, width: 100, height: 100, background: '#FFECA8' }} />
              <div className="card-body">
                <h3>Fresh from the lab, monthly.</h3>
                <p>One email a month on what we shipped, learned and open-sourced.</p>
                <NewsletterForm variant="stacked" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <FooterSlim />
    </div>
  )
}
