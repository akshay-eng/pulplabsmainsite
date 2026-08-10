import { Link } from 'react-router-dom'
import Logo, { Wordmark } from './Logo'

// Four-column footer — used on the home page.
export function FooterFull() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-about">
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <Logo size={28} />
            <Wordmark size={18} />
          </div>
          <p>
            AI consultancy and engineering. Accelerators, solutions and enablement for enterprises and small
            businesses.
          </p>
        </div>

        <div className="footer-col">
          <div className="mono-note">Services</div>
          <Link to="/services">Service catalogue</Link>
          <Link to="/services#accelerators">Enterprise accelerators</Link>
          <Link to="/services#catalogue">Small business solutions</Link>
          <Link to="/services#work">Case studies</Link>
        </div>

        <div className="footer-col">
          <div className="mono-note">Company</div>
          <Link to="/team">Team</Link>
          <Link to="/blog">Blog</Link>
          <a href="https://github.com/pulplabs" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>

        <div className="footer-col">
          <div className="mono-note">Contact</div>
          <Link to="/#contact">Book a call</Link>
          <a className="mail" href="mailto:hello@pulplabs.ai">
            hello@pulplabs.ai
          </a>
        </div>
      </div>

      <div className="footer-base">
        <span>© {new Date().getFullYear()} PulpLabs. All rights reserved.</span>
        <span className="mono">hello@pulplabs.ai</span>
      </div>
    </footer>
  )
}

// Single-row footer — used on services, team and blog.
export function FooterSlim() {
  return (
    <footer className="footer-slim">
      <div className="footer-slim-inner">
        <Link to="/" className="brand">
          <Logo size={28} />
          <Wordmark size={17} />
        </Link>

        <div className="footer-slim-links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/team">Team</Link>
          <Link to="/blog">Blog</Link>
        </div>

        <span className="copy">© {new Date().getFullYear()} PulpLabs · hello@pulplabs.ai</span>
      </div>
    </footer>
  )
}
