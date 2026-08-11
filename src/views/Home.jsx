'use client'

import Link from 'next/link'
import Navbar from '../components/Navbar'
import HeroMarker from '../components/HeroMarker'
import { FooterFull } from '../components/Footer'
import SectionLabel from '../components/SectionLabel'
import Squiggle from '../components/Squiggle'
import HeroStage from '../components/HeroStage'
import ContactForm from '../components/ContactForm'
import NewsletterForm from '../components/NewsletterForm'
import { PieIcon } from '../components/icons'
import { Marquee, Counter, SpotlightCard, Magnetic } from '../components/ui'
import { GaugeRing, IconPulse, IconBolt, IconClock, IconStack, IconBadge } from '../components/Telemetry'
import { useParallax } from '../lib/motion'
import { practiceAreas, engagementSteps, testimonials, enablementFormats, platforms } from '../data/home'

/* `fill` is the gauge sweep, separate from `value` — "4 platforms" and "8+
   accelerators" have no shared scale, so the arc encodes progress toward a
   sensible ceiling rather than pretending they're comparable. */
const TELEMETRY = [
  { value: 4, suffix: '×', fill: 80, label: 'Faster quote turnaround', accent: '#D9333F', icon: <IconBolt /> },
  { value: 4, fill: 66, label: 'Weeks to first system live', accent: '#D9520F', icon: <IconClock /> },
  { value: 8, suffix: '+', fill: 88, label: 'Accelerators in production', accent: '#C9930A', icon: <IconStack /> },
  { value: 4, fill: 100, label: 'Platform certifications', accent: '#5B9E2E', icon: <IconBadge /> },
]

/* Marquee content is the capability set, not a client list — inventing logos
   for a marquee would put claimed customers on a live site. The two real
   client names stay in the trust strip below. */
const CAPABILITIES = [
  'Incident Intelligence',
  'Change Copilot',
  'Patch Orchestrator',
  'Agent Migration',
  'Lead Engine',
  'Support Desk',
  'Marketing Studio',
  'Social Autopilot',
]

