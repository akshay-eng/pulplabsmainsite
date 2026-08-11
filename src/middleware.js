import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

/* Edge middleware gate for /admin.
 *
 * This is the first line, not the only one: every admin server action and API
 * route re-checks the session itself. Middleware can be bypassed by
 * misconfiguration, so it must never be the sole guard.
 *
 * Uses `jose` rather than src/lib/auth.js because the Edge runtime has no
 * node:crypto — bcrypt and better-sqlite3 cannot be imported here. */

const COOKIE = 'pl_session'

export async function middleware(request) {
  const { pathname, search } = request.nextUrl

  // The login page itself must stay reachable or you can never get in.
  if (pathname === '/admin/login') return NextResponse.next()

  const token = request.cookies.get(COOKIE)?.value
  const secret = process.env.SESSION_SECRET

  let valid = false
  if (token && secret && secret.length >= 32) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret))
      valid = true
    } catch {
      valid = false // expired, tampered, or the secret was rotated
    }
  }

  if (valid) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = '/admin/login'
  // Send them back where they were headed after logging in.
  url.search = `?next=${encodeURIComponent(pathname + search)}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*'],
}
