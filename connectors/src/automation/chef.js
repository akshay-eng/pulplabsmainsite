import crypto from 'node:crypto'
import { HttpClient } from '../core/http.js'
import { ValidationError } from '../core/errors.js'

/* Chef Infra Server.
 *
 * The odd one out. Every other connector here sends a token in a header; Chef
 * signs each request with an RSA private key and splits the signature across
 * numbered X-Ops-Authorization-N headers. Get any part of the canonical string
 * wrong and the server returns a flat 401 with no hint as to which part, so
 * the format is spelled out below rather than left to be inferred.
 *
 * Canonical request, newline separated, no trailing newline:
 *
 *   Method:{VERB}
 *   Hashed Path:{base64(digest(canonical_path))}
 *   X-Ops-Content-Hash:{base64(digest(body))}
 *   X-Ops-Timestamp:{ISO8601 with Z}
 *   X-Ops-UserId:{client name}
 *
 * Two signing versions are in the wild:
 *   1.0 — SHA1 digests, signature is a raw RSA private encrypt of the string
 *   1.3 — SHA256 digests, signature is a normal RSA-SHA256 signature
 * 1.3 is the default here. 1.0 exists for older servers and is why the digest
 * and signing steps are parameterised rather than hard-coded.
 *
 * The path is canonicalised (collapse duplicate slashes, drop a trailing one)
 * because the server hashes ITS normalised form, and "/nodes/" vs "/nodes"
 * otherwise produces a signature mismatch that looks like a bad key.
 *
 * NOTE: verified here by round-tripping the signature against the public key,
 * which proves the construction is mechanically sound. It has NOT yet been run
 * against a live Chef Infra Server.
 */

const VERSIONS = {
  '1.0': { digest: 'sha1', sign: 'raw' },
  '1.3': { digest: 'sha256', sign: 'rsa-sha256' },
}

const b64 = (buf) => Buffer.from(buf).toString('base64')
const hash = (algo, data) => b64(crypto.createHash(algo).update(data ?? '').digest())

export function canonicalPath(pathname) {
  const collapsed = String(pathname).replace(/\/+/g, '/')
  return collapsed.length > 1 ? collapsed.replace(/\/$/, '') : collapsed
}

