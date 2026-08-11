import 'server-only'
import { verifyApiToken } from './auth'

/* Shared helpers for the automation API. */

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Never let a CDN or browser cache an authenticated API response.
      'Cache-Control': 'no-store',
    },
  })

/** Returns a Response to short-circuit with, or null when authorised. */
export function guard(request) {
  if (!process.env.API_TOKEN) {
    return json({ error: 'API disabled: API_TOKEN is not configured on the server.' }, 503)
  }
  if (!verifyApiToken(request.headers.get('authorization'))) {
    return json({ error: 'Unauthorised. Send: Authorization: Bearer <API_TOKEN>' }, 401)
  }
  return null
}

/** Strips internal columns and returns the tags array rather than JSON text. */
export const shape = (p) =>
  p && {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    body: p.body,
    category: p.category,
    tags: p.tags,
    cover_image: p.cover_image,
    author: p.author,
    status: p.status,
    published_at: p.published_at,
    created_at: p.created_at,
    updated_at: p.updated_at,
    url: `/blog/${p.slug}`,
  }
