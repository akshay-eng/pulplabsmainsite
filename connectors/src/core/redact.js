/* Keep secrets out of logs, errors and thrown payloads.
 *
 * This exists because the natural thing to do when a request fails is attach
 * the request to the error, and the request carries the Authorization header.
 * That error then gets logged, shipped to an aggregator, and the credential is
 * now in three places nobody is watching.
 */

const SECRET_HEADERS = new Set([
  'authorization', 'x-ops-authorization-1', 'cookie', 'set-cookie',
  'x-api-key', 'api-key', 'x-auth-token', 'proxy-authorization',
])

/* Field names whose values are secrets whatever the casing or nesting. */
const SECRET_KEYS = /^(pass(word)?|secret|token|api[_-]?key|client[_-]?secret|private[_-]?key|refresh[_-]?token|access[_-]?token|credential)s?$/i

export function redactHeaders(headers) {
  const out = {}
  const entries = headers instanceof Headers ? [...headers.entries()] : Object.entries(headers ?? {})
  for (const [k, v] of entries) {
    const key = String(k).toLowerCase()
    /* X-Ops-Authorization-N is a numbered series, so it needs a prefix test
       rather than set membership. */
    out[k] = SECRET_HEADERS.has(key) || key.startsWith('x-ops-authorization')
      ? '[redacted]'
      : v
  }
  return out
}

export function redact(value, depth = 0) {
  if (depth > 6 || value == null) return value
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1))
  if (typeof value !== 'object') return value
  const out = {}
  for (const [k, v] of Object.entries(value)) {
    out[k] = SECRET_KEYS.test(k) ? '[redacted]' : redact(v, depth + 1)
  }
  return out
}

/* Strips userinfo and query values that look like secrets. A URL with
   ?access_token=... in it is otherwise logged intact.
 *
 * The marker here is bare REDACTED rather than the bracketed form used
 * elsewhere: URL serialisation percent-encodes brackets, so `[redacted]` comes
 * back out as `%5Bredacted%5D` and a human skimming a log has to decode it. */
export function redactUrl(url) {
  try {
    const u = new URL(String(url))
    if (u.username || u.password) { u.username = 'REDACTED'; u.password = '' }
    for (const k of [...u.searchParams.keys()]) {
      if (SECRET_KEYS.test(k)) u.searchParams.set(k, 'REDACTED')
    }
    return u.toString()
  } catch {
    return String(url)
  }
}