/** Exported so the signing can be unit-tested without a server. */
export function signRequest({ method, path, body = '', userId, key, version = '1.3', timestamp }) {
  const spec = VERSIONS[version]
  if (!spec) throw new ValidationError(`chef: unknown signing version ${version}`, { connector: 'chef' })

  const ts = timestamp ?? new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  const contentHash = hash(spec.digest, body)
  const canonical = [
    `Method:${method.toUpperCase()}`,
    `Hashed Path:${hash(spec.digest, canonicalPath(path))}`,
    `X-Ops-Content-Hash:${contentHash}`,
    `X-Ops-Timestamp:${ts}`,
    `X-Ops-UserId:${userId}`,
  ].join('\n')

  const signature =
    spec.sign === 'raw'
      /* 1.0 encrypts the canonical string directly with the private key. It
         fits inside a 2048-bit modulus; a shorter key will throw here, which
         is the correct outcome rather than a mystery 401 later. */
      ? crypto.privateEncrypt({ key, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(canonical))
      : crypto.sign('sha256', Buffer.from(canonical), { key, padding: crypto.constants.RSA_PKCS1_PADDING })

  const headers = {
    'x-ops-sign': `algorithm=${spec.digest};version=${version}`,
    'x-ops-userid': userId,
    'x-ops-timestamp': ts,
    'x-ops-content-hash': contentHash,
    'x-chef-version': '18.0.0',
    accept: 'application/json',
  }
  /* The signature is base64 then split into 60-character chunks, one per
     numbered header, starting at 1. */
  const chunks = b64(signature).match(/.{1,60}/g) ?? []
  chunks.forEach((c, i) => { headers[`x-ops-authorization-${i + 1}`] = c })
  return { headers, canonical }
}

export class Chef {
  /**
   * @param {object} cfg
   * @param {string} cfg.serverUrl  https://chef.example.com
   * @param {string} cfg.org        organisation short name
   * @param {string} cfg.clientName the user or client the key belongs to
   * @param {string} cfg.key        PEM private key
   * @param {'1.0'|'1.3'} [cfg.signingVersion]
   */
  constructor(cfg) {
    for (const f of ['serverUrl', 'org', 'clientName', 'key']) {
      if (!cfg?.[f]) throw new ValidationError(`chef: ${f} is required`, { connector: 'chef' })
    }
    this.cfg = cfg
    this.base = `${String(cfg.serverUrl).replace(/\/+$/, '')}/organizations/${cfg.org}`
    this.http = new HttpClient({
      baseUrl: this.base,
      connector: 'chef',
      fetch: cfg.fetch,
      timeout: cfg.timeout,
    })
    /* Signing needs the method, the exact path and the body, none of which the
       generic authHeaders hook can see. So requests go through #call, which
       signs and then hands fully-formed headers to the client. */
  }

  async #call(method, path, body) {
    const url = this.http.url(path)
    const payload = body === undefined ? '' : JSON.stringify(body)
    const { headers } = signRequest({
      method,
      path: new URL(url).pathname,
      body: payload,
      userId: this.cfg.clientName,
      key: this.cfg.key,
      version: this.cfg.signingVersion ?? '1.3',
    })
    return this.http.request(method, url, {
      headers,
      body: body === undefined ? undefined : payload,
      idempotent: method === 'GET',
    })
  }

  async ping() {
    const r = await this.#call('GET', '/nodes')
    return { ok: true, org: this.cfg.org, nodes: Object.keys(r ?? {}).length }
  }

  /* Chef returns objects keyed by name rather than arrays, and does not page.
     Callers get the names; fetching each is a second call by design. */
  #collection(kind) {
    return {
      list: () => this.#call('GET', `/${kind}`),
      names: async () => Object.keys((await this.#call('GET', `/${kind}`)) ?? {}),
      get: (name) => this.#call('GET', `/${kind}/${encodeURIComponent(name)}`),
      create: (body) => this.#call('POST', `/${kind}`, body),
      update: (name, body) => this.#call('PUT', `/${kind}/${encodeURIComponent(name)}`, body),
      delete: async (name) => { await this.#call('DELETE', `/${kind}/${encodeURIComponent(name)}`); return true },
    }
  }

  get nodes() { return this.#collection('nodes') }
  get roles() { return this.#collection('roles') }
  get environments() { return this.#collection('environments') }
  get clients() { return this.#collection('clients') }
  get dataBags() { return this.#collection('data') }
  get cookbooks() { return this.#collection('cookbooks') }

  dataBagItem(bag, id) {
    const p = `/data/${encodeURIComponent(bag)}/${encodeURIComponent(id)}`
    return {
      get: () => this.#call('GET', p),
      update: (body) => this.#call('PUT', p, body),
      delete: async () => { await this.#call('DELETE', p); return true },
    }
  }

  /**
   * Solr-style search over any index: node, role, client, environment, or a
   * data bag name.
   * @param {string} index
   * @param {string} q e.g. 'chef_environment:production AND platform:ubuntu'
   */
  async search(index, q = '*:*', { rows = 1000, start = 0 } = {}) {
    const qs = new URLSearchParams({ q, rows: String(rows), start: String(start) })
    return this.#call('GET', `/search/${encodeURIComponent(index)}?${qs}`)
  }

  /** Walks the whole result set, since Chef caps a single search at `rows`. */
  async *searchAll(index, q = '*:*', { rows = 1000 } = {}) {
    let start = 0
    for (;;) {
      const page = await this.search(index, q, { rows, start })
      const items = page?.rows ?? []
      for (const item of items) yield item
      start += rows
      if (start >= (page?.total ?? 0) || items.length === 0) return
    }
  }
}

export default Chef