export default function Home() {
  const stage = useParallax(0.06, 28)

  return (
    <div className="page">
      <Navbar />

      {/* HERO */}
      <section id="top" className="hero home-hero">
        <div className="dots" />
        <div className="home-hero-inner">
          <div>
            <HeroMarker>We stay after the pilot</HeroMarker>

            <h1>
              Get to the <Squiggle>pulp</Squiggle> of what your business needs from AI.
            </h1>

            <p>
              PulpLabs is an AI consultancy and engineering firm. Operational accelerators for enterprises, growth
              solutions for small teams, and the hands-on enablement that makes both stick.
            </p>

            <div className="hero-actions">
              <Magnetic strength={0.12} max={4}>
                <a href="#contact" className="btn btn-primary">
                  Book a 30-min consultation
                </a>
              </Magnetic>
              <Link href="/services" className="btn btn-ghost">
                View service catalogue
              </Link>
            </div>
          </div>

          {/* WebGL core with result chips — the chips drift against the
              stage's parallax so it has depth rather than sitting flat. */}
          <div className="wheel-stage" ref={stage}>
            <div className="wheel-ring" />
            <HeroStage />

            <div className="stat-chip bob" style={{ top: 6, right: 8 }}>
              <div className="label">MTTR</div>
              <div className="value" style={{ color: 'var(--tangerine-deep)' }}>
                <Counter to={38} prefix="-" suffix="%" />
              </div>
            </div>

            <div className="stat-chip bob-down" style={{ bottom: 22, left: 0 }}>
              <div className="label">QUOTES</div>
              <div className="value" style={{ color: 'var(--watermelon-deep)' }}>
                <Counter to={4} suffix="× faster" />
              </div>
            </div>

            <div className="stat-chip bob-slow" style={{ bottom: -4, right: 26 }}>
              <div className="label">CERTIFIED</div>
              <div className="value" style={{ fontSize: 19, color: 'var(--ink-deep)' }}>
                <Counter to={4} suffix=" platforms" />
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
          </div>
          <div className="trust-counts">
            <span>
              <strong>
                <Counter to={8} suffix="+" />
              </strong>{' '}
              accelerators
            </span>
            <span>
              <strong>
                <Counter to={4} />
              </strong>{' '}
              certifications
            </span>
            <span>
              <strong>
                <Counter to={6} />
              </strong>{' '}
              people
            </span>
          </div>
        </div>

        {/* What we actually ship, on a loop */}
        <Marquee speed={46} className="capability-marquee">
          {CAPABILITIES.map((c) => (
            <span key={c} className="capability-pill">
              {c}
            </span>
          ))}
        </Marquee>
      </section>

      {/* RESULTS — bento */}
      <section className="section">
        <div data-reveal>
          <SectionLabel dot="#F0384B">Measured outcomes</SectionLabel>
          <h2 className="section-title" style={{ maxWidth: 640 }}>
            We ship against numbers, <span style={{ color: 'var(--tangerine-deep)' }}>not adjectives.</span>
          </h2>
        </div>

        {/* Telemetry panel — an instrument console rather than five plain
            boxes. Each metric carries a radial gauge that fills on reveal, a
            line icon, and a mono readout. */}
        <div className="telemetry" data-reveal>
          <div className="telemetry-head">
            <span className="telemetry-status">
              <span className="telemetry-pip" />
              Live estate telemetry
            </span>
            <span className="telemetry-meta">Aggregate · 8 deployments</span>
          </div>

          <div className="telemetry-body-grid">
            {/* Lead metric sits directly on the tangerine ground — no card —
                so it clearly outranks the four supporting figures. */}
            <article className="telemetry-lead">
              <GaugeRing
                value={38}
                max={100}
                accent="#FFE08A"
                track="rgba(255,255,255,.22)"
                icon={<IconPulse />}
                size={86}
              />
              <div>
                <div className="telemetry-lead-value">
                  <Counter to={38} prefix="−" suffix="%" />
                </div>
                <div className="telemetry-lead-label">Mean time to resolution</div>
                <p>
                  Incident Intelligence triages and correlates against your live queue, so the first responder opens
                  with context instead of a blank search box.
                </p>
              </div>
            </article>

            <div className="telemetry-cards">
              {TELEMETRY.map((m, i) => (
                <article className="telemetry-card" key={m.label} style={{ '--reveal-delay': `${(i + 1) * 80}ms` }}>
                  <GaugeRing value={m.fill} max={100} accent={m.accent} icon={m.icon} size={62} />
                  <div>
                    <div className="telemetry-card-value">
                      <Counter to={m.value} suffix={m.suffix ?? ''} />
                    </div>
                    <div className="telemetry-card-label">{m.label}</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE CATALOGUE PREVIEW */}
      <section className="section">
        <div data-reveal>
          <SectionLabel dot="#FF6B1A" trailTo="/services" trailLabel="Full catalogue →">
            Service catalogue
          </SectionLabel>

          <h2 className="section-title" style={{ maxWidth: 640 }}>
            Five practice areas, <span style={{ color: 'var(--tangerine-deep)' }}>zero fixed menus.</span>
          </h2>
        </div>

        <div className="practice-grid">
          {practiceAreas.map(({ icon: Icon, title, blurb, accent, shadow }, i) => (
            <SpotlightCard
              key={title}
              as={Link}
              href="/services"
              className="card card-lift practice-card"
              style={{ '--accent': accent, '--accent-shadow': shadow, '--reveal-delay': `${i * 70}ms` }}
              data-reveal
            >
              <Icon />
              <h3>{title}</h3>
              <p>{blurb}</p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* HOW WE ENGAGE */}
      <section className="section">
        <div data-reveal>
          <SectionLabel dot="#F0384B">How we engage</SectionLabel>

          <h2 className="section-title">
            Discover. Build. <Squiggle height={12} weight={5}>Hand over.</Squiggle>
          </h2>
        </div>

        <div className="step-grid">
          {engagementSteps.map((s, i) => (
            <div key={s.title} className="step-card" style={{ background: s.bg, '--reveal-delay': `${i * 80}ms` }} data-reveal>
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
        <div data-reveal>
          <SectionLabel dot="#FF5C93">What clients say</SectionLabel>
        </div>

        <div className="quote-grid">
          {testimonials.map((t, i) => (
            <SpotlightCard
              key={i}
              className="card quote-card"
              style={{ boxShadow: `0 2px 0 ${t.shadow}`, '--reveal-delay': `${i * 90}ms` }}
              data-reveal
            >
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
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* ENABLEMENT */}
      <section className="band">
        <div className="band-ring" />
        <div className="band-inner">
          <div data-reveal>
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
            {enablementFormats.map((f, i) => (
              <div
                key={f.name}
                className="format-card"
                style={{ boxShadow: `0 3px 0 ${f.shadow}`, '--reveal-delay': `${i * 80}ms` }}
                data-reveal
              >
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