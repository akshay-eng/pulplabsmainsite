'use client'

import Link from 'next/link'
import Navbar from '../components/Navbar'
import HeroMarker from '../components/HeroMarker'
import { FooterSlim } from '../components/Footer'
import SectionLabel from '../components/SectionLabel'
import Squiggle from '../components/Squiggle'
import Aperture from '../components/Aperture'
import { SpotlightCard } from '../components/ui'
import CaseCarousel from '../components/CaseCarousel'
import { catalogue, accelerators } from '../data/services'

export default function Services({ cases = [] }) {
  return (
    <div className="page">
      <Navbar />

      {/* PAGE HEADER */}
      <section className="hero">
        <div className="dots" />
        <Aperture
          size={260}
          style={{ position: 'absolute', right: -72, top: -72, opacity: 0.55, pointerEvents: 'none' }}
        />
        <div className="hero-inner" data-reveal>
          <HeroMarker tone="watermelon">No rate cards</HeroMarker>
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
          {catalogue.map(({ code, icon: Icon, title, body, tags, tagStyle, codeColor, blob, shadow }, i) => (
            <SpotlightCard
              key={code}
              as="article"
              className="card catalogue-row"
              style={{ boxShadow: `0 2px 0 ${shadow}`, '--reveal-delay': `${i * 60}ms` }}
              data-reveal
            >
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
            </SpotlightCard>
          ))}
        </div>

        <div className="scope-strip" data-reveal>
          <span>
            Every engagement is priced from discovery — tell us the requirement and we'll scope it with you.
          </span>
          <Link href="/#contact" className="btn btn-primary btn-sm">
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

      <section className="section photo-strip" data-reveal>
        <div className="photo-pair">
          <figure className="photo-band">
            <img src="/photos/engineering.webp" alt="An engineer working at a desk with two monitors" loading="lazy" decoding="async" />
            <figcaption>
              <span className="photo-kicker">Build &amp; evaluate</span>
              Weekly increments, evaluated before they reach production.
            </figcaption>
          </figure>
          <figure className="photo-band">
            <img src="/photos/operations.webp" alt="An operations wall of monitoring dashboards" loading="lazy" decoding="async" />
            <figcaption>
              <span className="photo-kicker">Managed operations</span>
              We run what we build, for as long as you want us to.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section id="work" className="section">
        <SectionLabel dot="#FFC93C">Case studies</SectionLabel>
        <h2 className="section-title" style={{ fontSize: 44, margin: '14px 0 28px' }}>
          Where we've squeezed out real results
        </h2>

        <CaseCarousel items={cases} />
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
          <Link href="/#contact" className="btn btn-lemon" style={{ position: 'relative' }}>
            Book a consultation
          </Link>
        </div>
      </section>

      <FooterSlim />
    </div>
  )
}