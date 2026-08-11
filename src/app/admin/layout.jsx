import Link from 'next/link'
import { logoutAction } from './actions'
import { getSession } from '@/lib/auth'
import '@/styles/admin.css'

// Never let a draft-bearing admin screen be cached or indexed.
export const metadata = { robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }) {
  const session = await getSession()

  return (
    <div className="admin">
      {session && (
        <header className="admin-bar">
          <div className="admin-bar-inner">
            <Link href="/admin" className="admin-brand">
              PulpLabs <span>admin</span>
            </Link>
            <nav className="admin-nav">
              <Link href="/admin">Posts</Link>
              <Link href="/admin/posts/new">New post</Link>
              <Link href="/blog" target="_blank" rel="noreferrer">
                View blog ↗
              </Link>
            </nav>
            <form action={logoutAction}>
              <button type="submit" className="admin-btn ghost">Sign out</button>
              <span className="admin-who">{session.email}</span>
            </form>
          </div>
        </header>
      )}
      <main className="admin-main">{children}</main>
    </div>
  )
}
