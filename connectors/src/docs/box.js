import { HttpClient } from '../core/http.js'
import { paginate, collect } from '../core/paginate.js'
import { ValidationError } from '../core/errors.js'

/* Box.
 *
 * Bearer token throughout. A developer token from the console is fine for
 * testing and lasts an hour; anything real wants a JWT or client-credentials
 * app, so `accessToken` accepts a function and is re-read per request.
 *
 * Two hosts, which is easy to miss: api.box.com for everything, and
 * upload.box.com for file content. Posting an upload at api.box.com fails in a
 * way the error message does not explain.
 *
 * Folder listings page by marker; search pages by offset and is capped at
 * offset 10,000 by Box, so a search that walks past that stops rather than
 * looping.
 */
const SEARCH_OFFSET_CEILING = 10_000

export class Box {
  /**
   * @param {object} cfg
   * @param {string|(() => string|Promise<string>)} cfg.accessToken
   */
  constructor(cfg) {
    if (!cfg?.accessToken) throw new ValidationError('box: accessToken is required', { connector: 'box' })
    const token = typeof cfg.accessToken === 'function' ? cfg.accessToken : () => cfg.accessToken
    const authHeaders = async () => ({ authorization: `Bearer ${await token()}` })
    const common = { connector: 'box', fetch: cfg.fetch, timeout: cfg.timeout, authHeaders }
    this.http = new HttpClient({ ...common, baseUrl: 'https://api.box.com/2.0' })
    this.uploads = new HttpClient({ ...common, baseUrl: 'https://upload.box.com/api/2.0' })
  }

  async ping() {
    const me = await this.http.get('users/me', { query: { fields: 'id,login' } })
    return { ok: true, user: me?.login, id: me?.id }
  }

  /* ---- folders ---- */

  items(folderId = '0', opts = {}) {
    const limit = opts.pageSize ?? 200
    return paginate(
      async (marker) => {
        const r = await this.http.get(`folders/${encodeURIComponent(folderId)}/items`, {
          query: {
            limit, marker, usemarker: true,
            fields: opts.fields ?? 'id,type,name,size,modified_at,parent,sha1',
          },
        })
        return { items: r?.entries ?? [], next: r?.next_marker || null }
      },
      { limit: opts.limit ?? Infinity },
    )
  }

  async allItems(folderId, opts) { return collect(this.items(folderId, opts)) }

  getFolder(id = '0') { return this.http.get(`folders/${encodeURIComponent(id)}`) }
  createFolder(name, parentId = '0') {
    return this.http.post('folders', { body: { name, parent: { id: String(parentId) } } })
  }
  updateFolder(id, fields) { return this.http.put(`folders/${encodeURIComponent(id)}`, { body: fields }) }
  /* recursive is required by Box to delete anything non-empty, and the default
     of false produces a 400 that reads like a permissions problem. */
  async deleteFolder(id, { recursive = true } = {}) {
    await this.http.delete(`folders/${encodeURIComponent(id)}`, { query: { recursive } })
    return true
  }

  /* ---- files ---- */

  getFile(id) { return this.http.get(`files/${encodeURIComponent(id)}`) }

  /** @returns {Promise<ArrayBuffer>} */
  async download(id) {
    const res = await this.http.get(`files/${encodeURIComponent(id)}/content`, { raw: true, headers: { accept: '*/*' } })
    return res.arrayBuffer()
  }

  /** Multipart upload of a new file. Box requires the attributes part first. */
  async upload({ name, parentId = '0', data, contentType = 'application/octet-stream' }) {
    const form = new FormData()
    form.append('attributes', JSON.stringify({ name, parent: { id: String(parentId) } }))
    form.append('file', new Blob([data], { type: contentType }), name)
    const r = await this.uploads.post('files/content', { body: form })
    return r?.entries?.[0] ?? r
  }

  /** New version of an existing file, which keeps its id and version history. */
  async uploadVersion(fileId, { name, data, contentType = 'application/octet-stream' }) {
    const form = new FormData()
    if (name) form.append('attributes', JSON.stringify({ name }))
    form.append('file', new Blob([data], { type: contentType }), name ?? 'file')
    const r = await this.uploads.post(`files/${encodeURIComponent(fileId)}/content`, { body: form })
    return r?.entries?.[0] ?? r
  }

  updateFile(id, fields) { return this.http.put(`files/${encodeURIComponent(id)}`, { body: fields }) }
  async deleteFile(id) { await this.http.delete(`files/${encodeURIComponent(id)}`); return true }
  copyFile(id, parentId, name) {
    return this.http.post(`files/${encodeURIComponent(id)}/copy`, { body: { parent: { id: String(parentId) }, name } })
  }

  /* ---- search ---- */

  search(query, opts = {}) {
    const limit = Math.min(opts.pageSize ?? 100, 200)
    return paginate(
      async (offset = 0) => {
        if (offset >= SEARCH_OFFSET_CEILING) return { items: [], next: null }
        const r = await this.http.get('search', {
          query: {
            query, limit, offset,
            scope: opts.scope, type: opts.type, file_extensions: opts.fileExtensions,
            ancestor_folder_ids: opts.ancestorFolderIds,
            fields: opts.fields ?? 'id,type,name,size,modified_at,parent',
          },
        })
        const items = r?.entries ?? []
        const nextOffset = offset + limit
        return { items, next: items.length === limit && nextOffset < SEARCH_OFFSET_CEILING ? nextOffset : null }
      },
      { limit: opts.limit ?? Infinity },
    )
  }

  async searchAll(query, opts) { return collect(this.search(query, opts)) }
}

export default Box
