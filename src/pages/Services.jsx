import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { FooterSlim } from '../components/Footer'
import SectionLabel from '../components/SectionLabel'
import Squiggle from '../components/Squiggle'
import CitrusWheel from '../components/CitrusWheel'
import { catalogue, accelerators, caseStudies } from '../data/services'

export default function Services() {
  return (
    <div className="page">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="hero">
        <div className="dots" />
        <CitrusWheel
          size={230}
          style={{ position: 'absolute', right: -64, top: -64, opacity: 0.9, pointerEvents: 'none' }}
        />
        <div className="hero-inner">
          <div className="pill-badge">
            <span className="pip" />
            Services
          </div>
          <h1 className="page-title" style={{ maxWidth: 760 }}>
            A catalogue of capabilities, <Squiggle>scoped to you.</Squiggle>
          </h1>
          <p className="lede">
            No fixed menus and no rate cards. Every engagement starts with discovery, and the scope, timeline and
            estimate are built from what your business actually needs.
          </p>
        </div>
      </section>

      {/* SERVICE CATALOGUE */}
      <section id="catalogue" className="section" style={{ paddingTop: 76 }}>
        <SectionLabel dot="#FF6B1A">Service catalogue</SectionLabel>
        <h2 className="section-title" style={{ fontSize: 44, margin: '14px 0 28px' }}>
          Five practice areas
        </h2>

        <div className="catalogue">
          {catalogue.map(({ code, icon: Icon, title, body, tags, tagStyle, codeColor, blob, shadow }) => (
            <article key={code} className="card catalogue-row" style={{ boxShadow: `0 2px 0 ${shadow}` }}>
              <div className="blob" style={{ right: -30, top: -30, width: 110, height: 110, background: blob }} />

              <div className="card-body">
                <Icon size={46} />
                <div className="code" style={{ color: codeColor }}>
                  {code}
                </div>
                <h3>{title}</h3>
              </div>

              <div className="card-body">
                <p>{body}</p>
                <div className="tag-row">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag"
                      style={{
                        background: tagStyle.background,
                        border: `1px solid ${tagStyle.borderColor}`,
                        color: tagStyle.color,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="scope-strip">
          <span>
            Every engagement is priced from discovery — tell us the requirement and we'll scope it with you.
          </span>
          <Link to="/#contact" className="btn btn-primary btn-sm">
            Book a consultation
          </Link>
        </div>
      </section>

      {/* ACCELERATORS */}
      <section id="accelerators" className="section">
        <div className="section-label" style={{ marginBottom: 20 }}>
          <span className="dot" style={{ background: '#F0384B' }} />
          <span className="eyebrow">Enterprise accelerators — built for IT operations</span>
          <span className="rule" />
        </div>

        <div className="accelerator-grid">
          {accelerators.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="card card-lift accelerator-card"
              style={{ '--accent': '#FF6B1A', '--accent-shadow': 'rgba(255,107,26,.12)' }}
            >
              <Icon />
              <h3>{title}</h3>
              <p>{body}</p>
              <div className="explore">Explore →</div>
            </article>
          ))}
        </div>
      </section>

      {/* CASE STUDIES */}
      <section id="work" className="section">
        <SectionLabel dot="#FFC93C">Case studies</SectionLabel>
        <h2 className="section-title" style={{ fontSize: 44, margin: '14px 0 28px' }}>
          Where we've squeezed out real results
        </h2>

        <div className="case-grid">
          {caseStudies.map((c) => (
            <article
              key={c.title}
              className="card card-lift case-card"
              style={{ '--accent': c.accent, '--accent-shadow': 'transparent' }}
            >
              <div className="case-art" style={{ background: c.artBg }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `radial-gradient(${c.artDots} 1.3px, transparent 1.3px)`,
                    backgroundSize: '18px 18px',
                  }}
                />
                <div className="blob" style={{ ...c.artBlobPos, background: c.artBlob }} />
                <span className="caption" style={{ color: c.captionColor }}>
                  {c.caption}
                </span>
              </div>

              <div className="case-copy">
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 11.5,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: c.kickerColor,
                  }}
                >
                  {c.client}
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>

                <div className="metric-row">
                  {c.metrics.map((m) => (
                    <div key={m.caption} className="metric">
                      <div className="figure" style={{ color: c.accent }}>
                        {m.figure}
                      </div>
                      <div className="caption">{m.caption}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="cta-banner" style={{ background: 'var(--watermelon)' }}>
          <div className="blob bob-slow" style={{ right: -60, top: -60, width: 240, height: 240, background: '#FF5C6E' }} />
          <div
            className="blob"
            style={{ left: '32%', bottom: -70, width: 150, height: 150, background: 'var(--strawberry)', opacity: 0.6 }}
          />
          <div className="card-body">
            <h2 style={{ color: '#FFF4F1' }}>Not sure which service fits?</h2>
            <p style={{ color: 'rgba(255,244,241,.88)' }}>
              Start with a 30-minute discovery call — we'll point you at the smallest thing that helps.
            </p>
          </div>
          <Link to="/#contact" className="btn btn-lemon" style={{ position: 'relative' }}>
            Book a consultation
          </Link>
        </div>
      </section>

      <FooterSlim />
    </div>
  )
}
