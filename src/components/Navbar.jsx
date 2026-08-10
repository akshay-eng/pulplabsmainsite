import { NavLink, Link } from 'react-router-dom'
import Logo, { Wordmark } from './Logo'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/team', label: 'Team' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  return (
    <header className="nav-bar">
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
        </div>
      </nav>
    </header>
  )
}
