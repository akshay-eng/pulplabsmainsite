import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo, { Wordmark } from './Logo'
import { useStuck } from '../lib/motion'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Team' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const stuck = useStuck(10)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the sheet on navigation — otherwise it stays open over the new page.
  useEffect(() => setOpen(false), [pathname])

  // Lock the body while the sheet is up so the page behind it can't scroll.
  // The data attribute also tells the AI dock to stand down — the dock sits at
  // z-90 and would otherwise render straight over the open menu.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.dataset.navOpen = 'true'
    return () => {
      document.body.style.overflow = prev
      delete document.documentElement.dataset.navOpen
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="nav-bar" data-stuck={stuck}>
      <nav className="nav-inner">
        <Link to="/" className="brand">
          <Logo size={30} />
          <Wordmark size={19} />
        </Link>

        <div className="nav-links">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <Link to="/#contact" className="btn btn-primary btn-sm">
            Book a call
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-sheet"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-toggle-bars" data-open={open}>
              <i />
              <i />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile sheet — rendered only when open so its links stay out of the
          tab order on desktop. */}
      {open && (
        <>
          <button type="button" className="nav-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="nav-sheet" id="nav-sheet">
            {LINKS.map(({ to, label }, i) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                style={{ '--reveal-delay': `${i * 40}ms` }}
              >
                {label}
              </NavLink>
            ))}
            <Link to="/#contact" className="btn btn-primary nav-sheet-cta">
              Book a call
            </Link>
          </div>
        </>
      )}
    </header>
  )
}
