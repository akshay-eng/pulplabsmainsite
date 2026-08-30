import 'server-only'
import { db } from './db'

/* Every submission is written here BEFORE any attempt to email it.
 *
 * The mailer is optional and may be unconfigured or failing; the database is
 * not. Persisting first means a transport problem costs a notification rather
 * than a lead, and there is always somewhere to go and read what came in. */
export function createEnquiry({ name, email, company, topic, message, source }) {
  const info = db
    .prepare(
      `INSERT INTO enquiries (name, email, company, topic, message, source)
       VALUES (@name, @email, @company, @topic, @message, @source)`,
    )
    .run({
      name: String(name ?? '').slice(0, 200),
      email: String(email ?? '').slice(0, 320),
      company: String(company ?? '').slice(0, 200),
      topic: String(topic ?? 'other').slice(0, 60),
      message: String(message ?? '').slice(0, 8000),
      source: String(source ?? 'contact-form').slice(0, 60),
    })
  return db.prepare(`SELECT * FROM enquiries WHERE id = ?`).get(info.lastInsertRowid)
}

export function listEnquiries(limit = 100) {
  return db
    .prepare(`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT ?`)
    .all(limit)
}
