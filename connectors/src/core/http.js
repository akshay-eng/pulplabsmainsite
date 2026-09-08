import { fromStatus, TransportError, RateLimitError, ConnectorError } from './errors.js'
import { redact, redactHeaders, redactUrl } from './redact.js'

/* The one HTTP path every connector goes through.
 *
 * Everything awkward about talking to someone else's API lives here so that six
 * connectors do not each get it slightly wrong: timeouts that actually abort,
 * retry with jittered backoff, Retry-After honoured rather than guessed,
 * secrets stripped from anything that escapes, and provider errors mapped onto
 * one taxonomy.
 */

const DEFAULTS = {
  timeout: 30_000,
  retries: 3,
  /* Base for exponential backoff. Full jitter on top: without it, a fleet of
     workers that all got 429 at the same moment retry in lockstep and rate
     limit themselves again at exactly the same instant. */
  backoff: 400,
  maxBackoff: 20_000,
  userAgent: 'pulplabs-connectors/0.1',
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* Retry-After is either seconds or an HTTP date; both are in the wild. */
function retryAfterSeconds(headers) {
  const raw = headers?.get?.('retry-after')
  if (!raw) return null
  const secs = Number(raw)
  if (Number.isFinite(secs)) return Math.max(0, secs)
  const when = Date.parse(raw)
  return Number.isNaN(when) ? null : Math.max(0, (when - Date.now()) / 1000)
}

export class HttpClient {
  /**
   * @param {object} opts
   * @param {string} opts.baseUrl
   * @param {string} opts.connector           name, used in errors
   * @param {() => Promise<object>|object} [opts.authHeaders]
   *        Called per attempt rather than once, so a connector holding a
   *        short-lived token can refresh without the client knowing.
   * @param {typeof fetch} [opts.fetch]       injectable for tests
   */
  constructor(opts) {
    this.baseUrl = String(opts.baseUrl).replace(/\/+$/, '')
    this.connector = opts.connector ?? 'connector'
    this.authHeaders = opts.authHeaders ?? (() => ({}))
    this.fetch = opts.fetch ?? globalThis.fetch
    this.cfg = { ...DEFAULTS, ...opts }
  }

  url(path, query) {
    const u = new URL(
      String(path).startsWith('http') ? String(path) : this.baseUrl + '/' + String(path).replace(/^\/+/, ''),
    )
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v === undefined || v === null) continue
      if (Array.isArray(v)) v.forEach((x) => u.searchParams.append(k, String(x)))
      else u.searchParams.set(k, String(v))
    }
    return u.toString()
  }

  async request(method, path, { query, body, headers, raw, timeout, retries, idempotent } = {}) {
    const url = this.url(path, query)
    /* Retrying a POST can create two incidents. Only methods that are
       idempotent by definition retry automatically; a caller who knows their
       POST is safe can opt in explicitly. */
    const canRetry = idempotent ?? ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'].includes(method)
    const attempts = canRetry ? (retries ?? this.cfg.retries) : 0
    let last

    for (let attempt = 0; attempt <= attempts; attempt++) {
      const ac = new AbortController()
      const timer = setTimeout(() => ac.abort(), timeout ?? this.cfg.timeout)
      try {
        const auth = await this.authHeaders()
        const isForm = body instanceof FormData
        const res = await this.fetch(url, {
          method,
          signal: ac.signal,
          headers: {
            accept: 'application/json',
            'user-agent': this.cfg.userAgent,
            ...(body !== undefined && !isForm ? { 'content-type': 'application/json' } : {}),
            ...auth,
            ...headers,
          },
          body: body === undefined ? undefined : isForm || typeof body === 'string' ? body : JSON.stringify(body),
        })

        if (res.ok) return raw ? res : await this.#parse(res)

        const detail = await this.#safeBody(res)
        const err = fromStatus(res.status, this.#message(res, detail), {
          connector: this.connector,
          detail: redact(detail),
          code: detail?.error?.code ?? detail?.code,
          retryAfter: retryAfterSeconds(res.headers) ?? undefined,
        })
        /* A 429 with Retry-After is worth waiting out even on a POST: the
           request never reached the business logic, so replaying it is safe. */
        if (!err.retryable || attempt === attempts) {
          if (err instanceof RateLimitError && !canRetry && attempt === 0 && attempts === 0) throw err
          throw err
        }
        last = err
        await sleep(this.#delay(attempt, err.retryAfter))
      } catch (e) {
        if (e instanceof ConnectorError) {
          if (!e.retryable || attempt === attempts) throw e
          last = e
          await sleep(this.#delay(attempt, e.retryAfter))
        } else {
          const wrapped = new TransportError(
            e?.name === 'AbortError'
              ? `${method} ${redactUrl(url)} timed out`
              : `${method} ${redactUrl(url)} failed: ${e?.message ?? e}`,
            { connector: this.connector, cause: e },
          )
          if (attempt === attempts) throw wrapped
          last = wrapped
          await sleep(this.#delay(attempt))
        }
      } finally {
        clearTimeout(timer)
      }
    }
    throw last
  }

  #delay(attempt, retryAfter) {
    if (retryAfter != null) return Math.min(retryAfter * 1000, this.cfg.maxBackoff)
    const ceiling = Math.min(this.cfg.backoff * 2 ** attempt, this.cfg.maxBackoff)
    return Math.random() * ceiling // full jitter
  }

  #message(res, detail) {
    const provider =
      detail?.error?.message ?? detail?.error ?? detail?.message ?? detail?.detail ?? detail?.error_description
    const text = typeof provider === 'string' ? provider : provider ? JSON.stringify(redact(provider)) : ''
    return `${this.connector}: ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`
  }

  async #parse(res) {
    if (res.status === 204) return null
    const type = res.headers.get('content-type') ?? ''
    if (type.includes('json')) return res.json()
    if (type.startsWith('text/')) return res.text()
    return res.arrayBuffer()
  }

  async #safeBody(res) {
    try {
      const type = res.headers.get('content-type') ?? ''
      return type.includes('json') ? await res.json() : (await res.text()).slice(0, 2000)
    } catch {
      return null
    }
  }

  get(path, opts) { return this.request('GET', path, opts) }
  post(path, opts) { return this.request('POST', path, opts) }
  put(path, opts) { return this.request('PUT', path, opts) }
  patch(path, opts) { return this.request('PATCH', path, opts) }
  delete(path, opts) { return this.request('DELETE', path, opts) }
}

export { redact, redactHeaders, redactUrl }
