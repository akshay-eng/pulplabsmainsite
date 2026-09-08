import { HttpClient } from '../core/http.js'
import { paginate, collect } from '../core/paginate.js'
import { ValidationError, AuthError } from '../core/errors.js'

/* SharePoint and OneDrive, through Microsoft Graph.
 *
 * App-only (client credentials) by default, because a connector runs
 * unattended and there is nobody to complete an interactive sign-in. That
 * needs an app registration with APPLICATION permissions granted admin
 * consent: Sites.Read.All or Sites.ReadWrite.All, and Files.Read.All or
 * Files.ReadWrite.All. Delegated permissions of the same name will authorise
 * and then 403 on every call, which is a confusing hour if you have not hit it
 * before.
 *
 * Tokens last about an hour. They are cached and refreshed 60 seconds early:
 * refreshing exactly at expiry loses a race against clock skew and produces
 * intermittent 401s that look like a broken secret.
 */
const GRAPH = 'https://graph.microsoft.com/v1.0'
const SKEW_MS = 60_000
/* Graph's own guidance: anything over 4MB must use an upload session. */
const SIMPLE_UPLOAD_MAX = 4 * 1024 * 1024

export class SharePoint {
  /**
   * @param {object} cfg
   * @param {string} cfg.tenantId
   * @param {string} cfg.clientId
   * @param {string} cfg.clientSecret
   * @param {string} [cfg.accessToken] use a token you already hold instead
   */
  constructor(cfg) {
    const hasApp = cfg?.tenantId && cfg?.clientId && cfg?.clientSecret
    if (!hasApp && !cfg?.accessToken) {
      throw new ValidationError(
        'sharepoint: needs tenantId + clientId + clientSecret, or an accessToken',
        { connector: 'sharepoint' },
      )
    }
    this.cfg = cfg
    this.token = cfg.accessToken ? { value: cfg.accessToken, expires: Infinity } : null
    this.fetch = cfg.fetch ?? globalThis.fetch

    this.http = new HttpClient({
      baseUrl: GRAPH,
      connector: 'sharepoint',
      fetch: cfg.fetch,
      timeout: cfg.timeout,
      authHeaders: async () => ({ authorization: `Bearer ${await this.#accessToken()}` }),
    })
  }

