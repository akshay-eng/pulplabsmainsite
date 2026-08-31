/* Outbound mail.
 *
 * Provider-agnostic on purpose: this site has no mail credentials yet, and
 * hard-coding one vendor's SDK would mean a rewrite when that changes. Two
 * transports are supported and picked by which environment variables exist:
 *
 *   RESEND_API_KEY                          → Resend HTTP API (no dependency)
 *   SMTP_HOST + SMTP_USER + SMTP_PASS       → SMTP, needs `npm i nodemailer`
 *
 * With neither configured, send() returns { ok: false, skipped: true } rather
 * than throwing. That matters: the enquiry is already persisted by the caller
 * before this runs, so an unconfigured mailer loses a notification, never a
 * lead.
 */

const RECIPIENTS = (process.env.ENQUIRY_RECIPIENTS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

/* Resend requires a verified sender domain. Until pulplabs.ai is verified there,
 * their shared onboarding sender works for testing. */
const FROM = process.env.ENQUIRY_FROM ?? 'PulpLabs <onboarding@resend.dev>'

export function mailConfigured() {
  if (!RECIPIENTS.length) return false
  return Boolean(process.env.RESEND_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER))
}

export function mailStatus() {
  if (!RECIPIENTS.length) return 'no ENQUIRY_RECIPIENTS set'
  if (process.env.RESEND_API_KEY) return `resend → ${RECIPIENTS.join(', ')}`
  if (process.env.SMTP_HOST) return `smtp ${process.env.SMTP_HOST} → ${RECIPIENTS.join(', ')}`
  return 'no RESEND_API_KEY or SMTP_HOST set'
}

async function sendViaResend({ subject, text, replyTo, attachments }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: RECIPIENTS,
      subject,
      text,
      // So hitting reply in the inbox goes to the enquirer, not to us.
      ...(replyTo ? { reply_to: replyTo } : {}),
      /* Resend takes attachments as base64. A CV goes with the notification
         rather than as a link, so nobody has to be logged in anywhere to read
         an application. */
      ...(attachments?.length
        ? { attachments: attachments.map((a) => ({ filename: a.filename, content: a.content.toString('base64') })) }
        : {}),
    }),
  })
  if (!res.ok) throw new Error(`resend ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return res.json()
}

async function sendViaSmtp({ subject, text, replyTo, attachments }) {
  /* webpackIgnore keeps this out of the dependency graph. A plain dynamic
     import() is still resolved at build time, so without it the bundle fails
     for everyone who has not installed nodemailer — including anyone using the
     Resend transport, which needs no dependency at all. */
  const nodemailer = (await import(/* webpackIgnore: true */ 'nodemailer')).default
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
  return transport.sendMail({ from: FROM, to: RECIPIENTS, subject, text, replyTo, attachments })
}

export async function sendEnquiryMail(enquiry) {
  if (!mailConfigured()) {
    console.warn(`[mail] not sent. ${mailStatus()}. Enquiry #${enquiry.id} is saved in the database.`)
    return { ok: false, skipped: true, reason: mailStatus() }
  }

  const subject = `Enquiry from ${enquiry.company || enquiry.name} (${enquiry.topic})`
  const text = [
    `Name:     ${enquiry.name}`,
    `Email:    ${enquiry.email}`,
    `Company:  ${enquiry.company || 'n/a'}`,
    `Topic:    ${enquiry.topic}`,
    `Received: ${enquiry.created_at}`,
    `Source:   ${enquiry.source || 'contact form'}`,
    '',
    'Message',
    '-------',
    enquiry.message,
    '',
    `Sent by pulplabs.ai · enquiry #${enquiry.id}`,
  ].join('\n')

  try {
    const send = process.env.RESEND_API_KEY ? sendViaResend : sendViaSmtp
    await send({ subject, text, replyTo: enquiry.email })
    return { ok: true }
  } catch (err) {
    // Never surface a transport failure to the visitor — their enquiry is
    // already stored, so the submission genuinely did succeed.
    console.error('[mail] send failed:', err.message)
    return { ok: false, error: err.message }
  }
}


/* Job applications. Same contract as sendEnquiryMail: the caller has already
   stored the application, so a transport failure costs a notification rather
   than a candidate. */
export async function sendApplicationMail(app, cv) {
  if (!mailConfigured()) {
    console.warn(`[mail] application not sent. ${mailStatus()}. Application #${app.id} is saved in the database.`)
    return { ok: false, skipped: true, reason: mailStatus() }
  }

  const subject = `Application: ${app.role_title} from ${app.name}`
  const text = [
    `Role:     ${app.role_title}`,
    `Name:     ${app.name}`,
    `Email:    ${app.email}`,
    `Phone:    ${app.phone}`,
    `Received: ${app.created_at}`,
    '',
    app.note ? `Note\n----\n${app.note}\n` : 'No note left.\n',
    cv ? `CV attached: ${cv.filename}` : 'No CV attached.',
    '',
    `Sent by pulplabs.ai · application #${app.id}`,
  ].join('\n')

  try {
    const send = process.env.RESEND_API_KEY ? sendViaResend : sendViaSmtp
    await send({ subject, text, replyTo: app.email, attachments: cv ? [cv] : [] })
    return { ok: true }
  } catch (err) {
    console.error('[mail] application send failed:', err.message)
    return { ok: false, error: err.message }
  }
}
