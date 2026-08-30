import 'server-only'
import GithubSlugger from 'github-slugger'
import { db } from './db'

/* ==========================================================================
   Case study queries. Mirrors src/lib/posts.js deliberately — same hydrate /
   normalise / validate shape — so there is one pattern to learn rather than
   two subtly different ones.
   ========================================================================== */

const hydrate = (row) => {
  if (!row) return null
  let metrics = []
  try {
    const parsed = JSON.parse(row.metrics || '[]')
    // Guard the shape: a hand-edited row shouldn't take the services page down.
    if (Array.isArray(parsed)) {
      metrics = parsed
        .filter((m) => m && typeof m === 'object')
        .map((m) => ({ figure: String(m.figure ?? ''), caption: String(m.caption ?? '') }))
        .filter((m) => m.figure || m.caption)
    }
  } catch {
    metrics = []
  }
  return { ...row, metrics }
}

export function uniqueSlug(title, ignoreId = null) {
  const base = new GithubSlugger().slug(title) || 'case-study'
  const taken = db
    .prepare(`SELECT slug FROM case_studies WHERE slug LIKE ? AND id IS NOT ?`)
    .all(`${base}%`, ignoreId)
    .map((r) => r.slug)
  if (!taken.includes(base)) return base
  let n = 2
  while (taken.includes(`${base}-${n}`)) n++
  return `${base}-${n}`
}

/* ---------------------------------------------------------------- reads --- */

/** Ordered by `position` first so the carousel lead is an editorial choice. */
export function listPublishedCases({ limit = 24 } = {}) {
  return db
    .prepare(
      `SELECT * FROM case_studies WHERE status='published'
       ORDER BY position ASC, published_at DESC LIMIT ?`,
    )
    .all(limit)
    .map(hydrate)
}

export function listAllCases() {
  return db
    .prepare(`SELECT * FROM case_studies ORDER BY position ASC, COALESCE(published_at, created_at) DESC`)
    .all()
    .map(hydrate)
}

export function getCaseBySlug(slug, { includeDrafts = false } = {}) {
  const sql = includeDrafts
    ? `SELECT * FROM case_studies WHERE slug = ?`
    : `SELECT * FROM case_studies WHERE slug = ? AND status='published'`
  return hydrate(db.prepare(sql).get(slug))
}

export function getCaseById(id) {
  return hydrate(db.prepare(`SELECT * FROM case_studies WHERE id = ?`).get(id))
}

export function relatedCases(slug, limit = 2) {
  return db
    .prepare(
      `SELECT * FROM case_studies WHERE status='published' AND slug <> ?
       ORDER BY position ASC LIMIT ?`,
    )
    .all(slug, limit)
    .map(hydrate)
}

/* --------------------------------------------------------------- writes --- */

const FIELDS = ['title', 'client', 'industry', 'summary', 'body', 'metrics', 'cover_image', 'accent', 'status', 'position']

function normalise(input, { existing = null } = {}) {
  const out = {}
  for (const f of FIELDS) {
    if (input[f] !== undefined) out[f] = input[f]
    else if (existing) out[f] = existing[f]
  }

  out.title = String(out.title ?? '').trim()
  out.client = String(out.client ?? '').trim()
  out.industry = String(out.industry ?? '').trim()
  out.summary = String(out.summary ?? '').trim()
  out.body = String(out.body ?? '')
  out.cover_image = out.cover_image ? String(out.cover_image).trim() : null
  out.status = out.status === 'published' ? 'published' : 'draft'
  out.position = Number.isFinite(Number(out.position)) ? Number(out.position) : 0

  // Only allow a hex colour through — this value is interpolated into a style
  // attribute, so anything else is an injection surface.
  const accent = String(out.accent ?? '').trim()
  out.accent = /^#[0-9a-fA-F]{6}$/.test(accent) ? accent : '#FF6B1A'

  /* Metrics arrive either as an array (API) or as parallel form fields
     flattened into "figure|caption" lines (admin form). Normalise both. */
  let metrics = out.metrics
  if (typeof metrics === 'string') {
    metrics = metrics
      .split('\n')
      .map((line) => {
        const [figure, ...rest] = line.split('|')
        return { figure: (figure ?? '').trim(), caption: rest.join('|').trim() }
      })
      .filter((m) => m.figure || m.caption)
  }
  if (!Array.isArray(metrics)) metrics = []
  out.metrics = JSON.stringify(
    metrics
      .slice(0, 4) // the card layout holds three comfortably, four at a squeeze
      .map((m) => ({ figure: String(m.figure ?? '').trim(), caption: String(m.caption ?? '').trim() }))
      .filter((m) => m.figure || m.caption),
  )

  return out
}

export function validateCase(v) {
  const errors = {}
  if (!v.title || v.title.length < 3) errors.title = 'Title needs at least 3 characters.'
  if (!v.client) errors.client = 'Client is required. It is the kicker on the card.'
  if (!v.summary) errors.summary = 'A summary is required; it is the card copy and the meta description.'
  if (v.summary && v.summary.length > 320) errors.summary = 'Keep the summary under 320 characters.'
  return errors
}

export function createCase(input) {
  const v = normalise(input)
  const errors = validateCase(v)
  if (Object.keys(errors).length) return { errors }

  const slug = uniqueSlug(input.slug || v.title)
  const publishedAt = v.status === 'published' ? new Date().toISOString() : null

  const info = db
    .prepare(
      `INSERT INTO case_studies (slug, title, client, industry, summary, body, metrics, cover_image, accent, status, position, published_at)
       VALUES (@slug, @title, @client, @industry, @summary, @body, @metrics, @cover_image, @accent, @status, @position, @published_at)`,
    )
    .run({ ...v, slug, published_at: publishedAt })

  return { item: getCaseById(info.lastInsertRowid) }
}

export function updateCase(id, input) {
  const existing = getCaseById(id)
  if (!existing) return { errors: { id: 'No case study with that id.' } }

  const v = normalise(input, { existing: { ...existing, metrics: JSON.stringify(existing.metrics) } })
  const errors = validateCase(v)
  if (Object.keys(errors).length) return { errors }

  const slug = input.slug ? uniqueSlug(input.slug, id) : existing.slug
  const publishedAt = v.status === 'published' ? existing.published_at || new Date().toISOString() : null

  db.prepare(
    `UPDATE case_studies SET slug=@slug, title=@title, client=@client, industry=@industry,
       summary=@summary, body=@body, metrics=@metrics, cover_image=@cover_image, accent=@accent,
       status=@status, position=@position, published_at=@published_at, updated_at=datetime('now')
     WHERE id=@id`,
  ).run({ ...v, slug, published_at: publishedAt, id })

  return { item: getCaseById(id) }
}

export function deleteCase(id) {
  return db.prepare(`DELETE FROM case_studies WHERE id = ?`).run(id).changes > 0
}
