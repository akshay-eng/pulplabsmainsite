import { NextResponse } from 'next/server'
import { createEnquiry } from '@/lib/enquiries'
import { sendEnquiryMail } from '@/lib/mail'

/* Contact form endpoint.
 *
 * Order matters: validate → persist → notify. The database write is the
 * success condition, because the mailer is optional and may be unconfigured.
 * A visitor who submits successfully must never be told it failed just because
 * a notification could not go out.
 *
 * Same rate-limit shape as the assistant route — an unauthenticated POST that
 * writes rows and sends mail is exactly what gets abused. */
export const runtime = 'nodejs'

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const rec = hits.get(ip)
  if (!rec || now - rec.start > WINDOW_MS) {
    hits.set(ip, { start: now, n: 1 })
    return false
  }
  rec.n += 1
  return rec.n > MAX_PER_WINDOW
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many submissions. Try again shortly.' }, { status: 429 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 })
  }

  const { name = '', email = '', company = '', topic = 'other', message = '', website = '' } = body

  /* Honeypot: a hidden field no person can see or fill. Bots complete every
     input they find, so anything here is automated. Answer 200 so the bot
     believes it succeeded and does not retry with a different shape. */
  if (website) return NextResponse.json({ ok: true })

  if (String(name).trim().length < 2) {
    return NextResponse.json({ error: 'Please give us a name we can use.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(String(email).trim())) {
    return NextResponse.json({ error: 'That does not look like a complete email address.' }, { status: 400 })
  }
  if (String(message).trim().length < 10) {
    return NextResponse.json({ error: 'A sentence or two about the workflow helps us prepare.' }, { status: 400 })
  }

  let enquiry
  try {
    enquiry = createEnquiry({ name, email, company, topic, message, source: body.source })
  } catch (err) {
    console.error('[enquiry] could not save:', err.message)
    return NextResponse.json({ error: 'Something went wrong saving that. Please email us directly.' }, { status: 500 })
  }

  // Notification is best-effort and deliberately not awaited into the result:
  // the enquiry is stored, so the submission has already succeeded.
  const mail = await sendEnquiryMail(enquiry)

  return NextResponse.json({ ok: true, id: enquiry.id, notified: mail.ok === true })
}
