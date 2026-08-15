'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo, { Wordmark } from './Logo'
import { useStuck } from '../lib/motion'
import { LEARN_SITE_URL } from '@/lib/sites'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Team' },
  { to: '/blog', label: 'Blog' },
  { to: LEARN_SITE_URL, label: 'Learn' },
]

/* NavLink's `end` prop is gone, so "/" needs an exact match while the others
   match their subtree — otherwise "/" stays highlighted on every page. */
function isActive(pathname, to) {
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

export default function Navbar() {
  const stuck = useStuck(10)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

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
        <Link href="/" className="brand">
          <Logo size={30} />
          <Wordmark size={19} />
        </Link>

        <div className="nav-links">
          {LINKS.map(({ to, label }) => (
            <Link key={to} href={to} className={isActive(pathname, to) ? 'active' : undefined}>
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <Link href="/contact" className="btn btn-primary btn-sm">
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
              <Link
                key={to}
                href={to}
                className={isActive(pathname, to) ? 'active' : undefined}
                style={{ '--reveal-delay': `${i * 40}ms` }}
              >
                {label}
              </Link>
            ))}
            <Link href="/contact" className="btn btn-primary nav-sheet-cta">
              Book a call
            </Link>
          </div>
        </>
      )}
    </header>
  )
}
