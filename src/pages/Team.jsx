import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import HeroMarker from '../components/HeroMarker'
import { FooterSlim } from '../components/Footer'
import SectionLabel from '../components/SectionLabel'
import Squiggle from '../components/Squiggle'
import { people, certifications } from '../data/team'

export default function Team() {
  return (
    <div className="page">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="hero">
        <div className="dots" />

        {/* Three overlapping fruit discs, multiplied so the overlaps darken */}
        <div className="fruit-cluster" aria-hidden="true">
          <span className="bob" style={{ background: 'var(--tangerine)', animationDuration: '8s' }} />
          <span className="bob" style={{ background: 'var(--watermelon)', animationDuration: '10s' }} />
          <span className="bob" style={{ background: 'var(--lemon)', animationDuration: '12s' }} />
        </div>

        <div className="hero-inner" data-reveal>
          <HeroMarker tone="kiwi">Six people, four platforms</HeroMarker>
          <h1 className="page-title" style={{ maxWidth: 760 }}>
            Six people. <Squiggle>You'll meet all of them.</Squiggle>
          </h1>
          <p className="lede" style={{ maxWidth: 560 }}>
            No bench, no handoffs. The people on this page are the people on your engagement — from discovery call to
            production handover.
          </p>
        </div>
      </section>

      {/* TEAM GRID */}
      <section className="section" style={{ paddingTop: 72 }}>
        <SectionLabel dot="#FF6B1A" note="swap in real names, photos & links">
          The six of us
        </SectionLabel>

        <figure className="stock-photo-figure stock-photo-team" data-reveal>
          <img
            src="/photos/workshop-collaboration.webp"
            alt="Two colleagues working side by side with a tablet"
            loading="lazy"
            decoding="async"
            width="1600"
            height="1067"
          />
          <figcaption>Working side by side · illustrative editorial image</figcaption>
        </figure>

        <div className="team-grid" style={{ marginTop: 26 }}>
          {people.map((p, i) => (
            <article
              key={i}
              className="card"
              style={{ boxShadow: `0 2px 0 ${p.shadow}`, '--reveal-delay': `${(i % 3) * 80}ms` }}
              data-reveal
            >
              <PersonPhoto person={p} />

              <div className="person-body">
                <div className="name">{p.name}</div>
                <div className="person-role" style={p.roleStyle}>
                  {p.role}
                </div>
                <p>{p.bio}</p>
                <div className="person-links">
                  <a href={p.linkedin} onMouseEnter={hoverBorder(p.accent)} onMouseLeave={resetBorder}>
                    LinkedIn
                  </a>
                  <a href={p.github} onMouseEnter={hoverBorder(p.accent)} onMouseLeave={resetBorder}>
                    GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="band" style={{ marginTop: 82, padding: '64px 0' }}>
        <div className="band-ring" style={{ width: 280, height: 280, borderWidth: 26 }} />
        <div style={{ position: 'relative', maxWidth: 'var(--shell)', margin: '0 auto', padding: '0 var(--gutter)' }}>
          <h2 style={{ fontWeight: 800, fontSize: 36, margin: '0 0 24px' }}>Certified across four platforms</h2>

          <div className="cert-grid">
            {certifications.map(({ icon: Icon, name, issuer, shadow }, i) => (
              <div
                key={name}
                className="cert-card"
                style={{ boxShadow: `0 3px 0 ${shadow}`, '--reveal-delay': `${i * 70}ms` }}
                data-reveal
              >
                <Icon />
                <div>
                  <div className="name">{name}</div>
                  <div className="issuer">{issuer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="cta-banner" style={{ background: 'var(--strawberry)' }}>
          <div className="blob bob-slow" style={{ right: -60, top: -60, width: 240, height: 240, background: '#FF7FAB' }} />
          <div
            className="blob"
            style={{ left: '30%', bottom: -70, width: 150, height: 150, background: 'var(--lemon)', opacity: 0.5 }}
          />
          <div className="card-body">
            <h2 style={{ color: '#3A0E20' }}>Want us in the room?</h2>
            <p style={{ color: 'rgba(58,14,32,.8)' }}>
              Book a discovery call and you'll talk to an engineer, not a salesperson.
            </p>
          </div>
          <Link to="/#contact" className="btn btn-ink" style={{ position: 'relative' }}>
            Book a consultation
          </Link>
        </div>
      </section>

      <FooterSlim />
    </div>
  )
}

function PersonPhoto({ person }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="person-photo" style={{ background: person.photoBg }}>
      {!failed && person.photo ? (
        <img
          src={person.photo}
          alt={`Illustrated portrait for ${person.role}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          style={{ objectPosition: person.photoPosition || '50% 20%' }}
        />
      ) : (
        <div className="person-photo-fallback" aria-label={`${person.role} portrait unavailable`}>
          <span className="head" style={{ background: person.figure, opacity: person.figureOpacity }} />
          <span className="shoulders" style={{ background: person.figure, opacity: person.figureOpacity }} />
        </div>
      )}
    </div>
  )
}

// Each person's links pick up their own fruit on hover.
function hoverBorder(color) {
  return (event) => {
    event.currentTarget.style.borderColor = color
  }
}

function resetBorder(event) {
  event.currentTarget.style.borderColor = ''
}
