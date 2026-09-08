import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HttpClient } from '../src/core/http.js'
import { AuthError, NotFoundError, ValidationError, RateLimitError, TransportError } from '../src/core/errors.js'
import { redact, redactHeaders, redactUrl } from '../src/core/redact.js'

const res = (status, body, headers = {}) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })

const client = (fetchImpl, opts = {}) =>
  new HttpClient({ baseUrl: 'https://x.test/api', connector: 'test', fetch: fetchImpl, backoff: 1, ...opts })

test('GET retries a 500 and then succeeds', async () => {
  let n = 0
  const c = client(async () => (++n < 3 ? res(500, { error: 'boom' }) : res(200, { ok: true })))
  assert.deepEqual(await c.get('/thing'), { ok: true })
  assert.equal(n, 3)
})

test('GET gives up after the retry budget and throws the mapped error', async () => {
  let n = 0
  const c = client(async () => { n++; return res(503, { error: 'down' }) }, { retries: 2 })
  await assert.rejects(() => c.get('/thing'), (e) => e instanceof TransportError && e.status === 503)
  assert.equal(n, 3, 'initial attempt plus two retries')
})

test('POST is not retried, because replaying it could create two records', async () => {
  let n = 0
  const c = client(async () => { n++; return res(500, { error: 'boom' }) })
  await assert.rejects(() => c.post('/incident', { body: { x: 1 } }))
  assert.equal(n, 1)
})

test('POST retries when the caller declares it idempotent', async () => {
  let n = 0
  const c = client(async () => (++n < 2 ? res(500, {}) : res(200, { ok: 1 })))
  assert.deepEqual(await c.post('/search', { body: {}, idempotent: true }), { ok: 1 })
  assert.equal(n, 2)
})

test('Retry-After is honoured rather than guessed', async () => {
  let n = 0
  const started = Date.now()
  const c = client(async () => (++n < 2 ? res(429, { error: 'slow' }, { 'retry-after': '0.05' }) : res(200, { ok: 1 })))
  await c.get('/thing')
  assert.ok(Date.now() - started >= 45, 'waited roughly the advertised interval')
})

test('statuses map onto the taxonomy', async () => {
  for (const [status, Klass] of [[401, AuthError], [404, NotFoundError], [422, ValidationError]]) {
    const c = client(async () => res(status, { error: { message: 'no' } }), { retries: 0 })
    await assert.rejects(() => c.get('/x'), (e) => e instanceof Klass)
  }
})

test('a 429 on a non-retryable verb still surfaces as RateLimitError', async () => {
  const c = client(async () => res(429, {}, { 'retry-after': '1' }))
  await assert.rejects(() => c.post('/x', { body: {} }), (e) => e instanceof RateLimitError && e.retryAfter === 1)
})

test('timeouts abort and surface as TransportError', async () => {
  const c = client((_u, init) => new Promise((_, rej) => {
    init.signal.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), { name: 'AbortError' })))
  }), { timeout: 30, retries: 0 })
  await assert.rejects(() => c.get('/slow'), (e) => e instanceof TransportError && /timed out/.test(e.message))
})

test('query building handles arrays, skips null, and preserves the base path', async () => {
  const c = client(async () => res(200, {}))
  assert.equal(c.url('/things', { a: 1, b: null, c: ['x', 'y'] }), 'https://x.test/api/things?a=1&c=x&c=y')
  assert.equal(c.url('https://other.test/z'), 'https://other.test/z')
})

test('204 becomes null rather than a parse error', async () => {
  const c = client(async () => new Response(null, { status: 204 }))
  assert.equal(await c.delete('/thing/1'), null)
})

test('secrets never survive redaction', () => {
  assert.equal(redactHeaders({ Authorization: 'Bearer abc' }).Authorization, '[redacted]')
  assert.equal(redactHeaders({ 'X-Ops-Authorization-3': 'sig' })['X-Ops-Authorization-3'], '[redacted]')
  assert.equal(redact({ user: 'a', password: 'p', nested: { api_key: 'k' } }).nested.api_key, '[redacted]')
  assert.equal(redact({ user: 'a', password: 'p' }).user, 'a', 'non-secrets are left alone')
  const scrubbed = redactUrl('https://u:p@x.test/a?access_token=zzz&q=1')
  assert.match(scrubbed, /REDACTED/)
  assert.equal(scrubbed.includes('zzz'), false, 'the token itself is gone')
  assert.equal(scrubbed.includes('%5B'), false, 'and the marker is readable in a log')
  assert.match(redactUrl('https://x.test/a?q=1'), /q=1/)
})

test('the error thrown on failure carries no credential', async () => {
  const c = client(async () => res(400, { error: { message: 'bad', password: 'hunter2' } }), { retries: 0 })
  await assert.rejects(() => c.get('/x'), (e) => {
    assert.equal(JSON.stringify(e.detail).includes('hunter2'), false)
    return true
  })
})