  async #accessToken() {
    if (this.token && Date.now() < this.token.expires - SKEW_MS) return this.token.value
    const { tenantId, clientId, clientSecret } = this.cfg
    const url = `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`
    const res = await this.fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
        /* .default asks for exactly the application permissions already
           consented to. Naming individual scopes here fails for app-only. */
        scope: 'https://graph.microsoft.com/.default',
      }),
    })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.access_token) {
      throw new AuthError(`sharepoint: token request failed (${res.status})`, {
        connector: 'sharepoint',
        status: res.status,
        code: json?.error,
        detail: json?.error_description,
      })
    }
    this.token = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 }
    return this.token.value
  }

  async ping() {
    const r = await this.http.get('sites', { query: { search: '*', $top: 1 } })
    return { ok: true, sites: (r?.value ?? []).length }
  }

  /* Graph pages with an opaque @odata.nextLink, followed verbatim. */
  #odata(path, query) {
    return (opts = {}) =>
      paginate(
        async (next) => {
          const r = next ? await this.http.get(next) : await this.http.get(path, { query: { ...query, ...opts.query } })
          return { items: r?.value ?? [], next: r?.['@odata.nextLink'] ?? null }
        },
        { limit: opts.limit ?? Infinity },
      )
  }

  /* ---- sites and drives ---- */
  sites(search = '*', opts = {}) { return this.#odata('sites', { search })(opts) }
  async allSites(search, opts) { return collect(this.sites(search, opts)) }
  getSite(siteId) { return this.http.get(`sites/${siteId}`) }
  /** @param {string} hostname e.g. contoso.sharepoint.com @param {string} path e.g. /sites/Ops */
  getSiteByPath(hostname, path) { return this.http.get(`sites/${hostname}:${path}`) }
  drives(siteId, opts = {}) { return this.#odata(`sites/${siteId}/drives`, {})(opts) }
  async allDrives(siteId, opts) { return collect(this.drives(siteId, opts)) }

  /* ---- drive items ---- */
  children(driveId, itemId = 'root', opts = {}) {
    const path = itemId === 'root' ? `drives/${driveId}/root/children` : `drives/${driveId}/items/${itemId}/children`
    return this.#odata(path, {})(opts)
  }
  async allChildren(driveId, itemId, opts) { return collect(this.children(driveId, itemId, opts)) }

  getItem(driveId, itemId) { return this.http.get(`drives/${driveId}/items/${itemId}`) }
  /** @param {string} path relative to the drive root, e.g. /Runbooks/incident.docx */
  getItemByPath(driveId, path) { return this.http.get(`drives/${driveId}/root:${path}`) }

  search(driveId, q, opts = {}) {
    /* The search text is a function argument in the OData path, so a quote in
       it terminates the call early. Single quotes double to escape. */
    const safe = String(q).replace(/'/g, "''")
    return this.#odata(`drives/${driveId}/root/search(q='${encodeURIComponent(safe)}')`, {})(opts)
  }
  async searchAll(driveId, q, opts) { return collect(this.search(driveId, q, opts)) }

  /** @returns {Promise<ArrayBuffer>} */
  async download(driveId, itemId) {
    const res = await this.http.get(`drives/${driveId}/items/${itemId}/content`, { raw: true, headers: { accept: '*/*' } })
    return res.arrayBuffer()
  }

  /**
   * Uploads, choosing the mechanism by size. Under 4MB goes in one PUT; over
   * that, Graph rejects it and an upload session is required.
   */
  async upload(driveId, path, data, { contentType = 'application/octet-stream', conflict = 'replace' } = {}) {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data
    if (bytes.byteLength <= SIMPLE_UPLOAD_MAX) {
      return this.http.put(`drives/${driveId}/root:${path}:/content`, {
        query: { '@microsoft.graph.conflictBehavior': conflict },
        headers: { 'content-type': contentType },
        body: Buffer.from(bytes),
      })
    }
    return this.#uploadSession(driveId, path, bytes, conflict)
  }

  async #uploadSession(driveId, path, bytes, conflict) {
    const session = await this.http.post(`drives/${driveId}/root:${path}:/createUploadSession`, {
      body: { item: { '@microsoft.graph.conflictBehavior': conflict } },
    })
    /* Chunks must be a multiple of 320 KiB, per Graph, and the final one is
       whatever is left. A size that is not a multiple is accepted and then
       fails at commit with an unhelpful error. */
    const CHUNK = 320 * 1024 * 10
    let offset = 0
    let last = null
    while (offset < bytes.byteLength) {
      const end = Math.min(offset + CHUNK, bytes.byteLength)
      const slice = bytes.subarray(offset, end)
      const res = await this.fetch(session.uploadUrl, {
        method: 'PUT',
        headers: {
          'content-length': String(slice.byteLength),
          'content-range': `bytes ${offset}-${end - 1}/${bytes.byteLength}`,
        },
        body: Buffer.from(slice),
      })
      if (!res.ok) throw new ValidationError(`sharepoint: chunk upload failed (${res.status})`, { connector: 'sharepoint', status: res.status })
      last = await res.json().catch(() => null)
      offset = end
    }
    return last
  }

  updateItem(driveId, itemId, fields) { return this.http.patch(`drives/${driveId}/items/${itemId}`, { body: fields }) }
  async deleteItem(driveId, itemId) { await this.http.delete(`drives/${driveId}/items/${itemId}`); return true }
  createFolder(driveId, parentId, name, conflict = 'fail') {
    const path = parentId === 'root' ? `drives/${driveId}/root/children` : `drives/${driveId}/items/${parentId}/children`
    return this.http.post(path, { body: { name, folder: {}, '@microsoft.graph.conflictBehavior': conflict } })
  }
}

export default SharePoint
