import 'server-only'
import GithubSlugger from 'github-slugger'
import { db } from './db'

/* ==========================================================================
   Post queries. Every function returns plain objects with `tags` already
   parsed, so callers never touch the JSON encoding.
   ========================================================================== */

const hydrate = (row) => {
  if (!row) return null
  let tags = []
  try {
    tags = JSON.parse(row.tags || '[]')
  } catch {
    tags = [] // a hand-edited row shouldn't take the page down
  }
  return { ...row, tags: Array.isArray(tags) ? tags : [] }
}

export function slugify(title) {
  return new GithubSlugger().slug(title)
}

/** Appends -2, -3 … until the slug is free. `ignoreId` lets an edit keep its own slug. */
export function uniqueSlug(title, ignoreId = null) {
  const base = slugify(title) || 'post'
  const taken = db
    .prepare(`SELECT slug FROM posts WHERE slug LIKE ? AND id IS NOT ?`)
    .all(`${base}%`, ignoreId)
    .map((r) => r.slug)

  if (!taken.includes(base)) return base
  let n = 2
  while (taken.includes(`${base}-${n}`)) n++
  return `${base}-${n}`
}

/* ---------------------------------------------------------------- reads --- */

export function listPublished({ limit = 50, offset = 0, category, tag } = {}) {
  const where = [`status = 'published'`, `published_at IS NOT NULL`]
  const params = {}

  if (category) {
    where.push('category = @category')
    params.category = category
  }
  if (tag) {
    // json_each expands the tags array so a tag filter needs no join table
    where.push(`EXISTS (SELECT 1 FROM json_each(posts.tags) WHERE json_each.value = @tag)`)
    params.tag = tag
  }

  return db
    .prepare(
      `SELECT * FROM posts WHERE ${where.join(' AND ')}
       ORDER BY published_at DESC LIMIT @limit OFFSET @offset`,
    )
    .all({ ...params, limit, offset })
    .map(hydrate)
}

export function listAll() {
  return db.prepare(`SELECT * FROM posts ORDER BY COALESCE(published_at, created_at) DESC`).all().map(hydrate)
}

export function getBySlug(slug, { includeDrafts = false } = {}) {
  const sql = includeDrafts
    ? `SELECT * FROM posts WHERE slug = ?`
    : `SELECT * FROM posts WHERE slug = ? AND status = 'published'`
  return hydrate(db.prepare(sql).get(slug))
}

export function getById(id) {
  return hydrate(db.prepare(`SELECT * FROM posts WHERE id = ?`).get(id))
}

export function countPublished() {
  return db.prepare(`SELECT COUNT(*) AS n FROM posts WHERE status = 'published'`).get().n
}

export function allCategories() {
  return db
    .prepare(`SELECT category, COUNT(*) AS n FROM posts
              WHERE status='published' AND category <> '' GROUP BY category ORDER BY n DESC`)
    .all()
}

export function allTags() {
  return db
    .prepare(`SELECT json_each.value AS tag, COUNT(*) AS n
              FROM posts, json_each(posts.tags)
              WHERE posts.status = 'published'
              GROUP BY tag ORDER BY n DESC`)
    .all()
}

/** Newest published posts excluding one — used for "read next". */
export function relatedPosts(slug, limit = 3) {
  return db
    .prepare(
      `SELECT * FROM posts WHERE status='published' AND slug <> ?
       ORDER BY published_at DESC LIMIT ?`,
    )
    .all(slug, limit)
    .map(hydrate)
}

/* --------------------------------------------------------------- writes --- */

const FIELDS = ['title', 'description', 'body', 'category', 'tags', 'cover_image', 'author', 'status']

/** Normalises loose input (from the form or the API) into column values. */
function normalise(input, { existing = null } = {}) {
  const out = {}
  for (const f of FIELDS) {
    if (input[f] !== undefined) out[f] = input[f]
    else if (existing) out[f] = existing[f]
  }

  out.title = String(out.title ?? '').trim()
  out.description = String(out.description ?? '').trim()
  out.body = String(out.body ?? '')
  out.category = String(out.category ?? '').trim()
  out.author = String(out.author || 'PulpLabs').trim()
  out.cover_image = out.cover_image ? String(out.cover_image).trim() : null
  out.status = out.status === 'published' ? 'published' : 'draft'

  // Accept an array or a comma-separated string; store JSON either way.
  const raw = out.tags
  const arr = Array.isArray(raw)
    ? raw
    : String(raw ?? '')
        .replace(/^\[|\]$/g, '')
        .split(',')
  out.tags = JSON.stringify(
    [...new Set(arr.map((t) => String(t).trim().replace(/^["']|["']$/g, '')).filter(Boolean))],
  )

  return out
}

export function validate(v) {
  const errors = {}
  if (!v.title || v.title.length < 3) errors.title = 'Title needs at least 3 characters.'
  if (v.title && v.title.length > 200) errors.title = 'Title is capped at 200 characters.'
  if (!v.description) errors.description = 'A description is required. It is the meta description and the card excerpt.'
  if (v.description && v.description.length > 300) errors.description = 'Keep the description under 300 characters.'
  if (!v.body || v.body.trim().length < 10) errors.body = 'The post body is empty.'
  return errors
}

export function createPost(input) {
  const v = normalise(input)
  const errors = validate(v)
  if (Object.keys(errors).length) return { errors }

  const slug = input.slug ? uniqueSlug(input.slug) : uniqueSlug(v.title)
  // published_at is stamped once, when it first goes live, so re-editing a
  // published post doesn't reorder the feed.
  const publishedAt = v.status === 'published' ? new Date().toISOString() : null

  const info = db
    .prepare(
      `INSERT INTO posts (slug, title, description, body, category, tags, cover_image, author, status, published_at)
       VALUES (@slug, @title, @description, @body, @category, @tags, @cover_image, @author, @status, @published_at)`,
    )
    .run({ ...v, slug, published_at: publishedAt })

  return { post: getById(info.lastInsertRowid) }
}

export function updatePost(id, input) {
  const existing = getById(id)
  if (!existing) return { errors: { id: 'No post with that id.' } }

  const v = normalise(input, { existing: { ...existing, tags: JSON.stringify(existing.tags) } })
  const errors = validate(v)
  if (Object.keys(errors).length) return { errors }

  const slug = input.slug ? uniqueSlug(input.slug, id) : existing.slug
  const publishedAt =
    v.status === 'published' ? existing.published_at || new Date().toISOString() : null

  db.prepare(
    `UPDATE posts SET slug=@slug, title=@title, description=@description, body=@body,
       category=@category, tags=@tags, cover_image=@cover_image, author=@author,
       status=@status, published_at=@published_at, updated_at=datetime('now')
     WHERE id=@id`,
  ).run({ ...v, slug, published_at: publishedAt, id })

  return { post: getById(id) }
}

export function deletePost(id) {
  return db.prepare(`DELETE FROM posts WHERE id = ?`).run(id).changes > 0
}
