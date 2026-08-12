'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrolled } from '@/lib/apple-motion'

const LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
]

/* Translucent chrome that content scrolls UNDER — not an opaque bar that
   permanently consumes a strip of the viewport. The material only asserts
   itself once there is content behind it to separate from. */
export default function Nav() {
  const scrolled = useScrolled(12)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="nav" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <nav className="nav-in" aria-label="Primary">
        <Link href="/" className="nav-brand" aria-label="PulpLabs home">
          <span className="nav-mark" aria-hidden="true" />
          PulpLabs
        </Link>

        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={
                  (l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)) ? 'page' : undefined
                }
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-end">
          <Link href="/contact" className="btn nav-cta">
            Talk to us
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-sheet"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
      </nav>

      {/* The sheet expands the same material downward rather than arriving as
          a separate surface — it is the nav growing, not a new object. */}
      <div className="nav-sheet" id="nav-sheet" hidden={!open}>
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ '--i': i }}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
