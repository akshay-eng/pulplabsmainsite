import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { FooterFull } from '../components/Footer'
import SectionLabel from '../components/SectionLabel'
import Squiggle from '../components/Squiggle'
import CitrusWheel from '../components/CitrusWheel'
import ContactForm from '../components/ContactForm'
import NewsletterForm from '../components/NewsletterForm'
import { PieIcon } from '../components/icons'
import { practiceAreas, engagementSteps, testimonials, enablementFormats, platforms } from '../data/home'

export default function Home() {
  return (
    <div className="page">
      <Navbar />

      {/* HERO */}
      <section id="top" className="hero home-hero">
        <div className="dots" />
        <div className="home-hero-inner">
          <div>
            <div className="pill-badge">
              <span className="pip" />
              AI consultancy · Accelerators · Enablement
            </div>

            <h1>
              Get to the <Squiggle>pulp</Squiggle> of what your business needs from AI.
            </h1>

            <p>
              PulpLabs is an AI consultancy and engineering firm. Operational accelerators for enterprises, growth
              solutions for small teams, and the hands-on enablement that makes both stick.
            </p>

            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">
                Book a 30-min consultation
              </a>
              <Link to="/services" className="btn btn-ghost">
                View service catalogue
              </Link>
            </div>
          </div>

          {/* Citrus wheel with floating result chips */}
          <div className="wheel-stage">
            <div className="wheel-ring" />
            <CitrusWheel size={330} />

            <div className="stat-chip bob" style={{ top: 6, right: 8 }}>
              <div className="label">MTTR</div>
              <div className="value" style={{ color: 'var(--tangerine)' }}>
                -38%
              </div>
            </div>

            <div className="stat-chip bob-down" style={{ bottom: 22, left: 0 }}>
              <div className="label">QUOTES</div>
              <div className="value" style={{ color: 'var(--watermelon)' }}>
                4× faster
              </div>
            </div>

            <div
              className="stat-chip bob-slow"
              style={{ bottom: -4, right: 26, background: 'var(--lemon)', border: 0, boxShadow: 'none' }}
            >
              <div className="label" style={{ color: '#7A5A00' }}>
                CERTIFIED
              </div>
              <div className="value" style={{ fontSize: 17, color: 'var(--ink-deep)' }}>
                4 platforms
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="trust-strip">
        <div className="trust-inner">
          <span className="mono-note" style={{ flex: 'none' }}>
            Trusted by
          </span>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="trust-logo" style={{ background: 'var(--tint)' }}>
              Power &amp; Pack Solutions
            </span>
            <span className="trust-logo" style={{ background: 'var(--watermelon-wash)' }}>
              Urban Ethnographers
            </span>
            <span
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 12.5,
                color: 'var(--muted-warm)',
                padding: '9px 14px',
                border: '1px dashed rgba(31,23,16,.2)',
                borderRadius: 'var(--r-pill)',
              }}
            >
              + your logo here
            </span>
          </div>
          <div className="trust-counts">
            <span>
              <strong>8+</strong> accelerators
            </span>
            <span>
              <strong>4</strong> certifications
            </span>
            <span>
              <strong>6</strong> people
            </span>
          </div>
        </div>
      </section>

      {/* SERVICE CATALOGUE PREVIEW */}
      <section className="section">
        <SectionLabel dot="#FF6B1A" trailTo="/services" trailLabel="Full catalogue →">
          Service catalogue
        </SectionLabel>

        <h2 className="section-title" style={{ maxWidth: 640 }}>
          Five practice areas, <span style={{ color: 'var(--tangerine-deep)' }}>zero fixed menus.</span>
        </h2>

        <div className="practice-grid">
          {practiceAreas.map(({ icon: Icon, title, blurb, accent, shadow }) => (
            <Link
              key={title}
              to="/services"
              className="card card-lift practice-card"
              style={{ '--accent': accent, '--accent-shadow': shadow }}
            >
              <Icon />
              <h3>{title}</h3>
              <p>{blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW WE ENGAGE */}
      <section className="section">
        <SectionLabel dot="#F0384B">How we engage</SectionLabel>

        <h2 className="section-title">
          Discover. Build. <Squiggle height={12} weight={5}>Hand over.</Squiggle>
        </h2>

        <div className="step-grid">
          {engagementSteps.map((s) => (
            <div key={s.title} className="step-card" style={{ background: s.bg }}>
              <div
                className="blob"
                style={{ right: -26, top: -26, width: 96, height: 96, background: s.blob }}
              />
              <div className="card-body">
                <PieIcon disc={s.disc} fill={s.fill} fraction={s.fraction} full={s.full} />
                <div className="step-meta" style={{ color: s.metaColor }}>
                  {s.step}
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <SectionLabel dot="#FF5C93">What clients say</SectionLabel>

        <div className="quote-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="card quote-card" style={{ boxShadow: `0 2px 0 ${t.shadow}` }}>
              <div
                className="blob"
                style={{ right: -34, bottom: -42, width: 130, height: 130, background: t.wash }}
              />
              <div className="card-body">
                <div className="quote-mark" style={{ color: t.accent }} aria-hidden="true">
                  &ldquo;
                </div>
                <blockquote className="quote-text" style={{ margin: 0 }}>
                  {t.quote}
                </blockquote>
                <div className="quote-author">
                  <div className="avatar" style={{ background: t.wash }}>
                    <span className="head" style={{ background: t.avatarInk || t.accent }} />
                    <span className="shoulders" style={{ background: t.avatarInk || t.accent }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ENABLEMENT */}
      <section className="band">
        <div className="band-ring" />
        <div className="band-inner">
          <div>
            <span className="eyebrow">AI enablement</span>
            <h2>Capability transfer, not a training day.</h2>
            <p>
              Certified instructors run sessions on your workflows and your data — not a generic slide deck. Every
              cohort leaves with something in production.
            </p>
            <div className="chip-row">
              {platforms.map((p) => (
                <span key={p.label} className="chip" style={{ border: `1px solid ${p.border}` }}>
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {enablementFormats.map((f) => (
              <div key={f.name} className="format-card" style={{ boxShadow: `0 3px 0 ${f.shadow}` }}>
                <PieIcon size={40} disc={f.disc} fill={f.fill} fraction={f.fraction} full={f.full} />
                <div>
                  <div className="duration" style={{ color: f.durationColor }}>
                    {f.duration}
                  </div>
                  <div className="name">{f.name}</div>
                  <div className="blurb">{f.blurb}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-card">
          <div className="blob bob-slow" style={{ right: -70, top: -70, width: 300, height: 300, background: '#FF8A2B' }} />
          <div
            className="blob bob-slower"
            style={{ left: -60, bottom: -90, width: 220, height: 220, background: 'var(--lemon)', opacity: 0.55 }}
          />

          <div className="card-body contact-copy">
            <h2>Tell us the workflow that's eating your week.</h2>
            <p>
              Thirty minutes with an engineer, no deck. You'll leave with a straight answer on whether AI helps here —
              even if that answer is no.
            </p>
            <a className="contact-mail" href="mailto:hello@pulplabs.ai">
              hello@pulplabs.ai
            </a>
          </div>

          <ContactForm />
        </div>

        <div className="newsletter">
          <div className="blob" style={{ right: 120, top: -40, width: 90, height: 90, background: '#FFECA8' }} />
          <div className="card-body">
            <h3>Fresh from the lab, monthly.</h3>
            <p>One email a month on what we shipped, learned and open-sourced. No spam.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <FooterFull />
    </div>
  )
}
