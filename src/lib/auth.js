import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { db } from './db'

/* ==========================================================================
   Auth — one admin, session in a signed httpOnly cookie.

   Deliberately not Auth.js: there is a single operator, no OAuth, no user
   table to speak of. A signed JWT in an httpOnly cookie is the whole
   requirement, and it's auditable in fifty lines.
   ========================================================================== */

const COOKIE = 'pl_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function secret() {
  const s = process.env.SESSION_SECRET
  // Failing loudly beats silently signing sessions with a default that is
  // identical on every deploy and forgeable by anyone who reads this file.
  if (!s || s.length < 32) {
    throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters.')
  }
  return new TextEncoder().encode(s)
}

/* ------------------------------------------------------------ passwords --- */

export function hashPassword(plain) {
  return bcrypt.hashSync(plain, 12)
}

export function findAdmin(email) {
  return db.prepare(`SELECT * FROM admin_users WHERE email = ?`).get(String(email).toLowerCase().trim())
}

export function upsertAdmin(email, plainPassword) {
  const e = String(email).toLowerCase().trim()
  const hash = hashPassword(plainPassword)
  db.prepare(
    `INSERT INTO admin_users (email, password_hash) VALUES (?, ?)
     ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash`,
  ).run(e, hash)
  return findAdmin(e)
}

export async function verifyCredentials(email, password) {
  const admin = findAdmin(email)
  // Compare against a dummy hash when the user is missing so the response
  // time doesn't reveal which accounts exist.
  const hash = admin?.password_hash || '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidiu'
  const ok = bcrypt.compareSync(String(password), hash)
  return ok && admin ? admin : null
}

/* ------------------------------------------------------------- sessions --- */

export async function createSession(admin) {
  const token = await new SignJWT({ sub: String(admin.id), email: admin.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())

  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true, // unreachable from JS, so XSS can't lift the session
    sameSite: 'lax', // blocks cross-site POSTs, which is the CSRF vector here
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function destroySession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

/** Returns the session payload, or null. Never throws on a bad token. */
export async function getSession() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload
  } catch {
    return null // expired, tampered, or signed with a rotated secret
  }
}

export async function requireSession() {
  const session = await getSession()
  if (!session) throw new Error('UNAUTHORISED')
  return session
}

/* ----------------------------------------------------------- API tokens --- */

/** Bearer-token check for the automation API. Constant-time comparison. */
export function verifyApiToken(header) {
  const expected = process.env.API_TOKEN
  if (!expected) return false

  const got = String(header || '').replace(/^Bearer\s+/i, '')
  if (got.length !== expected.length) return false

  // Avoid leaking how many leading characters matched via timing.
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}
