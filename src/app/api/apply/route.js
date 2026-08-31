import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { writeFile, mkdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { db } from '@/lib/db'
import { getRole } from '@/data/careers'
import { sendApplicationMail } from '@/lib/mail'

/* Job applications.
 *
 * Same order as the enquiry route: validate, store, then notify. The CV is
 * written to disk and the row points at it, so an application survives a mail
 * outage and can still be read later.
 *
 * The existing saveUpload() in lib/uploads.js is deliberately not reused: it
 * sniffs image magic bytes and rejects everything else, which is correct for a
 * cover image and useless for a CV. */
export const runtime = 'nodejs'

const UPLOAD_DIR = resolve(process.env.UPLOAD_DIR || '.data/uploads')
const MAX_CV_BYTES = 5 * 1024 * 1024
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 3
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now - rec.start > WINDOW_MS) { hits.set(ip, { start: now, n: 1 }); return false }
  rec.n += 1
  return rec.n > MAX_PER_WINDOW
}

/* Read the real format from the first bytes. A browser-supplied content type is
   whatever the client felt like sending, so it is never trusted for a file that
   gets written to disk. */
function sniffCv(buf) {
  if (buf.length < 8) return null
  if (buf.subarray(0, 4).toString('latin1') === '%PDF') return { ext: 'pdf', mime: 'application/pdf' }
  // DOCX is a zip; the word/ entry appears early in the central directory.
  if (buf[0] === 0x50 && buf[1] === 0x4b && buf.subarray(0, 4000).toString('latin1').includes('word/'))
    return { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  // Legacy .doc compound file header.
  if (buf.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])))
    return { ext: 'doc', mime: 'application/msword' }
  return null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+()\d][\d\s().-]{6,19}$/

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip') || 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many applications from here. Try again shortly.' }, { status: 429 })
  }

  let form
  try { form = await request.formData() } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  const roleSlug = String(form.get('role') ?? '')
  const name = String(form.get('name') ?? '').trim()
  const email = String(form.get('email') ?? '').trim()
  const phone = String(form.get('phone') ?? '').trim()
  const note = String(form.get('note') ?? '').trim()

  if (form.get('website')) return NextResponse.json({ ok: true })   // honeypot

  const role = getRole(roleSlug)
  if (!role || !role.open) return NextResponse.json({ error: 'That role is not open.' }, { status: 400 })
  if (name.length < 2) return NextResponse.json({ error: 'Please give us a name we can use.' }, { status: 400 })
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'That does not look like a complete email address.' }, { status: 400 })
  if (!PHONE_RE.test(phone)) return NextResponse.json({ error: 'That does not look like a phone number we can call.' }, { status: 400 })

  const file = form.get('cv')
  if (!file || typeof file === 'string' || !file.size) {
    return NextResponse.json({ error: 'Please attach your CV.' }, { status: 400 })
  }
  if (file.size > MAX_CV_BYTES) {
    return NextResponse.json({ error: 'That CV is over 5MB. Please attach a smaller file.' }, { status: 400 })
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const kind = sniffCv(buf)
  if (!kind) {
    return NextResponse.json({ error: 'Please attach a PDF or Word document.' }, { status: 400 })
  }

  const stored = `cv-${randomUUID()}.${kind.ext}`
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
    // Filename is generated, never taken from the upload, so nothing the
    // client sends can escape the directory.
    await writeFile(join(UPLOAD_DIR, stored), buf)
  } catch (err) {
    console.error('[apply] could not store CV:', err.message)
    return NextResponse.json({ error: 'Something went wrong saving that. Please email us directly.' }, { status: 500 })
  }

  const original = String(file.name || `cv.${kind.ext}`).replace(/[^\w.\- ]/g, '').slice(0, 120)
  let app
  try {
    const info = db.prepare(
      `INSERT INTO applications (role_slug, name, email, phone, note, cv_file, cv_name)
       VALUES (@role_slug, @name, @email, @phone, @note, @cv_file, @cv_name)`,
    ).run({
      role_slug: roleSlug, name: name.slice(0, 200), email: email.slice(0, 320),
      phone: phone.slice(0, 40), note: note.slice(0, 4000), cv_file: stored, cv_name: original,
    })
    app = db.prepare(`SELECT * FROM applications WHERE id = ?`).get(info.lastInsertRowid)
  } catch (err) {
    console.error('[apply] could not save:', err.message)
    return NextResponse.json({ error: 'Something went wrong saving that. Please email us directly.' }, { status: 500 })
  }

  const mail = await sendApplicationMail(
    { ...app, role_title: role.title },
    { filename: original, content: buf },
  )
  return NextResponse.json({ ok: true, id: app.id, notified: mail.ok === true })
}
