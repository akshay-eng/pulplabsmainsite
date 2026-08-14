'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useScrolled } from '@/lib/apple-motion'

const LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/services', label: 'Capabilities' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const scrolled = useScrolled(10)
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
    <header className="nv" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <nav className="nv-in" aria-label="Primary">
        <Link href="/" className="nv-brand" aria-label="PulpLabs home">
          {/* The mark is a stroke, not a picture. On black, geometry reads as
              engineered where an illustration reads as decoration. */}
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M2 14 L10 3 L18 14" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
            <path d="M6 17 L14 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>PulpLabs</span>
        </Link>

        <ul className="nv-links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={(l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)) ? 'page' : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nv-end">
          <Link href="/contact" className="btn nv-cta">Start a project</Link>
          <button
            type="button"
            className="nv-toggle"
            aria-expanded={open}
            aria-controls="nv-sheet"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span />
          </button>
        </div>
      </nav>

      <div className="nv-sheet" id="nv-sheet" hidden={!open}>
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ '--i': i }}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <Link href="/contact" className="btn nv-sheet-cta">Start a project</Link>
      </div>
    </header>
  )
}
